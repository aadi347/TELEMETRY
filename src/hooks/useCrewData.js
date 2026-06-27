import { useState, useEffect } from "react";
import { getLiveCrewData } from "../services/crewService";

/**
 * Custom hook to fetch and manage astronaut data.
 * Since this data rarely changes (only on launches/landings), we only fetch it once per mount.
 */
export function useCrewData() {
  const [crew, setCrew] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const result = await getLiveCrewData();
        if (!isMounted) return;

        // Filter out Tiangong astronauts if we only want ISS, but showing all in space is cool too.
        // The API provides `flights_count` and `time_in_space`.
        setCrew(result);
        setError(null);
        setIsLoading(false);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Failed to fetch Crew data");
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { crew, error, isLoading };
}
