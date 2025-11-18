import React, { useMemo, useState } from "react";
import {
  Target,
  Flame,
  Calendar,
  TrendingUp,
  Award,
  ChevronRight,
  Zap,
  CheckCircle,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import StatCard from "../components/StatCard";
import HabitItem from "../components/HabitItem";
import TaskItem from "../components/TaskItem";
import "../styles/DashboardScreen.css";

export const DashboardScreen = ({
  habits = [],
  tasks = [],
  onHabitClick = () => {},
  onHabitToggle = () => {},
  onTaskToggle = () => {},
  onTaskSelect = () => {},
  onViewAllTasks = () => {},
}) => {
  const completionRate = useMemo(() => {
    if (!habits || habits.length === 0) return 0;
    const completed = habits.filter((h) => h.completed).length;
    return Math.round((completed / habits.length) * 100);
  }, [habits]);

  const getLastNDates = (n) => {
    const days = [];
    const today = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      days.push(d);
    }
    return days;
  };

  const WEEKLY_DATA = useMemo(() => {
    const days = getLastNDates(7); 
    return days.map((d, idx) => {
      const offsetFromToday = days.length - 1 - idx; 
      const completed = habits.reduce((sum, h) => {
        const hist = h.history || [];
        const pos = hist.length - 1 - offsetFromToday; 
        return sum + (pos >= 0 && hist[pos] === 1 ? 1 : 0);
      }, 0);
      return {
        name: d.toLocaleDateString(undefined, { weekday: "short" }),
        completed,
        total: habits.length || 0,
      };
    });
  }, [habits]);

  const todayKey = new Date().toISOString().slice(0, 10);
  const todayTasks = tasks.filter((t) => t.deadline === todayKey);
  const pendingTodayTasks = todayTasks.filter((t) => !t.completed);
  const completedTodayTasks = todayTasks.filter((t) => t.completed);
  const [completing, setCompleting] = useState(false);

  const longestStreak = useMemo(() => {
    if (!habits || habits.length === 0) return 0;
    return Math.max(...habits.map((h) => h.streak || 0), 0);
  }, [habits]);

  const todayDisplay = new Date().toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="dashboard-screen">
      <div className="stats-grid">
        <StatCard
          title="Today's Progress"
          value={`${completionRate}%`}
          subtitle={`${habits.filter((h) => h.completed).length}/${habits.length} habits completed`}
          icon={<Target className="w-12 h-12 text-purple-200" />}
          gradient="gradient-purple"
        />

        <StatCard
          title="Longest Streak"
          value={longestStreak}
          subtitle="days in a row"
          icon={<Flame className="w-12 h-12 text-orange-200" />}
          gradient="gradient-orange"
        />

        <StatCard
          title="Tasks Pending"
          value={tasks.filter((t) => !t.completed).length}
          subtitle="items to complete"
          icon={<Calendar className="w-12 h-12 text-blue-200" />}
          gradient="gradient-blue"
        />
      </div>

      <div className="habits-section">
        <div className="section-header">
          <h2 className="section-title">Today's Habits</h2>
          <span className="section-date">{todayDisplay}</span>
        </div>

        <div className="habits-list">
          {habits.map((habit) => (
            <HabitItem key={habit.id} habit={habit} onToggle={onHabitToggle} onClick={onHabitClick} />
          ))}
        </div>
      </div>

      <div className="chart-section">
        <div className="chart-header">
          <TrendingUp className="w-6 h-6 text-purple-500" />
          <h2 className="section-title">Weekly Progress</h2>
        </div>

        <p className="chart-subtitle">How many habits you completed each day</p>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={WEEKLY_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" width={30} />
            <Tooltip formatter={(value) => `${value} habits`} />
            <Legend />
            <Bar dataKey="completed" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Completed" />
            <Bar dataKey="total" fill="#e5e7eb" radius={[6, 6, 0, 0]} name="Total" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="tasks-preview-section">
        <div className="tasks-preview-header">
          <h2 className="section-title">Today's Tasks</h2>
          <button onClick={onViewAllTasks} className="view-all-button">
            Manage All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="tasks-summary">
          <div className="summary-item pending">
            <Clock className="w-5 h-5" />
            <span>{`${pendingTodayTasks.length} Pending`}</span>
          </div>

          <div className="summary-item completed">
            <CheckCircle className="w-5 h-5" />
            <span>{`${completedTodayTasks.length} Done`}</span>
          </div>
        </div>

        {todayTasks.length > 0 ? (
          <div className="tasks-preview-list">
            {todayTasks.slice(0, 5).map((task) => (
              <TaskItem key={task.id} task={task} onToggle={onTaskToggle} onClick={onTaskSelect} />
            ))}
          </div>
        ) : (
          <div className="empty-tasks-state">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <p>No tasks for today!</p>
          </div>
        )}
      </div>

      <div className="quick-actions-section">
        <div className="quick-actions-header">
          <Zap className="w-6 h-6 text-amber-500" />
          <h2 className="section-title">Quick Actions</h2>
        </div>

        <p className="quick-actions-subtitle">Common things you can do right now</p>

        <div className="quick-actions-grid">
          <button className="quick-action-button" onClick={onViewAllTasks} title="View and manage all your tasks">
            <Calendar className="w-5 h-5" />
            <span>Manage Tasks</span>
          </button>

          <button
            className="quick-action-button"
            onClick={() => habits.length > 0 && onHabitClick(habits[0])}
            title="Check your first habit"
          >
            <Target className="w-5 h-5" />
            <span>Track Habit</span>
          </button>

          <button
            className="quick-action-button"
            onClick={() => {
              const pendingHabits = habits.filter((h) => !h.completed);
              if (pendingHabits.length === 0) return;
              setCompleting(true);
              onHabitToggle(pendingHabits[0].id);
              setTimeout(() => setCompleting(false), 500);
            }}
            title="Complete a habit"
            disabled={completing || habits.filter((h) => !h.completed).length === 0}
          >
            <Flame className="w-5 h-5" />
            <span>Complete Habit</span>
          </button>
        </div>
      </div>

      <div className="motivational-section">
        <div className="motivational-content">
          <Award className="w-8 h-8" />
          <div>
            <h3 className="motivational-title">Amazing Work!</h3>
            <p className="motivational-text">{`You've completed ${habits.filter((h) => h.completed).length} habits today. Keep it up!`}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
