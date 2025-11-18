# Personal Productivity and Habit Tracking Dashboard

A small React single-page app for tracking habits and tasks with a clean dashboard UI.

## Features

- Habit list with streaks and toggles
- Tasks / To-Do list with add, delete, complete/incomplete
- In-app toasts for feedback (add/delete/success/error)
- Compact task details modal

## Quick start (Windows PowerShell)

1. Install dependencies

```powershell
npm install
```

2. Run dev server

```powershell
npm run dev
```

3. Open the app in your browser at the URL shown by Vite (usually `http://localhost:3000`).

## Important file locations

- `src/App.jsx` — top-level state and handlers. Note: `toggleTask` now syncs `selectedTask` so the `TaskModal` shows current completion state.
- `src/screens/TasksScreen.jsx` — toast logic and rendering (default TTL now 6000ms and messages updated to friendly text).
- `src/styles/TasksScreen.css` — toast styles (increased size/visibility).
- `src/components/TaskModal.jsx` — task details modal markup and toggle/delete handlers.
- `src/styles/TaskModal.css` — modal sizing and spacing (made more compact).

## Notes about recent changes

- Toasts: default display time increased to 6s and messages updated to concise messages like "Task added successfully" and "Task deleted". You can adjust the TTL or wording in `pushToast` inside `src/screens/TasksScreen.jsx`.
- Task modal: made the details dialog smaller and tightened spacing in `src/styles/TaskModal.css`.
- State sync: when toggling a task (`toggleTask` in `src/App.jsx`), the `selectedTask` is also updated so that the open Task Details modal reflects the new state immediately.

## How to test

- Add a task via the Tasks screen — verify a top-right toast appears with `Task added successfully` and the toast styling looks larger and clearer.
- Open a task modal and click "Mark as Complete" — verify the status text updates to "Task Completed!" and the description changes.
- Delete a task and confirm a `Task deleted` toast appears.

## Contributing

Small, focused PRs are welcome. Please run the dev server locally and verify UI changes before submitting.

---

If you want, I can expand this README to include screenshots, a project license, or a development checklist (lint, test commands).