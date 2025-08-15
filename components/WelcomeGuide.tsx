import React from 'react';

const WelcomeGuide: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 z-20 flex items-center justify-center p-8 welcome-guide">
      <div className="bg-slate-900/70 backdrop-blur-2xl border border-slate-700/50 rounded-3xl shadow-2xl p-8 max-w-2xl w-full text-center space-y-6 welcome-guide-step">
        <h2 className="text-3xl font-bold text-brand-emerald">Добро пожаловать в редактор ботов!</h2>
        <p className="text-text-secondary">Вот краткое руководство, которое поможет вам начать создание вашего потрясающего Telegram-бота.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-input p-4 rounded-xl border border-accent">
            <h3 className="font-bold text-lg mb-2 text-text-primary">1. Добавьте блоки</h3>
            <p className="text-sm text-text-secondary">Перетаскивайте различные блоки, такие как "Сообщение" или "Ввод пользователя", с боковой панели слева на этот холст.</p>
          </div>
          <div className="bg-input p-4 rounded-xl border border-accent">
            <h3 className="font-bold text-lg mb-2 text-text-primary">2. Соедините их</h3>
            <p className="text-sm text-text-secondary">Нажмите и перетащите маленький кружок (handle) внизу одного блока к верху другого, чтобы создать последовательность.</p>
          </div>
          <div className="bg-input p-4 rounded-xl border border-accent">
            <h3 className="font-bold text-lg mb-2 text-text-primary">3. Настройте параметры</h3>
            <p className="text-sm text-text-secondary">Нажмите на любой блок на холсте, чтобы открыть его панель настроек справа, где вы можете настроить его поведение.</p>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="group relative px-8 py-3 font-bold text-lg text-white bg-gradient-to-r from-brand-emerald to-brand-teal rounded-2xl hover:shadow-2xl hover:shadow-brand-emerald/30 transition-all duration-300 hover:scale-110 active:scale-95"
        >
          Понятно, давайте начнем!
        </button>
      </div>
    </div>
  );
};

export default WelcomeGuide;