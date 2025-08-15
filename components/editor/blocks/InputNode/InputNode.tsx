import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { InputIcon } from '../../../icons/InputIcon';
import { useFlowStore } from '../../../../store/flowStore';

const InputNode: React.FC<NodeProps> = ({ data, id }) => {
  const activeNodeId = useFlowStore(state => state.activeNodeId);
  const isActive = activeNodeId === id;

  return (
    <div className={`w-72 rounded-2xl shadow-lg bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 border-t-4 border-brand-violet p-4 ${isActive ? 'node-active-highlight' : ''}`}>
      <Handle type="target" position={Position.Top} className="w-16 !bg-accent" />

      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-700">
        <div className="w-8 h-8 rounded-md flex items-center justify-center bg-brand-violet/20">
          <InputIcon className="h-5 w-5 text-brand-violet" />
        </div>
        <div className="text-md font-bold text-text-primary">
          Запросить ввод
        </div>
      </div>

      <div className="text-sm text-text-secondary max-w-xs break-words whitespace-pre-wrap p-1">
        {data.question || <span className="italic">Введите вопрос для пользователя...</span>}
      </div>
      {data.variableName && (
        <div className="text-xs text-text-secondary mt-3 pt-3 border-t border-slate-700">
            Сохранить ответ в: <span className="font-mono bg-input p-1 rounded text-brand-violet">{`{${data.variableName}}`}</span>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="w-16 !bg-primary" />
    </div>
  );
};

export default memo(InputNode);