
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BotEditorPage from './pages/BotEditorPage';
import Header from './components/Header';

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

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <ConditionalHeader />
      <main className={`${!location.pathname.includes('/editor') ? 'p-4 sm:p-6 lg:p-8' : ''} animate-fadeIn`} key={location.pathname}>
        <Routes>
          {/* Public routes that redirect if logged in */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />} />

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
            path="/bot/:botId/editor"
            element={
              <ProtectedRoute>
                <BotEditorPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

const AppWrapper: React.FC = () => (
    <HashRouter>
        <App />
    </HashRouter>
);

// Only show header on protected routes
const ConditionalHeader: React.FC = () => {
  const location = useLocation();
  const noHeaderPaths = ['/', '/login', '/register'];
  if (noHeaderPaths.includes(location.pathname) || location.pathname.includes('/editor')) {
    return null;
  }
  return <Header />;
};

export default AppWrapper;