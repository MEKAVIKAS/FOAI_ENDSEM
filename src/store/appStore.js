import { create } from "zustand";

const useAppStore = create((set) => ({
  // ISS State
  iss: null,
  issLoading: false,
  issError: null,
  issPositions: [],
  speedHistory: [],
  location: null,

  // News State
  news: [],
  newsLoading: false,
  newsError: null,
  selectedCategory: "technology",
  searchQuery: "",
  sortBy: "newest",

  // Astronauts State
  astronauts: null,
  astronautsLoading: false,
  astronautsError: null,

  // Chat State
  chatMessages: [],
  chatLoading: false,
  chatError: null,

  // Theme State
  theme: localStorage.getItem("app_theme") || "auto",
  isDark: window.matchMedia("(prefers-color-scheme: dark)").matches,

  // UI State
  sidebarOpen: true,
  chatOpen: false,
  fullscreenMap: false,

  // Actions - ISS
  setISS: (data) =>
    set((state) => ({
      iss: data,
      issPositions: data
        ? [...state.issPositions.slice(-14), data]
        : state.issPositions,
    })),
  setISSLoading: (loading) => set({ issLoading: loading }),
  setISSError: (error) => set({ issError: error }),
  setSpeedHistory: (history) => set({ speedHistory: history }),
  addSpeedData: (speed) =>
    set((state) => ({
      speedHistory: [...state.speedHistory.slice(-29), speed],
    })),
  setLocation: (location) => set({ location }),

  // Actions - News
  setNews: (news) => set({ news }),
  setNewsLoading: (loading) => set({ newsLoading: loading }),
  setNewsError: (error) => set({ newsError: error }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortBy: (sort) => set({ sortBy: sort }),

  // Actions - Astronauts
  setAstronauts: (astronauts) => set({ astronauts }),
  setAstronautsLoading: (loading) => set({ astronautsLoading: loading }),
  setAstronautsError: (error) => set({ astronautsError: error }),

  // Actions - Chat
  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [...state.chatMessages, message],
    })),
  setChatLoading: (loading) => set({ chatLoading: loading }),
  setChatError: (error) => set({ chatError: error }),
  clearChatMessages: () => set({ chatMessages: [] }),

  // Actions - Theme
  setTheme: (theme) => {
    localStorage.setItem("app_theme", theme);
    set({ theme });
    applyTheme(theme);
  },
  setIsDark: (isDark) => set({ isDark }),

  // Actions - UI
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setChatOpen: (open) => set({ chatOpen: open }),
  setFullscreenMap: (fullscreen) => set({ fullscreenMap: fullscreen }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleChat: () => set((state) => ({ chatOpen: !state.chatOpen })),
  toggleFullscreenMap: () =>
    set((state) => ({ fullscreenMap: !state.fullscreenMap })),
}));

/**
 * Apply theme to document
 */
const applyTheme = (theme) => {
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
};

export default useAppStore;
