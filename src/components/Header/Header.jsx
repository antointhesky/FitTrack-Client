import { NavLink } from "react-router-dom";
import "./Header.scss";

export default function Header() {
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
