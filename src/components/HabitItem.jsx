import React from "react";
import { CheckCircle, Circle, Flame, ChevronRight } from "lucide-react";
import "../styles/HabitItem.css";

export const HabitItem = ({ habit, onToggle, onClick }) => {
  const handleContainerKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (onClick) onClick(habit);
    }
  };

  const renderIcon = () => {
    if (!habit?.icon) return null;
    if (React.isValidElement(habit.icon)) return habit.icon;
    if (typeof habit.icon === "string")
      return <img src={habit.icon} alt="" className="habit-custom-icon" />;
    return null;
  };

  return (
    <div
      className="habit-item"
      role="button"
      tabIndex={0}
      onClick={() => onClick && onClick(habit)}
      onKeyDown={handleContainerKeyDown}
      aria-label={`Open habit ${habit.name}`}
    >
      <div className="habit-item-content">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle && onToggle(habit.id);
          }}
          className="habit-item-checkbox"
          aria-pressed={!!habit.completed}
          aria-label={habit.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {habit.completed ? (
            <CheckCircle className="w-8 h-8 text-green-500" />
          ) : (
            <Circle className="w-8 h-8 text-gray-300" />
          )}
        </button>

        <span className="habit-item-icon">{renderIcon()}</span>

        <div className="habit-item-info">
          <h3 className={`habit-item-name ${habit.completed ? "completed" : ""}`}>
            {habit.name}
          </h3>
          <p className="habit-item-category">{habit.category}</p>
        </div>
      </div>

      <div className="habit-item-actions" aria-hidden>
        <div className="habit-streak" aria-label={`${habit.streak} day streak`}>
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="streak-number">{habit.streak}</span>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
};

export default HabitItem;
