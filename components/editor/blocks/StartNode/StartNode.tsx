import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { StartIcon } from '../../../icons/StartIcon';
import { useFlowStore } from '../../../../store/flowStore';

const StartNode: React.FC<NodeProps> = ({ data, id }) => {
  const activeNodeId = useFlowStore(state => state.activeNodeId);
  const isActive = activeNodeId === id;

  return (
    <div className={`px-5 py-4 shadow-lg rounded-xl bg-surface border-t-4 border-brand-green ${isActive ? 'node-active-highlight' : ''}`}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-md flex items-center justify-center bg-brand-green/20">
          <StartIcon className="h-5 w-5 text-brand-green" />
        </div>
        <div className="text-lg font-bold text-text-primary">
          {data.label}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-primary" />
    </div>
  );
};

export default memo(StartNode);