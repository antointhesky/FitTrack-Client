import { NavLink } from "react-router-dom";
import { FaHome, FaDumbbell, FaChartLine, FaCog } from "react-icons/fa";
import { useState, useEffect } from "react";
import "./BottomNavBar.scss";

export default function BottomNavBar() {
  const [hasOngoingSession, setHasOngoingSession] = useState(false);

  useEffect(() => {
    const currentSession = localStorage.getItem("currentSession");
    if (currentSession) {
      setHasOngoingSession(true);
    } else {
      setHasOngoingSession(false);
    }
  }, []);

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
        to="/workouts-overview"
        className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
      >
        <FaDumbbell className="icon" />
        <span>Workouts</span>
      </NavLink>

      {hasOngoingSession && (
        <NavLink
          to={`/session/${JSON.parse(localStorage.getItem("currentSession")).session_id}`}
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          <FaChartLine className="icon" />
          <span>Ongoing Session</span>
        </NavLink>
      )}

      <NavLink
        to="/progress"
        className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
      >
        <FaChartLine className="icon" />
        <span>Progress</span>
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
