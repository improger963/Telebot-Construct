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
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = true,
}) => {
  if (!isOpen) return null;

  const confirmButtonClass = isDestructive
    ? 'bg-brand-red hover:bg-red-600'
    : 'bg-primary hover:bg-gray-200 text-primary-text';

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 animate-fadeIn backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-surface p-8 rounded-2xl shadow-xl w-full max-w-md transition-all duration-300 ease-out transform animate-scaleIn">
        <h2 className="text-2xl font-bold mb-4 text-text-primary">{title}</h2>
        <p className="text-text-secondary mb-8">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="py-2 px-5 bg-input hover:bg-gray-700 rounded-lg transition-colors text-text-primary font-medium"
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