import { motion } from "framer-motion";

/**
 * Wraps page content with smooth enter/exit transitions.
 * Use inside route elements for animated page transitions.
 * @param {object} props
 * @param {React.ReactNode} props.children
 */
const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
