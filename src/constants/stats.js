import {
  RiSpaceShipLine,
  RiUserLine,
  RiRocketLine,
  RiSunLine,
  RiEarthLine,
  RiDashboardLine,
} from "react-icons/ri";
import {
  HiOutlineGlobeAlt,
  HiOutlineChartBar,
} from "react-icons/hi";

/**
 * Placeholder live stats data for the Home page stats grid.
 * Values will be replaced with real API data in Phase 2.
 */
export const LIVE_STATS = [
  {
    id: "satellites",
    label: "Active Satellites",
    value: 8261,
    icon: RiSpaceShipLine,
    suffix: "+",
    color: "#4F46E5",
  },
  {
    id: "astronauts",
    label: "Astronauts In Space",
    value: 14,
    icon: RiUserLine,
    color: "#00E5FF",
  },
  {
    id: "launches",
    label: "Upcoming Launches",
    value: 27,
    icon: RiRocketLine,
    color: "#00FF9D",
  },
  {
    id: "solar",
    label: "Solar Activity",
    value: 73,
    icon: RiSunLine,
    suffix: "%",
    color: "#F59E0B",
  },
];

/**
 * Feature cards data for the Bento Grid section.
 */
export const FEATURES = [
  {
    id: "iss",
    title: "ISS Tracker",
    description:
      "Track the International Space Station in real time across its orbit with live telemetry data.",
    icon: RiEarthLine,
    path: "/iss",
    color: "#4F46E5",
    colSpan: 2,
    rowSpan: 1,
  },
  {
    id: "satellites",
    title: "Satellite Explorer",
    description:
      "Visualize thousands of active satellites orbiting Earth with interactive 3D mapping.",
    icon: RiSpaceShipLine,
    path: "/satellites",
    color: "#00E5FF",
    colSpan: 1,
    rowSpan: 1,
  },
  {
    id: "launches",
    title: "Launch Center",
    description:
      "Stay updated with upcoming rocket launches, countdowns, and mission details worldwide.",
    icon: RiRocketLine,
    path: "/launches",
    color: "#00FF9D",
    colSpan: 1,
    rowSpan: 1,
  },
  {
    id: "astronauts",
    title: "Astronaut Hub",
    description:
      "Explore profiles of astronauts currently in space and historic missions they've undertaken.",
    icon: RiUserLine,
    path: "/astronauts",
    color: "#F59E0B",
    colSpan: 1,
    rowSpan: 1,
  },
  {
    id: "weather",
    title: "Space Weather",
    description:
      "Monitor solar flares, geomagnetic storms, and cosmic radiation levels in real time.",
    icon: HiOutlineGlobeAlt,
    path: "/weather",
    color: "#EF4444",
    colSpan: 1,
    rowSpan: 1,
  },
  {
    id: "analytics",
    title: "Mission Analytics",
    description:
      "Comprehensive analytics dashboard with historical data, trends, and orbital predictions.",
    icon: HiOutlineChartBar,
    path: "/dashboard",
    color: "#8B5CF6",
    colSpan: 2,
    rowSpan: 1,
  },
];
