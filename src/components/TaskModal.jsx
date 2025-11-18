import React, { useEffect } from "react";
import { CheckCircle, Circle, X, Trash2, CheckCheck, Clock } from "lucide-react";
import "../styles/TaskModal.css";

export const TaskModal = ({ task = {}, onClose = () => {}, onToggle, onDelete }) => {
  const isCompleted = !!task.completed;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(task.id);
    }
    onClose();
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    if (onToggle) onToggle(task.id);
  };

  return (
    <div
      className="task-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
      onClick={onClose}
    >
      <div className="task-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="task-modal-header">
          <div className="task-modal-header-main">
            {isCompleted ? (
              <CheckCircle className="icon-success" />
            ) : (
              <Clock className="icon-warning" />
            )}

            <div>
              <h3 id="task-modal-title" className="task-modal-title">
                Task Details
              </h3>
              <p className={`task-modal-status-text ${isCompleted ? "completed" : "pending"}`}>
                {isCompleted ? "✓ Completed" : "⏳ Pending"}
              </p>
            </div>
          </div>

          <div className="task-modal-header-actions">
            {onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="task-modal-delete-icon"
                title="Delete task"
                aria-label="Delete task"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}

            <button type="button" onClick={onClose} className="task-modal-close" aria-label="Close dialog">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="task-modal-body">
          <div>
            <label className="task-modal-label">Title</label>
            <p className={`task-modal-text ${isCompleted ? "completed-text" : ""}`}>{task.title || "Untitled"}</p>
          </div>

          <div className="task-modal-grid">
            <div>
              <label className="task-modal-label">Priority</label>
              <p className={`task-modal-priority priority-${task.priority || "medium"}`}>{(task.priority || "medium").toUpperCase()}</p>
            </div>

            <div>
              <label className="task-modal-label">Deadline</label>
              <p className="task-modal-text">{task.deadline || "No deadline"}</p>
            </div>
          </div>

          <div>
            <label className="task-modal-label">Tags</label>
            <div className="task-modal-tags">
              {task.tags && task.tags.length > 0 ? (
                task.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))
              ) : (
                <p className="no-tags-text">No tags added</p>
              )}
            </div>
          </div>

          <div className="task-status-section">
            <label className="task-modal-label">Status</label>

            <div className={`task-status-badge ${isCompleted ? "completed" : "pending"}`}>
              {isCompleted ? (
                <CheckCheck className="icon-success" />
              ) : (
                <Clock className="icon-warning" />
              )}

              <div>
                <p className={`task-status-title ${isCompleted ? "completed" : "pending"}`}>
                  {isCompleted ? "Task Completed!" : "Task Pending"}
                </p>
                <p className={`task-status-desc ${isCompleted ? "completed" : "pending"}`}>
                  {isCompleted ? "Great job! You finished this task." : "This task is waiting to be completed."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggle}
              className={`task-modal-button task-toggle-button ${isCompleted ? "mark-incomplete" : "mark-complete"}`}
              aria-pressed={isCompleted}
            >
              {isCompleted ? (
                <>
                  <Circle />
                  <span> Mark as Incomplete</span>
                </>
              ) : (
                <>
                  <CheckCircle />
                  <span> Mark as Complete</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
