import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  isDestructive = true,
}) => {
  if (!isOpen) return null;

  const confirmButtonClass = isDestructive
    ? 'bg-brand-red hover:bg-red-600'
    : 'bg-gradient-to-r from-brand-emerald to-brand-teal';

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 animate-fadeIn backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-slate-900/70 backdrop-blur-2xl border border-slate-700/50 p-8 rounded-3xl shadow-2xl w-full max-w-md transition-all duration-300 ease-out transform animate-scaleIn">
        <h2 className="text-2xl font-bold mb-4 text-text-primary">{title}</h2>
        <p className="text-text-secondary mb-8">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="py-2 px-5 bg-input hover:bg-accent rounded-lg transition-colors text-text-primary font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`py-2 px-5 rounded-lg transition-colors font-semibold text-white ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;