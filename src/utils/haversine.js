export const EARTH_RADIUS_KM = 6371.0088;

export const toRadians = (degrees) => (degrees * Math.PI) / 180;

export const haversineDistanceKm = (lat1, lon1, lat2, lon2) => {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const startLat = toRadians(lat1);
  const endLat = toRadians(lat2);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(startLat) * Math.cos(endLat) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
};

export const calculateSpeedKmh = (distanceKm, elapsedSeconds) => {
  if (!Number.isFinite(distanceKm) || !Number.isFinite(elapsedSeconds) || elapsedSeconds <= 0) {
    return 0;
  }

  return distanceKm / (elapsedSeconds / 3600);
};
