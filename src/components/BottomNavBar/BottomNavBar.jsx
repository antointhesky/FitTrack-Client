import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaDumbbell, FaChartLine, FaCog } from "react-icons/fa";
import "./BottomNavBar.scss";

export default function BottomNavBar() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/home" className="nav-item" activeClassName="active">
        <FaHome className="icon" />
      </NavLink>
      <NavLink to="/session" className="nav-item" activeClassName="active">
        <FaDumbbell className="icon" />
      </NavLink>
      <NavLink to="/progress" className="nav-item" activeClassName="active">
        <FaChartLine className="icon" />
      </NavLink>
      <NavLink to="/goals" className="nav-item" activeClassName="active">
        <FaCog className="icon" />
      </NavLink>
    </nav>
  );
}

