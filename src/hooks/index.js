import { useEffect, useCallback, useRef } from "react";
import { fetchISSLocation, reverseGeocode, fetchAstronauts } from "../services/issService";
import { calculateSpeed, haversine } from "../utils/helpers";
import useAppStore from "../store/appStore";
import { ISS_UPDATE_INTERVAL } from "../constants";
import toast from "react-hot-toast";

/**
 * Custom hook for ISS tracking
 */
export const useISSTracking = () => {
  const store = useAppStore();
  const previousPosition = useRef(null);
  const updateTimeRef = useRef(null);

  const updateISS = useCallback(async () => {
    const actions = useAppStore.getState();
    try {
      actions.setISSLoading(true);
      actions.setApiStatus("iss", "loading");
      const data = await fetchISSLocation();

      // Calculate speed
      let speed = 0;
      if (previousPosition.current && updateTimeRef.current) {
        const distance = haversine(
          previousPosition.current.latitude,
          previousPosition.current.longitude,
          data.latitude,
          data.longitude
        );
        const timeDiff = Date.now() - updateTimeRef.current;
        speed = parseFloat(
          calculateSpeed(distance, timeDiff / 1000)
        );
      }

      // Get location name
      const location = await reverseGeocode(data.latitude, data.longitude);

      // Update store
      actions.setISS({
        ...data,
        speed: speed || 27600, // Average ISS speed is about 7.66 km/s.
        lastUpdate: new Date().toLocaleString(),
      });

      actions.setLocation(location);

      // Add to speed history
      actions.addSpeedData({
        time: new Date().toLocaleTimeString(),
        speed: speed || 27600,
        timestamp: Date.now(),
      });

      previousPosition.current = data;
      updateTimeRef.current = Date.now();

      actions.setISSError(null);
      actions.setApiStatus("iss", "online");
      if (useAppStore.getState().soundEnabled) {
        toast.success("New ISS update", { id: "iss-update", duration: 1200 });
      }
    } catch (error) {
      console.error("Error updating ISS:", error);
      actions.setISSError(error.message || "Failed to fetch ISS data");
      actions.setApiStatus("iss", "error");
      toast.error("Failed to update ISS data");
    } finally {
      actions.setISSLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch immediately
    updateISS();

    // Set up interval
    const interval = setInterval(updateISS, ISS_UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [updateISS]);

  return {
    iss: store.iss,
    loading: store.issLoading,
    error: store.issError,
    positions: store.issPositions,
    speedHistory: store.speedHistory,
    location: store.location,
    refetch: updateISS,
  };
};

/**
 * Custom hook for fetching astronauts
 */
export const useAstronauts = () => {
  const store = useAppStore();

  const fetchData = useCallback(async () => {
    const actions = useAppStore.getState();
    try {
      actions.setAstronautsLoading(true);
      actions.setApiStatus("astronauts", "loading");
      const data = await fetchAstronauts();
      actions.setAstronauts({
        total: data.total,
        list: data.astronauts,
      });
      actions.setAstronautsError(null);
      actions.setApiStatus("astronauts", "online");
    } catch (error) {
      console.error("Error fetching astronauts:", error);
      actions.setAstronautsError(error.message || "Failed to fetch astronauts");
      actions.setApiStatus("astronauts", "error");
      toast.error("Failed to fetch astronaut data");
    } finally {
      actions.setAstronautsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return {
    astronauts: store.astronauts,
    loading: store.astronautsLoading,
    error: store.astronautsError,
    refetch: fetchData,
  };
};

/**
 * Custom hook for theme management
 */
export const useTheme = () => {
  const theme = useAppStore((state) => state.theme);
  const isDark = useAppStore((state) => state.isDark);
  const setTheme = useAppStore((state) => state.setTheme);

  useEffect(() => {
    // Apply theme on mount
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
    } else if (theme === "light") {
      html.classList.remove("dark");
    } else if (theme === "auto") {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemTheme = () => {
      if (useAppStore.getState().theme === "auto") {
        html.classList.toggle("dark", media.matches);
        useAppStore.getState().setIsDark(media.matches);
      }
    };

    handleSystemTheme();
    media.addEventListener("change", handleSystemTheme);
    return () => media.removeEventListener("change", handleSystemTheme);
  }, [theme]);

  const toggleTheme = () => {
    const themes = ["light", "dark", "auto"];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
    toast.success(`Theme changed to ${nextTheme}`);
  };

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
  };
};

/**
 * Custom hook for managing sidebar on mobile
 */
export const useSidebar = () => {
  const store = useAppStore();

  useEffect(() => {
    // Close sidebar on mobile by default
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        useAppStore.getState().setSidebarOpen(false);
      } else {
        useAppStore.getState().setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return {
    sidebarOpen: store.sidebarOpen,
    toggleSidebar: store.toggleSidebar,
    setSidebarOpen: store.setSidebarOpen,
  };
};
