import { NavLink } from "react-router-dom";
import { FaHome, FaDumbbell, FaChartLine, FaCog } from "react-icons/fa";
import "./BottomNavBar.scss";

export default function BottomNavBar() {
  return (
    <nav className="bottom-nav">
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
      >
        <FaHome className="icon" />
      </NavLink>
      <NavLink
        to="/workouts"  // Navigate to all workouts page
        className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
      >
        <FaDumbbell className="icon" />
      </NavLink>
      <NavLink
        to="/progress"
        className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
      >
        <FaChartLine className="icon" />
      </NavLink>
      <NavLink
        to="/goals"
        className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
      >
        <FaCog className="icon" />
      </NavLink>
    </nav>
  );
}

