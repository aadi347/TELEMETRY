import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "../../utils/cn";

/**
 * Button component with neon glow hover effect.
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {"primary"|"secondary"} [props.variant="primary"] - Button style
 * @param {string} [props.to] - Internal link (uses React Router Link)
 * @param {string} [props.href] - External link
 * @param {Function} [props.onClick] - Click handler
 * @param {string} [props.className] - Additional Tailwind classes
 * @param {string} [props.id] - Unique ID for accessibility/testing
 */
const GlowButton = ({
  children,
  variant = "primary",
  to,
  href,
  onClick,
  className,
  id,
  ...props
}) => {
  const baseClasses = cn(
    "relative inline-flex items-center justify-center gap-2",
    "px-7 py-3.5 rounded-xl font-medium text-sm",
    "transition-all duration-400 cursor-pointer",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50",
    variant === "primary"
      ? [
          "bg-gradient-to-r from-accent-primary to-accent-primary/80",
          "text-white shadow-lg shadow-accent-primary/25",
          "hover:shadow-xl hover:shadow-accent-primary/40",
        ]
      : [
          "border border-white/20 bg-white/5 backdrop-blur-sm",
          "text-text-primary",
          "hover:border-accent-secondary/40 hover:bg-white/10",
          "hover:shadow-lg hover:shadow-accent-secondary/10",
        ],
    className
  );

  const motionProps = {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.97 },
    transition: { type: "spring", stiffness: 400, damping: 17 },
  };

  // Render as Link if 'to' is provided
  if (to) {
    return (
      <motion.div {...motionProps} className="inline-block">
        <Link to={to} className={baseClasses} id={id} {...props}>
          {children}
        </Link>
      </motion.div>
    );
  }

  // Render as anchor if 'href' is provided
  if (href) {
    return (
      <motion.a
        href={href}
        className={baseClasses}
        id={id}
        {...motionProps}
        {...props}
      >
        {children}
      </motion.a>
    );
  }

  // Default: render as button
  return (
    <motion.button
      className={baseClasses}
      onClick={onClick}
      id={id}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default GlowButton;
