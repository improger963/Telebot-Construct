import React from 'react';

const WelcomeGuide: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 z-20 flex items-center justify-center p-8 welcome-guide">
      <div className="bg-surface rounded-2xl shadow-xl p-8 max-w-2xl w-full text-center space-y-6 welcome-guide-step">
        <h2 className="text-3xl font-bold text-brand-green">Welcome to the Bot Editor!</h2>
        <p className="text-text-secondary">Here’s a quick guide to get you started on building your amazing Telegram bot.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-input p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2 text-text-primary">1. Add Blocks</h3>
            <p className="text-sm text-text-secondary">Drag different blocks like "Message" or "User Input" from the sidebar on the left onto this canvas.</p>
          </div>
          <div className="bg-input p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2 text-text-primary">2. Connect Them</h3>
            <p className="text-sm text-text-secondary">Click and drag from the small circles (handles) on the bottom of one block to the top of another to create a flow.</p>
          </div>
          <div className="bg-input p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2 text-text-primary">3. Configure Settings</h3>
            <p className="text-sm text-text-secondary">Click on any block on the canvas to open its settings panel on the right, where you can customize its behavior.</p>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="py-3 px-6 font-semibold text-primary-text bg-primary rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary transition-all duration-200 ease-in-out hover:scale-105 active:scale-95"
        >
          Got it, let's build!
        </button>
      </div>
    </div>
  );
};

export default WelcomeGuide;