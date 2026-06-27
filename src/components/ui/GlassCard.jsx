import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

/**
 * Reusable glassmorphism card component.
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className] - Additional Tailwind classes
 * @param {boolean} [props.hover=true] - Enable hover lift effect
 * @param {object} [props.style] - Inline styles
 */
const GlassCard = ({ children, className, hover = true, style, ...props }) => {
  return (
    <motion.div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl",
        "transition-all duration-400",
        hover && "hover:border-white/20 hover:bg-white/[0.07]",
        className
      )}
      style={style}
      whileHover={hover ? { y: -4, transition: { duration: 0.3 } } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
