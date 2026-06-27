import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ISSPage from "../pages/ISSPage";

/**
 * Application router configuration.
 * Exclusively routes to the ISS Tracker.
 */
const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <ISSPage /> },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
