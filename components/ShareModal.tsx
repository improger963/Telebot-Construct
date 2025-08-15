import React, { useState } from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { ShareIcon } from './icons/ShareIcon';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  botName: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, botName }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 animate-fadeIn backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-slate-900/70 backdrop-blur-2xl border border-slate-700/50 p-8 rounded-3xl shadow-2xl w-full max-w-lg transition-all duration-300 ease-out transform animate-scaleIn">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-surface transition-colors" aria-label="Закрыть">
            <CloseIcon className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-brand-violet/20 text-brand-violet flex items-center justify-center">
                <ShareIcon className="w-6 h-6"/>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-text-primary">Поделиться "{botName}"</h2>
                <p className="text-text-secondary">Пригласите коллег для совместной работы (функция в разработке).</p>
            </div>
        </div>
        
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Ссылка для приглашения</label>
                <div className="flex gap-2">
                    <input type="text" value="https://telebot-constructor.app/invite/a1b2c3d4e5f6" readOnly className="w-full px-4 py-3 text-text-secondary bg-input rounded-xl border border-accent focus:outline-none cursor-not-allowed"/>
                    <button onClick={handleCopy} className={`w-32 px-4 py-3 font-semibold rounded-xl transition-all ${copied ? 'bg-brand-green text-white' : 'bg-brand-emerald text-white'}`}>
                        {copied ? 'Готово!' : 'Копировать'}
                    </button>
                </div>
            </div>

            <div>
                 <p className="font-medium text-text-primary mb-3">Управление доступом</p>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-input rounded-lg">
                        <div className="flex items-center gap-3">
                            <img src="https://i.pravatar.cc/40?u=a" alt="User" className="w-8 h-8 rounded-full"/>
                            <div>
                                <p className="text-sm font-medium text-text-primary">you@example.com</p>
                                <p className="text-xs text-text-secondary">Владелец</p>
                            </div>
                        </div>
                        <p className="text-sm font-medium text-text-secondary">Владелец</p>
                    </div>
                     <div className="flex justify-between items-center p-3 bg-input rounded-lg opacity-50">
                        <div className="flex items-center gap-3">
                            <img src="https://i.pravatar.cc/40?u=b" alt="User" className="w-8 h-8 rounded-full"/>
                            <div>
                                <p className="text-sm font-medium text-text-primary">teammate@example.com</p>
                                <p className="text-xs text-text-secondary">Приглашен</p>
                            </div>
                        </div>
                        <select className="bg-surface border border-accent rounded-md text-sm p-1 focus:outline-none cursor-not-allowed">
                            <option>Может редактировать</option>
                            <option>Может просматривать</option>
                        </select>
                    </div>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
