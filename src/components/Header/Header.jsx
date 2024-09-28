import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import "./Header.scss";

export default function Header() {
  const [currentSession, setCurrentSession] = useState(null);

  useEffect(() => {
    const fetchCurrentSession = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5050/session/current"
        );
        setCurrentSession(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setCurrentSession(null);
        } else {
          console.error("Error fetching current session:", error);
        }
      }
    };

    fetchCurrentSession();
  }, []);

  return (
    <header className="top-nav">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "nav-item active" : "nav-item"
        }
      >
        <span className="nav-text">Home</span>
      </NavLink>

      <NavLink
        to="/workouts-overview"
        className={({ isActive }) =>
          isActive ? "nav-item active" : "nav-item"
        }
      >
        <span className="nav-text">Workouts</span>
      </NavLink>

      <NavLink
        to="/progress"
        className={({ isActive }) =>
          isActive ? "nav-item active" : "nav-item"
        }
      >
        <span className="nav-text">Progress</span>
      </NavLink>

      <NavLink
        to="/goals"
        className={({ isActive }) =>
          isActive ? "nav-item active" : "nav-item"
        }
      >
        <span className="nav-text">Goals</span>
      </NavLink>

      <NavLink
        to={currentSession ? `/session/${currentSession.id}` : "/session"}
        className={({ isActive }) =>
          isActive ? "nav-item active" : "nav-item"
        }
      >
        <span className="nav-text">
          {currentSession ? "Current Session" : "Start Your Session Now"}
        </span>
      </NavLink>
    </header>
  );
}
