import React, { useState, useMemo } from "react";
import { Filter, Plus, AlertCircle, CheckCircle, Clock, Search, X } from "lucide-react";
import {
  Bar as RechartsBar,
} from "recharts";
import AddTaskModal from "../components/AddTaskModal";
import TaskItem from "../components/TaskItem";
import TaskModal from "../components/TaskModal";
import "../styles/TasksScreen.css";

export const TasksScreen = ({
  tasks = [],
  taskFilter = "all",
  selectedTask = null,
  onBack = () => {},
  onFilterChange = () => {},
  onTaskToggle = () => {},
  onTaskSelect = () => {},
  onTaskSelectClose = () => {},
  onAddTask = () => {},
  onDeleteTask = () => {},
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toasts, setToasts] = useState([]);

  const todayKey = new Date().toISOString().slice(0, 10);

  const filteredTasks = useMemo(() => {
    let result = (tasks || []).filter((task) => {
      if (taskFilter === "today") return task.deadline === todayKey;
      if (taskFilter === "pending") return !task.completed;
      if (taskFilter === "upcoming")
        return task.deadline > todayKey && !task.completed;
      if (taskFilter === "completed") return task.completed;
      return true;
    });

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((t) => {
        const titleMatch = (t.title || "").toLowerCase().includes(query);
        const tagsMatch = (t.tags || []).some((tag) => tag.toLowerCase().includes(query));
        const priorityMatch = (t.priority || "").toLowerCase().includes(query);
        return titleMatch || tagsMatch || priorityMatch;
      });
    }

    return result;
  }, [tasks, taskFilter, searchQuery, todayKey]);

  const priorityData = useMemo(() => {
    const safeTasks = tasks || [];
    const high = safeTasks.filter((t) => t.priority === "high" && !t.completed).length;
    const medium = safeTasks.filter((t) => t.priority === "medium" && !t.completed).length;
    const low = safeTasks.filter((t) => t.priority === "low" && !t.completed).length;
    const maxVal = Math.max(high, medium, low, 1);
    return [
      { name: "High", value: high, fill: "#ef4444", percent: Math.round((high / maxVal) * 100) },
      { name: "Medium", value: medium, fill: "#f59e0b", percent: Math.round((medium / maxVal) * 100) },
      { name: "Low", value: low, fill: "#22c55e", percent: Math.round((low / maxVal) * 100) },
    ];
  }, [tasks]);

  const headerLabel = useMemo(() => {
    if (!taskFilter) return "All Tasks";
    const map = {
      today: "Today's Tasks",
      pending: "Pending Tasks",
      upcoming: "Upcoming Tasks",
      completed: "Completed Tasks",
      all: "All Tasks",
    };
    return map[taskFilter] || `${taskFilter.charAt(0).toUpperCase() + taskFilter.slice(1)} Tasks`;
  }, [taskFilter]);

  const pushToast = (message, kind = "info", ttl = 6000) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), ttl);
  };

  const handleAddSave = (task) => {
    try {
      onAddTask && onAddTask(task);
      const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      pushToast("Task added successfully", "success");
    } catch (e) {
      console.error("Error adding task:", e);
      pushToast("Failed to add task", "error");
    } finally {
      setShowAdd(false);
    }
  };

  const handleDelete = (id) => {
    try {
      const t = (tasks || []).find((x) => x.id === id);
      const title = t ? t.title : "Task";
      onDeleteTask && onDeleteTask(id);
      const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      // show a concise, user-facing message
      pushToast("Task deleted", "danger");
    } catch (e) {
      console.error("Error deleting task:", e);
      pushToast("Failed to delete task", "error");
    }
  };

  return (
    <div className="tasks-screen">
      <div className="tasks-screen-header">
        <button type="button" onClick={onBack} className="back-button" aria-label="Back to dashboard">
          ← Back to Dashboard
        </button>
        <h1 className="tasks-screen-title">Tasks & To-Do List</h1>
        <p className="tasks-screen-subtitle">Manage your daily tasks and priorities</p>
      </div>

      <div className="search-section">
        <div className="search-container">
          <Search className="w-5 h-5 search-icon" />
          <input
            type="text"
            placeholder="Search tasks by title, tags, or priority..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            aria-label="Search tasks"
          />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery("")} className="search-clear" title="Clear search" aria-label="Clear search">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="tasks-filters" role="toolbar" aria-label="Task filters">
        <Filter className="w-5 h-5 text-gray-500" />
        {["today", "pending", "upcoming", "completed", "all"].map((filter) => {
          const filterLabels = {
            today: "Today's Tasks",
            pending: "Pending",
            upcoming: "Upcoming",
            completed: "Completed",
            all: "All Tasks",
          };
          return (
            <button
              key={filter}
              type="button"
              onClick={() => onFilterChange(filter)}
              className={`filter-button ${taskFilter === filter ? "active" : ""}`}
              aria-pressed={taskFilter === filter}
            >
              {filterLabels[filter]}
            </button>
          );
        })}
      </div>

      <div className="tasks-stats">
        <div className="task-stat-card">
          <div className="stat-icon-wrapper">
            <span className="stat-icon" aria-hidden>
              📋
            </span>
          </div>
          <p className="task-stat-label">Total Tasks</p>
          <p className="task-stat-value">{(tasks || []).length}</p>
        </div>

        <div className="task-stat-card">
          <div className="stat-icon-wrapper pending">
            <Clock className="w-5 h-5" />
          </div>
          <p className="task-stat-label">Pending</p>
          <p className="task-stat-value pending">{(tasks || []).filter((t) => !t.completed).length}</p>
        </div>

        <div className="task-stat-card">
          <div className="stat-icon-wrapper completed">
            <CheckCircle className="w-5 h-5" />
          </div>
          <p className="task-stat-label">Completed</p>
          <p className="task-stat-value completed">{(tasks || []).filter((t) => t.completed).length}</p>
        </div>
      </div>

      <div className="priority-chart-section">
        <h3 className="chart-title">Priority Distribution</h3>
        <p className="chart-subtitle">How many pending tasks in each priority level</p>

        <div className="priority-chart-wrapper" aria-hidden>
          <div className="priority-bars">
            {priorityData.map((item) => (
              <div key={item.name} className="priority-bar-item">
                <div className="priority-bar-label">{item.name}</div>
                <div className="priority-bar-container">
                  <div
                    className={`priority-bar priority-bar--${item.name.toLowerCase()}`}
                    style={{
                      width: item.value > 0 ? `${Math.max(20, (item.value / Math.max(...priorityData.map((d) => d.value, 1))) * 100)}%` : "0%",
                    }}
                    title={`${item.name}: ${item.value} tasks`}
                  >
                    <span className="priority-bar-value">{item.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="tasks-list-section">
        <div className="tasks-list-header">
          <h2 className="tasks-list-title">{`${headerLabel} (${filteredTasks.length})`}</h2>
          <div className="add-area">
            <button type="button" className="add-task-button" onClick={() => setShowAdd(true)} aria-label="Add task">
              <Plus className="w-5 h-5" /> Add Task
            </button>
          </div>
        </div>

        {filteredTasks.length > 0 ? (
          <div className="tasks-list">
            {filteredTasks.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={onTaskToggle} onClick={onTaskSelect} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <AlertCircle className="w-12 h-12 text-gray-300" />
            <p className="empty-state-text">No tasks found. Great job!</p>
          </div>
        )}
      </div>

      {selectedTask && (
        <TaskModal task={selectedTask} onClose={onTaskSelectClose} onToggle={onTaskToggle} onDelete={(id) => handleDelete(id)} />
      )}

      {showAdd && (
        <AddTaskModal
          defaultDeadline={new Date().toISOString().slice(0, 10)}
          onClose={() => setShowAdd(false)}
          onSave={(task) => handleAddSave(task)}
        />
      )}

      <div className="toast-container" aria-live="polite" aria-atomic="true">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.kind}`}>
            <div className="toast-message">{t.message}</div>
            <button className="toast-close" onClick={() => setToasts((arr) => arr.filter((x) => x.id !== t.id))} aria-label="Dismiss">×</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksScreen;
