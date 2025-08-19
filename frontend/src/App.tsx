import { Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect } from 'react';
import AuthanticatedLayout from "./layouts/Authanticated";
import BasicLayout from "./layouts/Basic";
import ForgotPassword from "./pages/forgot-password";
import Home from "./pages/homepage";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Register from "./pages/register";
import ResetPassword from "./pages/reset-password";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import { UserRole } from "./types/user";
import { Box, CircularProgress } from "@mui/material";
import { initializeMockData } from "./services/mockData";


// Lazy loaded components
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const QuizList = lazy(() => import('./pages/quizzes/QuizList'));
const QuizDetail = lazy(() => import('./pages/quizzes/QuizDetail'));
const QuizAttempt = lazy(() => import('./pages/quizzes/QuizAttempt'));
const QuizResults = lazy(() => import('./pages/quizzes/QuizResults'));
const Leaderboard = lazy(() => import('./pages/quizzes/Leaderboard.tsx'));
const LeaderboardIndex = lazy(() => import('./pages/quizzes/LeaderboardIndex'));

// Loading component for suspense fallback
const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

function App() {
  // Initialize mock data when the app starts
  useEffect(() => {
    initializeMockData();
  }, []);

  return (
    <ErrorBoundary>
      <Routes>
        {/* Public routes */}
        <Route element={<BasicLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>

        {/* Protected routes for all authenticated users */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AuthanticatedLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            
            <Route path="/quizzes" element={
              <Suspense fallback={<LoadingFallback />}>
                <QuizList />
              </Suspense>
            } />
            
            <Route path="/quiz/:id" element={
              <Suspense fallback={<LoadingFallback />}>
                <QuizDetail />
              </Suspense>
            } />
            
            <Route path="/quiz/:id/attempt" element={
              <Suspense fallback={<LoadingFallback />}>
                <QuizAttempt />
              </Suspense>
            } />
            
            <Route path="/results/:id" element={
              <Suspense fallback={<LoadingFallback />}>
                <QuizResults />
              </Suspense>
            } />
            
            <Route path="/leaderboard" element={
              <Suspense fallback={<LoadingFallback />}>
                <LeaderboardIndex />
              </Suspense>
            } />

            <Route path="/leaderboard/:id" element={
              <Suspense fallback={<LoadingFallback />}>
                <Leaderboard />
              </Suspense>
            } />
          </Route>
        </Route>

        {/* Admin-only routes */}
        <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
          <Route element={<AuthanticatedLayout />}>
            <Route path="/admin" element={
              <Suspense fallback={<LoadingFallback />}>
                <AdminDashboard />
              </Suspense>
            } />
          </Route>
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
