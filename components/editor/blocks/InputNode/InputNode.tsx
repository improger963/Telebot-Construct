import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { InputIcon } from '../../../icons/InputIcon';
import { useFlowStore } from '../../../../store/flowStore';

const InputNode: React.FC<NodeProps> = ({ data, id }) => {
  const activeNodeId = useFlowStore(state => state.activeNodeId);
  const isActive = activeNodeId === id;

  return (
    <div className={`px-5 py-4 shadow-lg rounded-xl bg-surface border-t-4 border-brand-purple w-72 ${isActive ? 'node-active-highlight' : ''}`}>
      <Handle type="target" position={Position.Top} className="w-16 !bg-accent" />

      <div className="flex items-center gap-3 mb-3 pb-2 border-b border-input">
        <div className="w-8 h-8 rounded-md flex items-center justify-center bg-brand-purple/20">
          <InputIcon className="h-5 w-5 text-brand-purple" />
        </div>
        <div className="text-md font-bold text-text-primary">
          Ask for Input
        </div>
      </div>

      <div className="text-sm text-text-secondary max-w-xs break-words whitespace-pre-wrap">
        {data.question || <span className="italic">Enter question for user...</span>}
      </div>
      {data.variableName && (
        <div className="text-xs text-text-secondary mt-2 pt-2 border-t border-input">
            Save response to: <span className="font-mono bg-input p-1 rounded text-brand-purple">{`{${data.variableName}}`}</span>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="w-16 !bg-primary" />
    </div>
  );
};

export default memo(InputNode);