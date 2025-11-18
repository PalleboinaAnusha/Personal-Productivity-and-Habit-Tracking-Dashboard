import React from "react";
import { CheckCircle, Circle, Clock, AlertCircle } from "lucide-react";
import "../styles/TaskItem.css";

export const TaskItem = ({ task, onToggle, onClick }) => {
  const isCompleted = !!task?.completed;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (onClick) onClick(task);
    }
  };

  return (
    <div
      className={`task-item ${isCompleted ? "completed" : "pending"}`}
      role="button"
      tabIndex={0}
      onClick={() => onClick && onClick(task)}
      onKeyDown={handleKeyDown}
      aria-label={`${task.title}. ${isCompleted ? "Completed" : "Pending"}. Priority ${task.priority}. Deadline ${task.deadline || "no deadline"}`}
    >
      <div className="task-item-header">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle && onToggle(task.id);
          }}
          className="task-item-checkbox"
          aria-pressed={isCompleted}
          aria-label={isCompleted ? "Mark task as incomplete" : "Mark task as complete"}
        >
          {isCompleted ? (
            <CheckCircle className="w-6 h-6 icon-success" />
          ) : (
            <Circle className="w-6 h-6 icon-muted" />
          )}
        </button>

        <div className="task-item-body">
          <h3 className={`task-item-title ${isCompleted ? "completed" : ""}`}>{task.title}</h3>
          <p className="task-item-subtitle">{isCompleted ? "✓ Completed" : "⏳ Pending"}</p>
        </div>
      </div>

      <div className="task-item-meta" aria-hidden={false}>
        <span
          className={`priority-badge priority-${task.priority || "medium"}`}
          title={`Priority: ${task.priority || "medium"}`}
        >
          {task.priority}
        </span>

        <span className="deadline" title={`Deadline: ${task.deadline || "none"}`}>
          <Clock className="w-4 h-4" />
          {task.deadline || "No deadline"}
        </span>

        {(task.tags || []).map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}

        {task.isOverdue && (
          <span className="task-alert" title="Task overdue">
            <AlertCircle className="w-4 h-4" />
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
