import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { useFlowStore } from '../../../../store/flowStore';
import { ButtonInputIcon } from '../../../icons/ButtonInputIcon';

const ButtonInputNode: React.FC<NodeProps> = ({ data, id }) => {
  const activeNodeId = useFlowStore(state => state.activeNodeId);
  const isActive = activeNodeId === id;

  return (
    <div className={`w-72 rounded-2xl shadow-lg bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 border-t-4 border-brand-teal p-4 ${isActive ? 'node-active-highlight' : ''}`}>
      <Handle type="target" position={Position.Top} className="w-16 !bg-accent" />

      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-700">
        <div className="w-8 h-8 rounded-md flex items-center justify-center bg-brand-teal/20">
          <ButtonInputIcon className="h-5 w-5 text-brand-teal" />
        </div>
        <div className="text-md font-bold text-text-primary">
          Button Input
        </div>
      </div>

      <div className="text-sm text-text-secondary max-w-xs break-words whitespace-pre-wrap p-1">
        {data.question || <span className="italic">Enter question for user...</span>}
      </div>
      
      {data.variableName && (
        <div className="text-xs text-text-secondary mt-3 pt-3 border-t border-slate-700">
            Save choice to: <span className="font-mono bg-input p-1 rounded text-brand-teal">{`{${data.variableName}}`}</span>
        </div>
      )}

      {data.buttons && data.buttons.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-700 text-xs text-text-secondary space-y-1">
            <p className="font-semibold">Options:</p>
            <div className="flex flex-wrap gap-1">
                {data.buttons.map((btn: {id: string, text: string}) => (
                    <span key={btn.id} className="bg-input px-2 py-1 rounded">{btn.text}</span>
                ))}
            </div>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="w-16 !bg-primary" />
    </div>
  );
};

export default memo(ButtonInputNode);