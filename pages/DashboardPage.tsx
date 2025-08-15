import React, { useEffect, useState } from 'react';
import { useBotStore } from '../store/botStore';
import { useAuthStore } from '../store/authStore';
import BotCard from '../components/BotCard';
import { Bot } from '../types';
import CreateBotModal from '../components/CreateBotModal';
import SkeletonBotCard from '../components/SkeletonBotCard';
import ConfirmationModal from '../components/ConfirmationModal';
import { PlusIcon } from '../components/icons/PlusIcon';
import { WrenchScrewdriverIcon } from '../components/icons/WrenchScrewdriverIcon';
import { RocketLaunchIcon } from '../components/icons/RocketLaunchIcon';

const DashboardPage: React.FC = () => {
  const { bots, fetchBots, deleteBot } = useBotStore();
  const { user } = useAuthStore();
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

  const getBotCountText = (count: number) => {
    const cases = [2, 0, 1, 1, 1, 2];
    const titles = ['бот', 'бота', 'ботов'];
    return titles[(count % 100 > 4 && count % 100 < 20) ? 2 : cases[(count % 10 < 5) ? count % 10 : 5]];
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
      <div className="text-center py-12 px-6 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl flex flex-col items-center animate-scaleIn">
        <h2 className="text-4xl font-bold mb-3 text-text-primary">Добро пожаловать в TeleBot Constructor!</h2>
        <p className="text-text-secondary mb-12 max-w-2xl">Давайте создадим вашего первого Telegram-бота за несколько простых шагов.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full mb-12 text-left">
          {/* Step 1: Create */}
          <div className="bg-input p-6 rounded-2xl border border-accent space-y-3 transition-transform hover:scale-105 hover:border-brand-emerald/50">
            <div className="w-12 h-12 rounded-xl bg-brand-emerald/20 text-brand-emerald flex items-center justify-center">
              <PlusIcon className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-text-primary">1. Создайте своего бота</h3>
            <p className="text-sm text-text-secondary">Нажмите кнопку ниже, чтобы дать вашему боту имя и получить токен от BotFather.</p>
          </div>
          
          {/* Step 2: Build */}
          <div className="bg-input p-6 rounded-2xl border border-accent space-y-3 transition-transform hover:scale-105 hover:border-brand-violet/50">
            <div className="w-12 h-12 rounded-xl bg-brand-violet/20 text-brand-violet flex items-center justify-center">
              <WrenchScrewdriverIcon className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-text-primary">2. Соберите сценарий</h3>
            <p className="text-sm text-text-secondary">Используйте наш визуальный редактор, чтобы перетаскивать блоки и создавать логику вашего бота.</p>
          </div>
          
          {/* Step 3: Launch */}
          <div className="bg-input p-6 rounded-2xl border border-accent space-y-3 transition-transform hover:scale-105 hover:border-brand-teal/50">
            <div className="w-12 h-12 rounded-xl bg-brand-teal/20 text-brand-teal flex items-center justify-center">
              <RocketLaunchIcon className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-text-primary">3. Протестируйте и запустите</h3>
            <p className="text-sm text-text-secondary">Проверьте работу бота в симуляторе и запустите его для ваших пользователей в Telegram.</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="group relative px-8 py-4 font-bold text-lg text-white bg-gradient-to-r from-brand-emerald to-brand-teal rounded-2xl hover:shadow-2xl hover:shadow-brand-emerald/30 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center"
        >
          <PlusIcon className="w-6 h-6 mr-3" />
          Создать первого бота
        </button>
      </div>
    );
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-10 animate-fadeInUp">
        <div>
            <h1 className="text-4xl font-bold text-text-primary">
                {user ? `Привет, ${user.email}!` : 'Мои боты'}
            </h1>
            <p className="text-text-secondary mt-1">
                {loading ? 'Загрузка ботов...' : `У вас ${bots.length} ${getBotCountText(bots.length)}.`}
            </p>
        </div>
        { ( !loading && bots.length > 0 ) && 
            <button
              onClick={() => setIsModalOpen(true)}
              className="group flex-shrink-0 relative px-6 py-3 font-semibold text-white bg-gradient-to-r from-brand-emerald to-brand-teal rounded-xl hover:shadow-lg hover:shadow-brand-emerald/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Создать нового бота
            </button>
        }
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
