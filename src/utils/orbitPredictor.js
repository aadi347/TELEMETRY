/**
 * Predicts the future path of the ISS for the next orbit (~90 minutes).
 * Uses spherical trigonometry and accounts for the Earth's rotation.
 *
 * @param {Object} currentData - { latitude, longitude, altitude }
 * @param {Array} history - Array of previous coordinates to determine heading
 * @returns {Array} - Array of predicted { latitude, longitude, altitude } points
 */
export const generatePredictedPath = (currentData, history) => {
  if (!currentData || !history || history.length < 2) return [];

  // 1. Determine direction (ascending vs descending)
  const lastPoint = history[history.length - 1];
  const prevPoint = history[history.length - 2];
  const isAscending = lastPoint.latitude > prevPoint.latitude;

  // Constants for ISS Orbit
  const inclinationRad = 51.64 * (Math.PI / 180); // Orbital Inclination
  const periodMinutes = 92.9; // Time for one full orbit

  // 2. Calculate current phase (angle theta from the ascending node)
  const latRad = currentData.latitude * (Math.PI / 180);
  
  // sin(lat) = sin(inclination) * sin(theta)
  let sinTheta = Math.sin(latRad) / Math.sin(inclinationRad);
  // Clamp to avoid NaN due to floating point precision near peaks
  sinTheta = Math.max(-1, Math.min(1, sinTheta));
  
  let theta0 = Math.asin(sinTheta);
  
  // If moving south (descending), theta is past the peak (PI/2)
  if (!isAscending) {
    theta0 = Math.PI - theta0;
  }

  // 3. Find the longitude of the ascending node at t=0
  // lon(theta) = ascending_node_lon + atan2(cos(i)*sin(theta), cos(theta))
  const currentLonOrbitRad = Math.atan2(Math.cos(inclinationRad) * Math.sin(theta0), Math.cos(theta0));
  const currentLonRad = currentData.longitude * (Math.PI / 180);
  const ascendingNodeLonRad = currentLonRad - currentLonOrbitRad;

  // 4. Generate future points
  const predictedPath = [];
  const pointsToGenerate = 90; // Generate 1 point per minute for 90 mins

  for (let t = 1; t <= pointsToGenerate; t++) {
    // New theta after t minutes
    const theta = theta0 + (2 * Math.PI * t / periodMinutes);
    
    // Future Latitude
    const futureLatRad = Math.asin(Math.sin(inclinationRad) * Math.sin(theta));
    const futureLat = futureLatRad * (180 / Math.PI);
    
    // Future Longitude (subtracting Earth's rotation of 360 degrees per 24h)
    const earthRotationRad = (2 * Math.PI * t) / (24 * 60); 
    let futureLonRad = ascendingNodeLonRad + Math.atan2(Math.cos(inclinationRad) * Math.sin(theta), Math.cos(theta)) - earthRotationRad;
    
    // Normalize Longitude to -180 to 180
    futureLonRad = (futureLonRad + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
    const futureLon = futureLonRad * (180 / Math.PI);
    
    predictedPath.push({
      latitude: futureLat,
      longitude: futureLon,
      altitude: currentData.altitude, // Approximation: keep altitude constant
    });
  }
  
  return predictedPath;
};
