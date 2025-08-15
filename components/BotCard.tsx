
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot } from '../types';

interface BotCardProps {
  bot: Bot;
  index: number;
  onDeleteClick: () => void;
}

const BotCard: React.FC<BotCardProps> = ({ bot, index, onDeleteClick }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/bot/${bot.id}/editor`);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    onDeleteClick();
  };

  return (
    <div 
        onClick={handleNavigate}
        className="bg-surface rounded-2xl shadow-lg p-6 flex flex-col justify-between h-48 hover:shadow-glow-green transition-all duration-300 ease-in-out cursor-pointer group relative opacity-0 animate-fadeInUp"
        style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-text-primary truncate">{bot.name}</h3>
        <p className="text-sm text-text-secondary mt-1">Token: ...{bot.telegramToken.slice(-6)}</p>
      </div>
      <div className="flex justify-between items-end">
        <p className="text-xs text-text-secondary">
          Created: {new Date(bot.createdAt).toLocaleDateString()}
        </p>
        <div className="text-text-secondary group-hover:translate-x-1 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </div>
      </div>
       <button
          onClick={handleDelete}
          className="absolute top-3 right-3 text-text-secondary hover:text-brand-red opacity-0 group-hover:opacity-100 transition-all p-1 rounded-full hover:bg-input"
          aria-label="Delete bot"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
          </svg>
        </button>
    </div>
  );
};

export default BotCard;
