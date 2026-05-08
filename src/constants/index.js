// ISS API
export const ISS_API_BASE = "http://api.open-notify.org";
export const ISS_LOCATION_ENDPOINT = `${ISS_API_BASE}/iss-now.json`;
export const ASTRONAUTS_ENDPOINT = `${ISS_API_BASE}/astros.json`;
export const ISS_PASS_ENDPOINT = `${ISS_API_BASE}/iss/over.json`;

// News API
export const NEWS_API_BASE = "https://newsapi.org/v2";
export const NEWS_CATEGORIES = [
  "technology",
  "space",
  "ai",
  "world",
  "science",
];

export const NEWS_CATEGORY_LABELS = {
  technology: "Technology",
  space: "Space",
  ai: "AI",
  world: "World",
  science: "Science",
};

// Cache Keys
export const CACHE_KEYS = {
  ISS_DATA: "iss_data",
  NEWS_ARTICLES: "news_articles",
  ASTRONAUTS: "astronauts",
  CHAT_HISTORY: "chat_history",
  THEME: "app_theme",
  SPEED_HISTORY: "speed_history",
  BOOKMARKS: "news_bookmarks",
  SOUND: "sound_enabled",
};

// Cache Duration (in minutes)
export const CACHE_DURATION = {
  ISS_DATA: 1,
  NEWS_DATA: 15,
  ASTRONAUTS: 30,
};

// ISS Update Interval (in milliseconds)
export const ISS_UPDATE_INTERVAL = 15000; // 15 seconds

// Reverse Geocoding API
export const REVERSE_GEO_API = "https://nominatim.openstreetmap.org/reverse";

// Leaflet Settings
export const MAP_CENTER = [0, 0];
export const MAP_ZOOM = 2;
export const MAP_MIN_ZOOM = 1;
export const MAP_MAX_ZOOM = 18;

// Chart Colors
export const CHART_COLORS = {
  blue: "#3b82f6",
  red: "#ef4444",
  green: "#10b981",
  yellow: "#f59e0b",
  purple: "#8b5cf6",
  pink: "#ec4899",
  cyan: "#06b6d4",
  lime: "#84cc16",
};

// Toast Config
export const TOAST_CONFIG = {
  success: {
    duration: 3000,
  },
  error: {
    duration: 4000,
  },
  loading: {
    duration: Infinity,
  },
};

// Pagination
export const ITEMS_PER_PAGE = 10;

// AI Chatbot
export const MAX_CHAT_HISTORY = 30;
export const AI_MODEL = "mistralai/Mistral-7B-Instruct-v0.2";
export const SYSTEM_PROMPT = `You are an AI assistant for an ISS and News Dashboard. You must answer ONLY using the provided dashboard data context. Never use external knowledge or make up information. If information is unavailable in the provided data, respond with: "I can only answer using the dashboard's current ISS and news data."`;

// Theme
export const THEME_OPTIONS = ["light", "dark", "auto"];
export const DEFAULT_THEME = "auto";
