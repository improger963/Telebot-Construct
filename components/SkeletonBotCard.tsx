import React from 'react';

const SkeletonBotCard: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 h-52 flex flex-col justify-between">
      <div className="flex-grow">
        <div className="h-6 w-3/4 rounded-md bg-slate-700/50 animate-pulse mb-3"></div>
        <div className="h-4 w-1/2 rounded-md bg-slate-700/50 animate-pulse"></div>
      </div>
      <div className="flex justify-between items-end">
        <div className="h-4 w-1/4 rounded-md bg-slate-700/50 animate-pulse"></div>
      </div>
    </div>
  );
};

export default SkeletonBotCard;