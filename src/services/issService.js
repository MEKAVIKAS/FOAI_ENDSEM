import { issApi, geoApi } from "../api/client";
import {
  ISS_LOCATION_ENDPOINT,
  ASTRONAUTS_ENDPOINT,
  REVERSE_GEO_API,
} from "../constants";
import { getStorageWithExpiration, setStorageWithExpiration } from "../utils/helpers";

/**
 * Fetch current ISS location
 */
export const fetchISSLocation = async () => {
  try {
    const response = await issApi.get("/iss/data.json");
    if (response.data && response.data.iss_position) {
      return {
        latitude: parseFloat(response.data.iss_position.latitude),
        longitude: parseFloat(response.data.iss_position.longitude),
        timestamp: response.data.timestamp,
      };
    }
    throw new Error("Invalid ISS data format");
  } catch (error) {
    console.error("Error fetching ISS location:", error);
    throw error;
  }
};

/**
 * Fetch astronauts currently in space
 */
export const fetchAstronauts = async () => {
  const cacheKey = "astronauts_data";
  const cachedData = getStorageWithExpiration(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await issApi.get("/astros.json");
    if (response.data) {
      const data = {
        total: response.data.number,
        astronauts: response.data.people,
      };
      setStorageWithExpiration(cacheKey, data, 30); // Cache for 30 minutes
      return data;
    }
    throw new Error("Invalid astronauts data format");
  } catch (error) {
    console.error("Error fetching astronauts:", error);
    throw error;
  }
};

/**
 * Reverse geocode coordinates to get location name
 */
export const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await geoApi.get("/reverse", {
      params: {
        format: "json",
        lat: latitude,
        lon: longitude,
        zoom: 10,
      },
    });

    if (response.data && response.data.address) {
      const address = response.data.address;
      const city = address.city || address.town || address.village || "Unknown";
      const country = address.country || "Unknown";

      // Check if it's over ocean
      if (address.name && (address.name.includes("Ocean") || address.name.includes("Sea"))) {
        return {
          city: "Over Ocean",
          country: address.name,
          type: "ocean",
        };
      }

      return {
        city,
        country,
        type: "land",
      };
    }
  } catch (error) {
    console.error("Error reverse geocoding:", error);
  }

  // If reverse geocoding fails, try to determine if over ocean
  if (latitude > 84 || latitude < -80) {
    return {
      city: "Polar Region",
      country: "Unknown",
      type: "unknown",
    };
  }

  return {
    city: "Unknown Location",
    country: "Unknown",
    type: "unknown",
  };
};

/**
 * Get ISS pass times for a specific location
 */
export const fetchISSPassTimes = async (latitude, longitude, n = 5) => {
  try {
    const response = await issApi.get("/iss/over.json", {
      params: {
        lat: latitude,
        lon: longitude,
        n,
      },
    });

    if (response.data && response.data.response) {
      return response.data.response.map((pass) => ({
        risetime: pass.risetime,
        riseaz: pass.riseaz,
        duration: pass.duration,
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching ISS pass times:", error);
    return [];
  }
};
