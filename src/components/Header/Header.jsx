import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import "./Header.scss";

export default function Header() {
  const [currentSession, setCurrentSession] = useState(null);

  useEffect(() => {
    const fetchCurrentSession = async () => {
      try {
        const response = await axios.get("http://localhost:5050/session/current");
        setCurrentSession(response.data); // Set the ongoing session if found
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // No ongoing session found, so set currentSession to null
          setCurrentSession(null);
        } else {
          console.error("Error fetching current session:", error);
        }
      }
    };

    fetchCurrentSession();

    // Polling every 3 seconds
    const intervalId = setInterval(fetchCurrentSession, 3000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className="header">
      <nav className="header__nav">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "header__nav-link header__nav-link--active"
              : "header__nav-link"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/advice"
          className={({ isActive }) =>
            isActive
              ? "header__nav-link header__nav-link--active"
              : "header__nav-link"
          }
        >
          Advice
        </NavLink>
        <NavLink
          to="/progress"
          className={({ isActive }) =>
            isActive
              ? "header__nav-link header__nav-link--active"
              : "header__nav-link"
          }
        >
          Progress
        </NavLink>
        <NavLink
          to="/goals"
          className={({ isActive }) =>
            isActive
              ? "header__nav-link header__nav-link--active"
              : "header__nav-link"
          }
        >
          Goals
        </NavLink>

        {/* Show 'Start Session' or 'Current Session' based on session availability */}
        <NavLink
          to={currentSession ? `/session/${currentSession.id}` : "/session/start"}
          className={({ isActive }) =>
            isActive
              ? "header__nav-link header__nav-link--active"
              : "header__nav-link"
          }
        >
          {currentSession ? "Current Session" : "Start Your Session Now"}
        </NavLink>
      </nav>
    </header>
  );
}
