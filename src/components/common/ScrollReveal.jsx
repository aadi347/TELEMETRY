import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

/**
 * Scroll-triggered animation wrapper using Framer Motion whileInView.
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {"up"|"down"|"left"|"right"|"fade"} [props.direction="up"] - Animation direction
 * @param {number} [props.delay=0] - Animation delay in seconds
 * @param {number} [props.duration=0.6] - Animation duration in seconds
 * @param {string} [props.className] - Additional Tailwind classes
 * @param {number} [props.amount=0.2] - Viewport amount threshold
 */
const ScrollReveal = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  className,
  amount = 0.2,
}) => {
  // Calculate initial position based on direction
  const directionMap = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
    fade: { y: 0, x: 0 },
  };

  const { x, y } = directionMap[direction] || directionMap.up;

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
