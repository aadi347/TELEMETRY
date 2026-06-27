import { cn } from "../../utils/cn";

/**
 * Renders children with a gradient text effect.
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className] - Additional Tailwind classes
 * @param {"default"|"warm"} [props.variant="default"] - Gradient variant
 */
const GradientText = ({ children, className, variant = "default" }) => {
  return (
    <span
      className={cn(
        "bg-clip-text text-transparent inline-block",
        variant === "warm"
          ? "bg-gradient-to-r from-accent-primary via-purple-500 to-accent-secondary"
          : "bg-gradient-to-r from-accent-primary to-accent-secondary",
        className
      )}
    >
      {children}
    </span>
  );
};

export default GradientText;
