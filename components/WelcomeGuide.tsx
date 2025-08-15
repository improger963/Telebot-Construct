import React from 'react';

const WelcomeGuide: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 z-20 flex items-center justify-center p-8 welcome-guide">
      <div className="bg-slate-900/70 backdrop-blur-2xl border border-slate-700/50 rounded-3xl shadow-2xl p-8 max-w-2xl w-full text-center space-y-6 welcome-guide-step">
        <h2 className="text-3xl font-bold text-brand-emerald">Welcome to the Bot Editor!</h2>
        <p className="text-text-secondary">Here’s a quick guide to get you started on building your amazing Telegram bot.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-input p-4 rounded-xl border border-accent">
            <h3 className="font-bold text-lg mb-2 text-text-primary">1. Add Blocks</h3>
            <p className="text-sm text-text-secondary">Drag different blocks like "Message" or "User Input" from the sidebar on the left onto this canvas.</p>
          </div>
          <div className="bg-input p-4 rounded-xl border border-accent">
            <h3 className="font-bold text-lg mb-2 text-text-primary">2. Connect Them</h3>
            <p className="text-sm text-text-secondary">Click and drag from the small circles (handles) on the bottom of one block to the top of another to create a flow.</p>
          </div>
          <div className="bg-input p-4 rounded-xl border border-accent">
            <h3 className="font-bold text-lg mb-2 text-text-primary">3. Configure Settings</h3>
            <p className="text-sm text-text-secondary">Click on any block on the canvas to open its settings panel on the right, where you can customize its behavior.</p>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="group relative px-8 py-3 font-bold text-lg text-white bg-gradient-to-r from-brand-emerald to-brand-teal rounded-2xl hover:shadow-2xl hover:shadow-brand-emerald/30 transition-all duration-300 hover:scale-110 active:scale-95"
        >
          Got it, let's build!
        </button>
      </div>
    </div>
  );
};

export default WelcomeGuide;