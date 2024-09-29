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

    // Listen to session creation or deletion events and refetch session
    const intervalId = setInterval(fetchCurrentSession, 3000); // Poll every 3 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <header className="top-nav">
      <NavLink to="/" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
        <span className="nav-text">Home</span>
      </NavLink>

      <NavLink to="/advice" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
        <span className="nav-text">Advice</span>
      </NavLink>

      <NavLink to="/progress" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
        <span className="nav-text">Progress</span>
      </NavLink>

      <NavLink to="/goals" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
        <span className="nav-text">Goals</span>
      </NavLink>

      {/* Show 'Start Session' or 'Current Session' based on session availability */}
      <NavLink to={currentSession ? `/session/${currentSession.id}` : "/session/start"} className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
        <span className="nav-text">
          {currentSession ? "Current Session" : "Start Your Session Now"}
        </span>
      </NavLink>
    </header>
  );
}
