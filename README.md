# Online Quiz System

A modern quiz application built with React, TypeScript, Vite, and Material UI. It includes authentication (mocked), quiz management, attempts, results, and a rich Leaderboard with real user profile data (name, email, avatar). The UI supports light/dark themes with a one-click toggle in the navbar.

## Project Layout

```
Online Quiz System/
  └─ frontend/        # React app (Vite + TS + MUI)
```

## Quick Start (Frontend)

```
cd frontend
npm install
npm run dev
```

Open the app at `http://localhost:5173` (if busy, Vite will auto-increment the port).

## Features

- Leaderboard per quiz showing user name, email, avatar, score, percentage, time spent, and date
- Leaderboard index at `/leaderboard` to browse all quizzes
- Dark/Light theme with persistent toggle in navbar
- Mocked auth/data via `localStorage` for easy evaluation (auto-login a default user)
- i18n setup (EN, ES, FR)

## More

- Detailed usage, scripts, troubleshooting: see `frontend/README.md`