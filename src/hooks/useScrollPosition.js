import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook to track the window scroll Y position.
 * Uses requestAnimationFrame for throttled, performant updates.
 * @returns {number} Current scrollY value
 */
export function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    requestAnimationFrame(() => {
      setScrollY(window.scrollY);
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return scrollY;
}
