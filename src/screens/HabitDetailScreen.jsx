import React, { useState, useEffect, useMemo } from "react";
import { Flame } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../styles/HabitDetailScreen.css";

export const HabitDetailScreen = ({
  habit = {},
  onBack = () => {},
  onToggle = () => {},
  onUpdate = () => {},
}) => {
  const [notes, setNotes] = useState(habit.notes || "");
  const [tags, setTags] = useState(habit.tags || []);

  useEffect(() => {
    setNotes(habit.notes || "");
    setTags(habit.tags || []);
  }, [habit]);

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

  const last7Days = useMemo(() => {
    const days = getLastNDates(7);
    const hist = habit.history || [];
    return days.map((d, idx) => {
      const offsetFromToday = days.length - 1 - idx; 
      const pos = hist.length - 1 - offsetFromToday;
      const completed = pos >= 0 && hist[pos] === 1 ? 1 : 0;
      return {
        day: d.toLocaleDateString(undefined, { weekday: "short" }),
        completed,
      };
    });
  }, [habit]);

  const completionRate30 = useMemo(() => {
    const hist = habit.history || [];
    if (hist.length === 0) return 0;
    const done = hist.filter((v) => v === 1).length;
    return Math.round((done / Math.max(1, hist.length)) * 100);
  }, [habit]);

  const handleAddTag = (value, clearInput) => {
    const v = (value || "").trim();
    if (!v) return;
    if (!tags.includes(v)) setTags((t) => [...t, v]);
    if (typeof clearInput === "function") clearInput();
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags((t) => t.filter((x) => x !== tagToRemove));
  };

  return (
    <div className="habit-detail-screen" role="region" aria-labelledby="habit-detail-title">
      <div className="habit-detail-header">
        <button type="button" onClick={onBack} className="back-button" aria-label="Back to dashboard">
          ← Back to Dashboard
        </button>

        <div className="habit-detail-hero">
          <span className="habit-detail-icon" aria-hidden>
            {habit.icon}
          </span>

          <div>
            <h1 id="habit-detail-title" className="habit-detail-title">
              {habit.name || "Untitled Habit"}
            </h1>
            <p className="habit-detail-category">{habit.category || "General"}</p>
          </div>
        </div>

        <div className="habit-detail-stats">
          <div className="habit-stat">
            <p className="habit-stat-label">Current Streak</p>
            <p className="habit-stat-value">{`${habit.streak || 0} days`}</p>
          </div>

          <div className="habit-stat">
            <p className="habit-stat-label">30-Day Rate</p>
            <p className="habit-stat-value">{`${completionRate30}%`}</p>
          </div>

          <div className="habit-stat">
            <p className="habit-stat-label">Status</p>
            <p className="habit-stat-value">{habit.completed ? "✓" : "○"}</p>
          </div>
        </div>
      </div>

      <div className="habit-detail-section">
        <h2 className="habit-detail-section-title">Quick Action</h2>
        <button
          type="button"
          onClick={() => onToggle(habit.id)}
          className={`habit-toggle-button ${habit.completed ? "incomplete" : "complete"}`}
          aria-pressed={!!habit.completed}
        >
          {habit.completed ? "Mark as Incomplete" : "Mark as Complete"}
        </button>
      </div>

      <div className="habit-detail-section">
        <h2 className="habit-detail-section-title">7-Day Trend</h2>
        <p className="section-description">Your completion pattern for the last 7 days</p>

        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={last7Days} margin={{ top: 5, right: 15, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" domain={[0, 1]} ticks={[0, 1]} width={25} />
            <Tooltip />
            <Line type="monotone" dataKey="completed" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: "#8b5cf6", r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="habit-detail-section">
        <h2 className="habit-detail-section-title">30-Day History</h2>
        <p className="section-description">Green = Completed, White = Not completed</p>

        <div className="habit-history-legend">
          <div className="legend-item">
            <div className="history-cell completed mini" />
            <span>Completed</span>
          </div>
          <div className="legend-item">
            <div className="history-cell incomplete mini" />
            <span>Skipped</span>
          </div>
        </div>

        <div className="habit-history-grid">
          {(habit.history || []).map((completed, idx) => (
            <div
              key={idx}
              className={`history-cell ${completed ? "completed" : "incomplete"}`}
              title={`Day ${idx + 1}: ${completed ? "Completed" : "Skipped"}`}
            />
          ))}
        </div>

        <div className="history-days-info">
          <span>{`Days completed: ${(habit.history || []).filter((v) => v === 1).length}/30`}</span>
        </div>
      </div>

      <div className="habit-detail-section">
        <h2 className="habit-detail-section-title">Notes & Tags</h2>

        <div className="habit-tags">
          {tags.map((tag) => (
            <div key={tag} className="habit-tag-wrapper">
              <span className="habit-tag">{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="remove-tag-button"
                aria-label={`Remove tag ${tag}`}
              >
                ×
              </button>
            </div>
          ))}

          <input
            type="text"
            placeholder="Add tag (press Enter)"
            className="add-tag-input"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddTag(e.target.value, () => (e.target.value = ""));
              }
            }}
            aria-label="Add tag"
          />
        </div>

        <textarea
          className="habit-notes"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes about this habit..."
          aria-label="Habit notes"
        />

        <div className="save-notes-row">
          <button
            type="button"
            className="save-notes-button"
            onClick={() => onUpdate({ ...habit, notes, tags })}
          >
            Save Notes & Tags
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitDetailScreen;
