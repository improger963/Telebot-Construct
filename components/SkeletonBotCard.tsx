import React from 'react';

const SkeletonBotCard: React.FC = () => {
  return (
    <div className="bg-surface rounded-2xl shadow-lg p-6 flex flex-col justify-between h-48">
      <div className="flex-grow">
        <div className="h-6 w-3/4 rounded-md shimmer-bg mb-3"></div>
        <div className="h-4 w-1/2 rounded-md shimmer-bg"></div>
      </div>
      <div className="flex justify-between items-end">
        <div className="h-4 w-1/4 rounded-md shimmer-bg"></div>
      </div>
    </div>
  );
};

export default SkeletonBotCard;