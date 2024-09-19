import React from "react";
import { NavLink } from "react-router-dom";
import "./Header.scss";

export default function Header() {
  return (
    <header className="top-nav">
      <NavLink to="/home" className="nav-item" activeClassName="active">
        <span className="nav-text">Home</span>
      </NavLink>
      <NavLink to="/session" className="nav-item" activeClassName="active">
        <span className="nav-text">Session</span>
      </NavLink>
      <NavLink to="/progress" className="nav-item" activeClassName="active">
        <span className="nav-text">Progress</span>
      </NavLink>
      <NavLink to="/settings" className="nav-item" activeClassName="active">
        <span className="nav-text">Settings</span>
      </NavLink>
    </header>
  );
}
