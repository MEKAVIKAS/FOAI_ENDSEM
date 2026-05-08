import axios from "axios";

const createApiClient = (baseURL = "") => {
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return client;
};

export const issApi = createApiClient("");
export const newsApi = createApiClient("https://newsapi.org/v2");
export const geoApi = createApiClient("https://nominatim.openstreetmap.org");

export default {
  issApi,
  newsApi,
  geoApi,
};
