import axios from "axios";

const ISS_API_URL = "https://api.wheretheiss.at/v1/satellites/25544";

/**
 * Fetches real-time telemetry data for the International Space Station.
 * Returns an object containing latitude, longitude, altitude, velocity, and visibility.
 */
export const getLiveISSData = async () => {
  try {
    const response = await axios.get(ISS_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching ISS data:", error);
    throw error;
  }
};
