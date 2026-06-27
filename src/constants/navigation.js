import {
  RiDashboardLine,
  RiEarthLine,
  RiSpaceShipLine,
  RiRocketLine,
  RiUserLine,
  RiSunLine,
  RiSettings3Line,
  RiHome4Line,
} from "react-icons/ri";

/**
 * Navigation links displayed in the top Navbar.
 */
export const NAV_LINKS = [
  { label: "Home", path: "/", icon: RiHome4Line },
  { label: "Dashboard", path: "/dashboard", icon: RiDashboardLine },
  { label: "ISS Tracker", path: "/iss", icon: RiEarthLine },
  { label: "Satellites", path: "/satellites", icon: RiSpaceShipLine },
  { label: "Launches", path: "/launches", icon: RiRocketLine },
  { label: "Astronauts", path: "/astronauts", icon: RiUserLine },
  { label: "Weather", path: "/weather", icon: RiSunLine },
];

/**
 * Sidebar navigation items for the Dashboard layout.
 */
export const SIDEBAR_ITEMS = [
  { label: "Mission Control", path: "/dashboard", icon: RiDashboardLine },
  { label: "ISS Tracker", path: "/iss", icon: RiEarthLine },
  { label: "Satellites", path: "/satellites", icon: RiSpaceShipLine },
  { label: "Launch Center", path: "/launches", icon: RiRocketLine },
  { label: "Astronaut Hub", path: "/astronauts", icon: RiUserLine },
  { label: "Space Weather", path: "/weather", icon: RiSunLine },
  { label: "Settings", path: "/settings", icon: RiSettings3Line },
];
