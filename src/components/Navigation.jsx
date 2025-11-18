import React from "react";
import { LayoutDashboard, ListTodo, Rocket } from "lucide-react";
import "../styles/Navigation.css";

export const Navigation = ({ currentScreen, onNavigate }) => {
  return (
    <nav className="navigation" role="navigation" aria-label="Main Navigation">
      <div className="nav-container">
        <h1 className="nav-logo">
          <Rocket size={24} />
          ProductivityHub
        </h1>

        <div className="nav-buttons">
          <button
            onClick={() => onNavigate("dashboard")}
            className={`nav-button ${currentScreen === "dashboard" ? "active" : ""}`}
            aria-current={currentScreen === "dashboard" ? "page" : undefined}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>

          <button
            onClick={() => onNavigate("tasks")}
            className={`nav-button ${currentScreen === "tasks" ? "active" : ""}`}
            aria-current={currentScreen === "tasks" ? "page" : undefined}
          >
            <ListTodo size={20} />
            Tasks
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
