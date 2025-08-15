
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
    <header className="bg-background">
      <nav className="container mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold text-text-primary flex items-center gap-2 group">
          <Logo className="h-8 w-8 text-brand-green group-hover:scale-110 transition-transform duration-300" />
          TeleBot Constructor
        </Link>
        <div className="flex items-center space-x-4">
          {user && <span className="text-text-secondary hidden sm:block">Welcome, {user.email}</span>}
          <button
            onClick={handleLogout}
            className="bg-surface hover:bg-input text-text-primary font-medium py-2 px-4 rounded-lg transition-all duration-200 ease-in-out active:scale-95 hover:scale-105"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
