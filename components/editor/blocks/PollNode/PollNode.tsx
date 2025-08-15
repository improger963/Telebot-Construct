import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { useFlowStore } from '../../../../store/flowStore';
import { PollIcon } from '../../../icons/PollIcon';

const PollNode: React.FC<NodeProps> = ({ data, id }) => {
  const activeNodeId = useFlowStore(state => state.activeNodeId);
  const isActive = activeNodeId === id;
  const optionCount = data.options?.length || 0;

  return (
    <div className={`w-72 rounded-2xl shadow-lg bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 border-t-4 border-brand-amber p-4 ${isActive ? 'node-active-highlight' : ''}`}>
      <Handle type="target" position={Position.Top} className="w-16 !bg-accent" />

      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-700">
        <div className="w-8 h-8 rounded-md flex items-center justify-center bg-brand-amber/20">
          <PollIcon className="h-5 w-5 text-brand-amber" />
        </div>
        <div className="text-md font-bold text-text-primary">
          Опрос
        </div>
      </div>

      <div className="text-sm text-text-secondary max-w-xs break-words whitespace-pre-wrap p-1">
        {data.question || <span className="italic">Введите вопрос...</span>}
      </div>
      <p className="text-xs text-text-secondary mt-2 pl-1">{optionCount} вариант(а/ов)</p>

      <Handle type="source" position={Position.Bottom} className="w-16 !bg-primary" />
    </div>
  );
};

export default memo(PollNode);
