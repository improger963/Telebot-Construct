import React, { useEffect, useState } from 'react';
import { useBotStore } from '../store/botStore';
import BotCard from '../components/BotCard';
import { Bot } from '../types';
import Logo from '../components/Logo';
import CreateBotModal from '../components/CreateBotModal';
import SkeletonBotCard from '../components/SkeletonBotCard';
import ConfirmationModal from '../components/ConfirmationModal';

const DashboardPage: React.FC = () => {
  const { bots, fetchBots, deleteBot } = useBotStore();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [botToDelete, setBotToDelete] = useState<Bot | null>(null);

  useEffect(() => {
    const loadBots = async () => {
      await fetchBots();
      setLoading(false);
    };
    loadBots();
  }, [fetchBots]);
  
  const openDeleteConfirm = (bot: Bot) => {
    setBotToDelete(bot);
    setIsConfirmOpen(true);
  };

  const handleDeleteBot = async () => {
    if (botToDelete) {
      await deleteBot(botToDelete.id);
      setIsConfirmOpen(false);
      setBotToDelete(null);
    }
  };


  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBotCard key={i} />
          ))}
        </div>
      );
    }
    
    if (bots.length > 0) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bots.map((bot: Bot, index: number) => (
            <BotCard key={bot.id} bot={bot} index={index} onDeleteClick={() => openDeleteConfirm(bot)} />
          ))}
        </div>
      );
    }
    
    return (
      <div className="text-center py-20 px-6 bg-surface rounded-2xl flex flex-col items-center animate-scaleIn">
        <Logo className="w-20 h-20 text-brand-green mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Create your first bot!</h2>
        <p className="text-text-secondary mb-6 max-w-sm">It looks like you don't have any bots yet. Let's create one to get started.</p>
         <button
            onClick={() => setIsModalOpen(true)}
            className="py-3 px-6 font-semibold text-primary-text bg-primary rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary transition-all duration-200 ease-in-out hover:scale-105 active:scale-95"
          >
            + Create New Bot
          </button>
      </div>
    );
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Bots</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="py-3 px-5 font-semibold text-primary-text bg-primary rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary transition-all duration-200 ease-in-out hover:scale-105 active:scale-95"
        >
          + Create New Bot
        </button>
      </div>

      {renderContent()}

      <CreateBotModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteBot}
        title="Delete Bot"
        message={`Are you sure you want to delete "${botToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  );
};

export default DashboardPage;