import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import StarFieldBackground from "../components/effects/StarFieldBackground";
import GridOverlay from "../components/effects/GridOverlay";
import AuroraGlow from "../components/effects/AuroraGlow";
import PageTransition from "../components/layout/PageTransition";

/**
 * Main layout — wraps all pages with background effects.
 * Provides animated page transitions via AnimatePresence.
 */
const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="relative min-h-screen bg-bg-primary">
      {/* Fixed Background Effects */}
      <StarFieldBackground />
      <GridOverlay />
      <AuroraGlow />

      {/* Page Content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MainLayout;
