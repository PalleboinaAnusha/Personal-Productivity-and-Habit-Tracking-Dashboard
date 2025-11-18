import React from "react";
import "../styles/StatCard.css";

export const StatCard = ({ title, value, subtitle, icon, gradient }) => {
  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    if (typeof icon === "string")
      return <img src={icon} alt="" className="stat-card-icon-img" />;
    return null;
  };

  return (
    <div className={`stat-card ${gradient || ""}`} role="group" aria-label={title}>
      <div className="stat-card-content">
        <div>
          <p className="stat-card-title">{title}</p>
          <h3 className="stat-card-value">{value}</h3>
          {subtitle && <p className="stat-card-subtitle">{subtitle}</p>}
        </div>

        <div className="stat-card-icon" aria-hidden="true">
          {renderIcon()}
        </div>
      </div>
    </div>
  );
};

export default StatCard;