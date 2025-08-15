import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { useFlowStore } from '../../../../store/flowStore';
import { ButtonInputIcon } from '../../../icons/ButtonInputIcon';

const ButtonInputNode: React.FC<NodeProps> = ({ data, id }) => {
  const activeNodeId = useFlowStore(state => state.activeNodeId);
  const isActive = activeNodeId === id;

  return (
    <div className={`px-5 py-4 shadow-lg rounded-xl bg-surface border-t-4 border-teal-500 w-72 ${isActive ? 'node-active-highlight' : ''}`}>
      <Handle type="target" position={Position.Top} className="w-16 !bg-accent" />

      <div className="flex items-center gap-3 mb-3 pb-2 border-b border-input">
        <div className="w-8 h-8 rounded-md flex items-center justify-center bg-teal-500/20">
          <ButtonInputIcon className="h-5 w-5 text-teal-500" />
        </div>
        <div className="text-md font-bold text-text-primary">
          Button Input
        </div>
      </div>

      <div className="text-sm text-text-secondary max-w-xs break-words whitespace-pre-wrap">
        {data.question || <span className="italic">Enter question for user...</span>}
      </div>
      
      {data.variableName && (
        <div className="text-xs text-text-secondary mt-2 pt-2 border-t border-input">
            Save choice to: <span className="font-mono bg-input p-1 rounded text-teal-300">{`{${data.variableName}}`}</span>
        </div>
      )}

      {data.buttons && data.buttons.length > 0 && (
        <div className="mt-2 pt-2 border-t border-input text-xs text-text-secondary space-y-1">
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