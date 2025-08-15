
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BotEditorPage from './pages/BotEditorPage';
import Header from './components/Header';
import StatisticsPage from './pages/StatisticsPage';

// A component to handle protected routes
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, checkAuth } = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Use a different layout for the landing page
  if (location.pathname === '/') {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Header />
      <main className="pt-20">
        <div className={`${!location.pathname.includes('/editor') ? 'p-4 sm:p-6 lg:p-8' : ''} animate-fadeIn`} key={location.pathname}>
            <Routes>
              {/* Public routes that redirect if logged in */}
              <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
              <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
              
              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/statistics"
                element={
                  <ProtectedRoute>
                    <StatisticsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bot/:botId/editor"
                element={
                  <ProtectedRoute>
                    <BotEditorPage />
                  </ProtectedRoute>
                }
              />

              {/* Redirect any other path to dashboard if logged in, otherwise to landing */}
              <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} />
            </Routes>
        </div>
      </main>
    </div>
  );
};

const AppWrapper: React.FC = () => (
    <HashRouter>
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="*" element={<App />} />
        </Routes>
    </HashRouter>
);

// Header is now shown on all pages except landing
const ConditionalHeader: React.FC = () => {
  const location = useLocation();
  if (location.pathname === '/') {
    return null;
  }
  return <Header />;
};


export default AppWrapper;