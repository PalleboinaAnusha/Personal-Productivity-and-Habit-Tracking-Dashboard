import React, { useState, useEffect, useRef } from "react";

export const AddTaskModal = ({ onClose, onSave, defaultDeadline }) => {
  const today = new Date().toISOString().slice(0, 10);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [deadline, setDeadline] = useState(defaultDeadline ?? today);
  const [error, setError] = useState("");
  const titleRef = useRef(null);

  useEffect(() => {
    if (titleRef.current) titleRef.current.focus();
  }, []);

  useEffect(() => {
    if (defaultDeadline) setDeadline(defaultDeadline);
  }, [defaultDeadline]);

  const handleSave = () => {
    if (!title.trim()) {
      setError("Please enter a title for the task");
      if (titleRef.current) titleRef.current.focus();
      return;
    }
    setError("");
    onSave({ title: title.trim(), priority, deadline });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-task-title"
      onKeyDown={handleKeyDown}
    >
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 id="add-task-title" className="modal-title">
          Add New Task
        </h3>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="modal-row">
            <label className="modal-label" htmlFor="add-task-title-input">
              Title
            </label>
            <input
              ref={titleRef}
              id="add-task-title-input"
              className="modal-input modal-input-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
              aria-invalid={!!error}
              aria-describedby={error ? "add-task-error" : undefined}
            />
          </div>

          {error && (
            <p
              id="add-task-error"
              className="modal-error"
              role="alert"
            >
              {error}
            </p>
          )}

          <div className="modal-row">
            <label className="modal-label" htmlFor="add-task-priority">
              Priority
            </label>
            <select
              id="add-task-priority"
              className="modal-input modal-input-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="modal-row">
            <label className="modal-label" htmlFor="add-task-deadline">
              Deadline
            </label>
            <input
              id="add-task-deadline"
              className="modal-input modal-input-deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button type="submit" className="modal-save">
              Save
            </button>
            <button type="button" className="modal-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
