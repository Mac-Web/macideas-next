import {
  FaCalendarDay,
  FaCheckCircle,
  FaClock,
  FaStar,
  FaSun,
} from "react-icons/fa";
import { FaCalendarCheck } from "react-icons/fa6";

export const priorities = [
  { name: "None", value: 0 },
  { name: "Low", color: "bg-green-800", value: 1 },
  { name: "Medium", color: "bg-yellow-800", value: 2 },
  { name: "High", color: "bg-red-900", value: 3 },
];

export const dashboardSettings = [
  { id: 0, name: "Daily tasks", icon: <FaSun size={40} /> },
  { id: 1, name: "Due soon", icon: <FaCalendarCheck size={40} /> },
  { id: 2, name: "Priority tasks", icon: <FaCheckCircle size={40} /> },
  { id: 3, name: "Start soon", icon: <FaCalendarDay size={40} /> },
  { id: 4, name: "Starred tasks", icon: <FaStar size={40} /> },
  { id: 5, name: "Tasks with tag" },
  { id: 6, name: "Recent tasks", icon: <FaClock size={40} /> },
];
