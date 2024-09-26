import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Header.scss";

export default function Header() {
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
    <header className="top-nav">
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
      >
        <span className="nav-text">Home</span>
      </NavLink>

      <NavLink
        to="/workouts-overview"
        className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
      >
        <span className="nav-text">Workouts</span>
      </NavLink>

      {hasOngoingSession && (
        <NavLink
          to={`/session/${JSON.parse(localStorage.getItem("currentSession")).session_id}`}
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          <span className="nav-text">Ongoing Session</span>
        </NavLink>
      )}

      <NavLink
        to="/progress"
        className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
      >
        <span className="nav-text">Progress</span>
      </NavLink>

      <NavLink
        to="/goals"
        className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
      >
        <span className="nav-text">Goals</span>
      </NavLink>
    </header>
  );
}
