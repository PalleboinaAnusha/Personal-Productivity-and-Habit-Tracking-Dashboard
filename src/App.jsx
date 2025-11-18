import React, { useState, useEffect } from "react";
import Navigation from "./components/Navigation.jsx";
import DashboardScreen from "./screens/DashboardScreen.jsx";
import HabitDetailScreen from "./screens/HabitDetailScreen.jsx";
import TasksScreen from "./screens/TasksScreen.jsx";
import { MOCK_HABITS, MOCK_TASKS } from "./data/mockData.js";
import "./App.css";

const getRouteFromPath = () => {
  try {
    const p = window.location.pathname;
    if (p === "/" || p === "/dashboard") return { screen: "dashboard" };
    if (p.startsWith("/habit/")) return { screen: "habit", id: Number(p.split("/")[2]) };
    if (p.startsWith("/tasks")) return { screen: "tasks" };
    return { screen: "dashboard" };
  } catch (e) {
    return { screen: "dashboard" };
  }
};

const getInitialHabits = () => {
  try {
    const stored = localStorage.getItem("habit_habits");
    if (!stored) return MOCK_HABITS;
    const parsed = JSON.parse(stored);
    const map = new Map();
    parsed.forEach((h) => {
      if (!map.has(h.id)) map.set(h.id, h);
    });
    const deduped = Array.from(map.values());
    return deduped.length ? deduped : MOCK_HABITS;
  } catch (e) {
    console.error("Error loading habits from localStorage:", e);
    return MOCK_HABITS;
  }
};

const getInitialTasks = () => {
  try {
    const stored = localStorage.getItem("habit_tasks");
    if (!stored) return MOCK_TASKS;
    const parsed = JSON.parse(stored);
    const map = new Map();
    parsed.forEach((t) => {
      if (!map.has(t.id)) map.set(t.id, t);
    });
    const deduped = Array.from(map.values());
    return deduped.length ? deduped : MOCK_TASKS;
  } catch (e) {
    console.error("Error loading tasks from localStorage:", e);
    return MOCK_TASKS;
  }
};

const App = () => {
  const [route, setRoute] = useState(getRouteFromPath());
  const [habits, setHabits] = useState(getInitialHabits());
  const [tasks, setTasks] = useState(getInitialTasks());
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskFilter, setTaskFilter] = useState("today");

  useEffect(() => {
    const onPopState = () => setRoute(getRouteFromPath());
    window.addEventListener("popstate", onPopState);
    if (window.location.pathname === "/") {
      window.history.replaceState(null, "", "/dashboard");
    }
    onPopState();
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("habit_habits", JSON.stringify(habits));
    } catch (e) {
      console.error("Error saving habits to localStorage:", e);
    }
  }, [habits]);

  useEffect(() => {
    try {
      localStorage.setItem("habit_tasks", JSON.stringify(tasks));
    } catch (e) {
      console.error("Error saving tasks to localStorage:", e);
    }
  }, [tasks]);

  const navigate = (screen, params) => {
    let path = "/dashboard";
    if (screen === "tasks") path = "/tasks";
    else if (screen === "habit" && params && params.id) path = `/habit/${params.id}`;
    window.history.pushState(null, "", path);
    setRoute(getRouteFromPath());
  };

  const toggleHabit = (id) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const newCompleted = !h.completed;
          const newStreak = newCompleted ? h.streak + 1 : Math.max(0, h.streak - 1);
          const updatedHistory = [...h.history];
          if (updatedHistory.length > 0) {
            updatedHistory[updatedHistory.length - 1] = newCompleted ? 1 : 0;
          }
          return { ...h, completed: newCompleted, streak: newStreak, history: updatedHistory };
        }
        return h;
      })
    );
  };

  const updateHabit = (updated) => {
    setHabits((prev) => prev.map((h) => (h.id === updated.id ? { ...h, ...updated } : h)));
  };

  const toggleTask = (id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    setSelectedTask((prev) => (prev && prev.id === id ? { ...prev, completed: !prev.completed } : prev));
  };

  const addTask = (task) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title: task.title || "New Task",
      description: task.description || "",
      priority: task.priority || "medium",
      deadline: task.deadline || new Date().toISOString().slice(0, 10),
      completed: false,
      tags: task.tags || [],
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const deleteTask = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const handleHabitClick = (habit) => {
    setSelectedHabit(habit);
    navigate("habit", { id: habit.id });
  };

  const handleTaskClick = (task) => setSelectedTask(task);

  return (
    <div className="app">
      <Navigation currentScreen={route.screen} onNavigate={(s) => navigate(s)} />
      <main className="main-content">
        {route.screen === "dashboard" && (
          <DashboardScreen
            habits={habits}
            tasks={tasks}
            onHabitClick={handleHabitClick}
            onHabitToggle={toggleHabit}
            onTaskToggle={toggleTask}
            onTaskSelect={handleTaskClick}
            onViewAllTasks={() => navigate("tasks")}
          />
        )}

        {route.screen === "habit" && route.id && (
          <>
            {habits.find((h) => h.id === route.id) ? (
              <HabitDetailScreen
                habit={habits.find((h) => h.id === route.id)}
                onBack={() => navigate("dashboard")}
                onToggle={toggleHabit}
                onUpdate={updateHabit}
              />
            ) : (
              <div className="not-found-wrap">
                <button onClick={() => navigate("dashboard")} className="back-button">
                  ← Back to Dashboard
                </button>
                <p className="not-found-text">Habit not found</p>
              </div>
            )}
          </>
        )}

        {route.screen === "tasks" && (
          <TasksScreen
            tasks={tasks}
            taskFilter={taskFilter}
            selectedTask={selectedTask}
            onBack={() => navigate("dashboard")}
            onFilterChange={setTaskFilter}
            onTaskToggle={toggleTask}
            onTaskSelect={handleTaskClick}
            onTaskSelectClose={() => setSelectedTask(null)}
            onAddTask={addTask}
            onDeleteTask={deleteTask}
          />
        )}
      </main>
    </div>
  );
};

export default App;
