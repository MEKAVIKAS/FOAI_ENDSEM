/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Calculate speed based on distance and time difference
 * Returns speed in km/h
 */
export const calculateSpeed = (distance, timeInSeconds) => {
  if (timeInSeconds === 0) return 0;
  const hours = timeInSeconds / 3600;
  return (distance / hours).toFixed(2);
};

/**
 * Format timestamp to readable date string
 */
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
};

/**
 * Format time difference in human readable format
 */
export const formatTimeAgo = (timestamp) => {
  const now = Date.now() / 1000;
  const diff = now - timestamp;

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

/**
 * Debounce function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Get localStorage item with expiration
 */
export const getStorageWithExpiration = (key) => {
  const item = localStorage.getItem(key);
  if (!item) return null;

  try {
    const data = JSON.parse(item);
    if (data.expiration && Date.now() > data.expiration) {
      localStorage.removeItem(key);
      return null;
    }
    return data.value;
  } catch (error) {
    console.error("Error parsing localStorage item:", error);
    return null;
  }
};

/**
 * Set localStorage item with expiration (in minutes)
 */
export const setStorageWithExpiration = (key, value, expirationMinutes = 15) => {
  const data = {
    value,
    expiration: Date.now() + expirationMinutes * 60 * 1000,
  };
  localStorage.setItem(key, JSON.stringify(data));
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text, length) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
};

/**
 * Check if element is in viewport
 */
export const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Get random color
 */
export const getRandomColor = () => {
  const colors = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Format large numbers with K, M, B suffix
 */
export const formatNumber = (num) => {
  if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
  return num.toString();
};
