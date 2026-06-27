import { useState, useEffect, useRef } from "react";
import { getLiveISSData } from "../services/issService";

const POLLING_INTERVAL = 2000; // 2 seconds
const MAX_HISTORY_POINTS = 100; // Keep track of the last 100 points for charts/trails

/**
 * Custom hook to manage real-time ISS data polling and historical state.
 */
export function useISSData() {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use a ref to keep track of the latest history without adding it to the dependency array of the interval
  const historyRef = useRef([]);

  useEffect(() => {
    let intervalId;
    let isMounted = true;

    const fetchData = async () => {
      try {
        const result = await getLiveISSData();
        if (!isMounted) return;

        setData(result);
        setError(null);
        setIsLoading(false);

        // Build a chart-friendly data point
        const dataPoint = {
          time: new Date(result.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          altitude: result.altitude,
          velocity: result.velocity,
          latitude: result.latitude,
          longitude: result.longitude
        };

        const newHistory = [...historyRef.current, dataPoint].slice(-MAX_HISTORY_POINTS);
        historyRef.current = newHistory;
        setHistory(newHistory);

      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Failed to fetch ISS data");
      }
    };

    // Initial fetch
    fetchData();

    // Set up polling
    intervalId = setInterval(fetchData, POLLING_INTERVAL);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return { data, history, error, isLoading };
}
