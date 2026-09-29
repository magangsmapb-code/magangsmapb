const defaultRadiusMeters = 50;

export const SCHOOL_TARGET = {
  lat: -7.932537,
  lng: 111.31591,
  radiusMeters: defaultRadiusMeters,
  allowedAccuracyMeters: 30,
};

export function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const earthRadiusKm = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c * 1000;
}

export function isLikelyMockGPS(accuracy: number | undefined) {
  return typeof accuracy === 'number' && accuracy > SCHOOL_TARGET.allowedAccuracyMeters;
}
