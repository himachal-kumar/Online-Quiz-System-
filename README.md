# Online Quiz System

A modern quiz application built with React, TypeScript, Vite, and Material UI. It includes authentication (mocked), quiz management, attempts, results, and a rich Leaderboard with real user profile data (name, email, avatar). The UI supports light/dark themes with a one-click toggle in the navbar.


##video
<!-- Failed to upload "Screen Recording 2025-08-19 at 4.07.33 PM(1) (online-video-cutter.com).mp4" -->
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
