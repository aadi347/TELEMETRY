/**
 * Converts Latitude, Longitude, and Altitude to 3D Cartesian Coordinates (x, y, z)
 * suitable for Three.js.
 * 
 * @param {number} lat - Latitude in degrees
 * @param {number} lon - Longitude in degrees
 * @param {number} alt - Altitude in kilometers
 * @param {number} globeRadius - The base radius of the 3D globe (e.g., 2)
 * @returns {THREE.Vector3} - An object with x, y, z properties
 */
export function latLonToCartesian(lat, lon, alt = 400, globeRadius = 2) {
  // Convert degrees to radians
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  // Earth's radius is roughly 6371 km. We scale the altitude relative to the globe's radius.
  const earthRadiusKm = 6371;
  const scaledAltitude = (alt / earthRadiusKm) * globeRadius;
  
  // The distance from the center of the globe
  const r = globeRadius + scaledAltitude;

  // Spherical to Cartesian conversion for Three.js
  // Note: Three.js uses a Y-up coordinate system
  const x = -(r * Math.sin(phi) * Math.cos(theta));
  const z = (r * Math.sin(phi) * Math.sin(theta));
  const y = (r * Math.cos(phi));

  return { x, y, z };
}
