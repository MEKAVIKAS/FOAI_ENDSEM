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
    try {
      store.setISSLoading(true);
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
      store.setISS({
        ...data,
        speed: speed || 7660, // Average ISS speed ~7.66 km/s
        lastUpdate: new Date().toLocaleString(),
      });

      store.setLocation(location);

      // Add to speed history
      store.addSpeedData({
        time: new Date().toLocaleTimeString(),
        speed: speed || 7660,
        timestamp: Date.now(),
      });

      previousPosition.current = data;
      updateTimeRef.current = Date.now();

      store.setISSError(null);
    } catch (error) {
      console.error("Error updating ISS:", error);
      store.setISSError(error.message || "Failed to fetch ISS data");
      toast.error("Failed to update ISS data");
    } finally {
      store.setISSLoading(false);
    }
  }, [store]);

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
    try {
      store.setAstronautsLoading(true);
      const data = await fetchAstronauts();
      store.setAstronauts({
        total: data.total,
        list: data.astronauts,
      });
      store.setAstronautsError(null);
    } catch (error) {
      console.error("Error fetching astronauts:", error);
      store.setAstronautsError(error.message || "Failed to fetch astronauts");
      toast.error("Failed to fetch astronaut data");
    } finally {
      store.setAstronautsLoading(false);
    }
  }, [store]);

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
  const store = useAppStore();

  useEffect(() => {
    // Apply theme on mount
    const html = document.documentElement;
    if (store.theme === "dark") {
      html.classList.add("dark");
    } else if (store.theme === "light") {
      html.classList.remove("dark");
    } else if (store.theme === "auto") {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }
    }
  }, [store.theme]);

  const toggleTheme = () => {
    const themes = ["light", "dark", "auto"];
    const currentIndex = themes.indexOf(store.theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    store.setTheme(nextTheme);
    toast.success(`Theme changed to ${nextTheme}`);
  };

  return {
    theme: store.theme,
    isDark: store.isDark,
    setTheme: store.setTheme,
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
        store.setSidebarOpen(false);
      } else {
        store.setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [store]);

  return {
    sidebarOpen: store.sidebarOpen,
    toggleSidebar: store.toggleSidebar,
    setSidebarOpen: store.setSidebarOpen,
  };
};
