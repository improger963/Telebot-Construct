import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';

const StartNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className="px-5 py-4 shadow-lg rounded-xl bg-surface border-t-4 border-green-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="flex items-center">
        <div className="text-lg font-bold text-text-primary">
          {data.label}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-primary" />
    </div>
  );
};

export default memo(StartNode);