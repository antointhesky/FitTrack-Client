// src/components/BottomNavBar/BottomNavBar.jsx
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
        <span>Home</span>
      </NavLink>
      <NavLink
        to="/workouts-overview"  // Navigate to Workouts Overview page
        className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
      >
        <FaDumbbell className="icon" />
        <span>Workouts</span>
      </NavLink>
      <NavLink
        to="/sessions-overview"  // Navigate to Sessions Overview page
        className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
      >
        <FaChartLine className="icon" />
        <span>Session</span>
      </NavLink>
      <NavLink
        to="/goals"
        className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
      >
        <FaCog className="icon" />
        <span>Goals</span>
      </NavLink>
    </nav>
  );
}
