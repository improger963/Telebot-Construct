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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBotCard key={i} />
          ))}
        </div>
      );
    }
    
    if (bots.length > 0) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {bots.map((bot: Bot, index: number) => (
            <BotCard key={bot.id} bot={bot} index={index} onDeleteClick={() => openDeleteConfirm(bot)} />
          ))}
        </div>
      );
    }
    
    return (
      <div className="text-center py-20 px-6 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl flex flex-col items-center animate-scaleIn">
        <Logo className="w-24 h-24 text-brand-emerald mb-6" />
        <h2 className="text-3xl font-bold mb-3">Создайте своего первого бота!</h2>
        <p className="text-text-secondary mb-8 max-w-sm">Похоже, у вас еще нет ботов. Давайте создадим одного, чтобы начать.</p>
         <button
            onClick={() => setIsModalOpen(true)}
            className="group relative px-8 py-3 font-bold text-lg text-white bg-gradient-to-r from-brand-emerald to-brand-teal rounded-2xl hover:shadow-2xl hover:shadow-brand-emerald/30 transition-all duration-300 hover:scale-110 active:scale-95 overflow-hidden"
          >
            + Создать нового бота
          </button>
      </div>
    );
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Мои боты</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="group relative px-6 py-3 font-semibold text-white bg-gradient-to-r from-brand-emerald to-brand-teal rounded-xl hover:shadow-lg hover:shadow-brand-emerald/25 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
        >
          + Создать нового бота
        </button>
      </div>

      {renderContent()}

      <CreateBotModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteBot}
        title="Удалить бота"
        message={`Вы уверены, что хотите удалить "${botToDelete?.name}"? Это действие нельзя будет отменить.`}
        confirmText="Удалить"
        cancelText="Отмена"
      />
    </div>
  );
};

export default DashboardPage;