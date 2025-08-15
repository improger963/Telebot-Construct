import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { useFlowStore } from '../../../../store/flowStore';
import { ShuffleIcon } from '../../../icons/ShuffleIcon';

const getMessageCountText = (count: number) => {
    const cases = [2, 0, 1, 1, 1, 2];
    const titles = ['сообщение', 'сообщения', 'сообщений'];
    const c = count || 0;
    return `${c} ${titles[(c % 100 > 4 && c % 100 < 20) ? 2 : cases[(c % 10 < 5) ? c % 10 : 5]]}`;
  };

const RandomMessageNode: React.FC<NodeProps> = ({ data, id }) => {
  const activeNodeId = useFlowStore(state => state.activeNodeId);
  const isActive = activeNodeId === id;
  const messageCount = data.messages?.length || 0;

  return (
    <div className={`w-72 rounded-2xl shadow-lg bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 border-t-4 border-brand-rose p-4 ${isActive ? 'node-active-highlight' : ''}`}>
      <Handle type="target" position={Position.Top} className="w-16 !bg-accent" />
      
      <div className="flex items-center gap-3">
         <div className="w-8 h-8 rounded-md flex items-center justify-center bg-brand-rose/20">
            <ShuffleIcon className="h-5 w-5 text-brand-rose" />
        </div>
        <div>
            <div className="text-md font-bold text-text-primary">
              Случайное сообщение
            </div>
            <p className="text-xs text-text-secondary">{getMessageCountText(messageCount)}</p>
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-primary" />
    </div>
  );
};

export default memo(RandomMessageNode);