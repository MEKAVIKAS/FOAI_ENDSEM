import { issApi, geoApi } from "../api/client";
import { getStorageWithExpiration, setStorageWithExpiration } from "../utils/helpers";

/**
 * Fetch current ISS location
 */
export const fetchISSLocation = async () => {
  try {
    let response;
    try {
      response = await issApi.get("/api/iss-now");
      if (!response.data?.iss_position) {
        throw new Error("Local API proxy unavailable");
      }
    } catch {
      response = await issApi.get("http://api.open-notify.org/iss-now.json");
    }

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
    let response;
    try {
      response = await issApi.get("/api/astros");
      if (!response.data?.people) {
        throw new Error("Local API proxy unavailable");
      }
    } catch {
      response = await issApi.get("http://api.open-notify.org/astros.json");
    }

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
    let response;
    try {
      response = await issApi.get("/api/reverse", {
        params: { lat: latitude, lon: longitude },
      });
      if (!response.data || typeof response.data !== "object" || !("address" in response.data)) {
        throw new Error("Local API proxy unavailable");
      }
    } catch {
      response = await geoApi.get("/reverse", {
        params: {
          format: "json",
          lat: latitude,
          lon: longitude,
          zoom: 10,
          addressdetails: 1,
        },
      });
    }

    if (response.data && response.data.address) {
      const address = response.data.address;
      const city =
        address.city ||
        address.town ||
        address.village ||
        address.hamlet ||
        address.county ||
        null;
      const country = address.country || "Unknown";
      const water =
        address.ocean ||
        address.sea ||
        address.bay ||
        address.water ||
        response.data.name;

      if (!city && water) {
        return {
          city: "Over Ocean",
          country: water,
          type: "ocean",
        };
      }

      return {
        city: city || "Over Ocean",
        country,
        type: city ? "land" : "ocean",
      };
    }
  } catch (error) {
    console.warn("Reverse geocoding unavailable:", error.message || error);
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
    city: "Over Ocean",
    country: "Unknown waters",
    type: "ocean",
  };
};

/**
 * Get ISS pass times for a specific location
 */
export const fetchISSPassTimes = async (latitude, longitude, n = 5) => {
  try {
    const response = await issApi.get("http://api.open-notify.org/iss-pass.json", {
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
