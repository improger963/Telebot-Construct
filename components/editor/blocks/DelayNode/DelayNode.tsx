import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { useFlowStore } from '../../../../store/flowStore';
import { DelayIcon } from '../../../icons/DelayIcon';

const DelayNode: React.FC<NodeProps> = ({ data, id }) => {
  const activeNodeId = useFlowStore(state => state.activeNodeId);
  const isActive = activeNodeId === id;

  return (
    <div className={`px-5 py-4 shadow-lg rounded-xl bg-surface border-t-4 border-gray-500 w-72 ${isActive ? 'node-active-highlight' : ''}`}>
      <Handle type="target" position={Position.Top} className="w-16 !bg-accent" />
      
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-md flex items-center justify-center bg-gray-500/20">
            <DelayIcon className="h-5 w-5 text-gray-400" />
        </div>
        <div className="text-md font-bold text-text-primary">
          Wait for {data.seconds || 1} second(s)
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-primary" />
    </div>
  );
};

export default memo(DelayNode);