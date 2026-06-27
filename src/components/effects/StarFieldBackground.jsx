import { useMemo } from "react";

/**
 * Full-screen animated starfield background.
 * Generates stars with randomized positions, sizes, and animation delays.
 * Pure CSS implementation for performance.
 */
const StarFieldBackground = () => {
  // Generate star data once
  const stars = useMemo(() => {
    const starArray = [];
    for (let i = 0; i < 200; i++) {
      starArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 0.5,
        delay: Math.random() * 6,
        duration: Math.random() * 3 + 3,
        opacity: Math.random() * 0.7 + 0.1,
      });
    }
    return starArray;
  }, []);

  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default StarFieldBackground;
