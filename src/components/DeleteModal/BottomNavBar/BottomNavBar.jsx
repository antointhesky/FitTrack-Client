import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaDumbbell, FaChartLine, FaCog } from "react-icons/fa"; // Importing icons
import "./BottomNavBar.scss"; // Importing the styles

export default function BottomNavBar() {
  return (
    <nav className="bottom-nav">
      <NavLink 
        to="/home" 
        className="nav-item" 
        activeClassName="active"
      >
        <FaHome className="icon" />
        <span className="nav-text">Home</span>
      </NavLink>
      <NavLink 
        to="/workouts" 
        className="nav-item" 
        activeClassName="active"
      >
        <FaDumbbell className="icon" />
        <span className="nav-text">Workouts</span>
      </NavLink>
      <NavLink 
        to="/progress" 
        className="nav-item" 
        activeClassName="active"
      >
        <FaChartLine className="icon" />
        <span className="nav-text">Progress</span>
      </NavLink>
      <NavLink 
        to="/settings" 
        className="nav-item" 
        activeClassName="active"
      >
        <FaCog className="icon" />
        <span className="nav-text">Settings</span>
      </NavLink>
    </nav>
  );
}
