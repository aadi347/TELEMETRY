import { motion } from "framer-motion";

/**
 * Animated aurora-like gradient blobs behind the hero section.
 * Uses Framer Motion for slow, organic drift animations.
 */
const AuroraGlow = () => {
  const blobs = [
    {
      color: "rgba(79, 70, 229, 0.15)",
      size: 600,
      x: "20%",
      y: "15%",
      delay: 0,
    },
    {
      color: "rgba(0, 229, 255, 0.08)",
      size: 500,
      x: "70%",
      y: "20%",
      delay: 2,
    },
    {
      color: "rgba(139, 92, 246, 0.1)",
      size: 450,
      x: "50%",
      y: "60%",
      delay: 4,
    },
    {
      color: "rgba(0, 255, 157, 0.05)",
      size: 400,
      x: "80%",
      y: "70%",
      delay: 6,
    },
  ];

  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: blob.size,
            height: blob.size,
            left: blob.x,
            top: blob.y,
            background: `radial-gradient(circle, ${blob.color}, transparent 70%)`,
            filter: "blur(80px)",
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            x: [0, 30, -20, 15, 0],
            y: [0, -25, 15, -10, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
            opacity: [0.6, 0.8, 0.5, 0.7, 0.6],
          }}
          transition={{
            duration: 12,
            delay: blob.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default AuroraGlow;
