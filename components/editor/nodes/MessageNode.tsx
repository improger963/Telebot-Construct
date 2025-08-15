import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';

const MessageNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className="px-5 py-4 shadow-lg rounded-xl bg-surface border-t-4 border-blue-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="flex flex-col">
        <div className="text-md font-bold text-text-primary mb-2">
          Send Message
        </div>
        <div className="text-sm text-text-secondary max-w-xs break-words whitespace-pre-wrap">
          {data.text || 'Enter message text...'}
        </div>
      </div>
      <Handle type="target" position={Position.Top} className="w-16 !bg-accent" />
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-primary" />
    </div>
  );
};

export default memo(MessageNode);