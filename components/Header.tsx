
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Logo from './Logo';

const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-2xl border-b border-slate-800/50">
      <nav className="container mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold text-text-primary flex items-center gap-3 group">
          <Logo className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
          <span className="hidden sm:inline bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            TeleBot Constructor
          </span>
        </Link>
        <div className="flex items-center space-x-4">
          {user && <span className="text-text-secondary hidden sm:block">Welcome, {user.email}</span>}
          <button
            onClick={handleLogout}
            className="px-5 py-2 font-medium text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;