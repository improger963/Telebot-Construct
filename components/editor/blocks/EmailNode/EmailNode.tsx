import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { useFlowStore } from '../../../../store/flowStore';
import { EmailIcon } from '../../../icons/EmailIcon';

const EmailNode: React.FC<NodeProps> = ({ data, id }) => {
  const activeNodeId = useFlowStore(state => state.activeNodeId);
  const isActive = activeNodeId === id;

  return (
    <div className={`w-72 rounded-2xl shadow-lg bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 border-t-4 border-slate-500 p-4 ${isActive ? 'node-active-highlight' : ''}`}>
      <Handle type="target" position={Position.Top} className="w-16 !bg-accent" />
      
      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-700">
         <div className="w-8 h-8 rounded-md flex items-center justify-center bg-slate-500/20">
            <EmailIcon className="h-5 w-5 text-slate-400" />
        </div>
        <div className="text-md font-bold text-text-primary">
          Email уведомление
        </div>
      </div>
      
      <div className="text-sm text-text-secondary space-y-2 p-1">
        <div className="font-mono bg-input p-2 rounded text-slate-300 w-full truncate">Кому: {data.to || '...'}</div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-primary" />
    </div>
  );
};

export default memo(EmailNode);
