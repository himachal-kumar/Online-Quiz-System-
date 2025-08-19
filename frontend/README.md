# Online Quiz System – Frontend

React + TypeScript + Vite + Material UI. Includes quizzes, attempts, results, and a leaderboard using real profile data (name, email, avatar). Light/dark theme toggle in the navbar.


## Prerequisites

Before you begin, ensure that you have the following installed:

- **Node.js** (v18.x or higher)
  - Download and install Node.js from [here](https://nodejs.org/).

## Installation

```
cd frontend
npm install
```


## Usage

- Start Development Server

```
npm run dev
```
Access the app at `http://localhost:5173` (if busy, Vite will use the next port).


- Build for Production
```
npm run build
```

## Features

- Leaderboard
  - `/leaderboard`: list all quizzes
  - `/leaderboard/:id`: quiz leaderboard with name, email, avatar, score, percent, time, date
- Theme: light/dark toggle in the navbar, persisted in `localStorage`
- i18n ready (EN, ES, FR)
- Mock data service using `localStorage`

## Mock Data and Auto-Login

The app seeds mock users/quizzes/attempts in `localStorage` on first load and auto-logs in a default user. To reset:

1. Clear `localStorage` in the browser
2. Refresh the page

## Troubleshooting

- Vite port in use: the dev server will automatically try another port.
- If you see TS errors about `process` in i18n on build, install Node types:
  ```
  npm i -D @types/node
  ```
- Stale mock data: clear `localStorage` (see above).