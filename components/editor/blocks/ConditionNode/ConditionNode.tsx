import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { ConditionIcon } from '../../../icons/ConditionIcon';
import { useFlowStore } from '../../../../store/flowStore';

const ConditionNode: React.FC<NodeProps> = ({ data, id }) => {
  const activeNodeId = useFlowStore(state => state.activeNodeId);
  const isActive = activeNodeId === id;

  return (
    <div className={`px-5 py-4 shadow-lg rounded-xl bg-surface border-t-4 border-brand-orange w-72 ${isActive ? 'node-active-highlight' : ''}`}>
      <Handle type="target" position={Position.Top} className="w-16 !bg-accent" />
      
      <div className="flex items-center gap-3 mb-3 pb-2 border-b border-input">
         <div className="w-8 h-8 rounded-md flex items-center justify-center bg-brand-orange/20">
            <ConditionIcon className="h-5 w-5 text-brand-orange" />
        </div>
        <div className="text-md font-bold text-text-primary">
          Condition
        </div>
      </div>
      
      <div className="text-sm text-text-secondary space-y-1">
        <span>If</span>
        <div className="font-mono bg-input p-1 rounded text-brand-orange w-full truncate">{`{${data.variable || 'variable'}}`}</div>
        <span>contains</span>
        <div className="font-mono bg-input p-1 rounded text-brand-orange w-full truncate">{`"${data.value || 'value'}"`}</div>
      </div>

      <Handle id="true" type="source" position={Position.Bottom} style={{ left: '25%' }} className="!bg-brand-green">
        <div className="absolute top-2.5 transform -translate-x-1/2 left-1/2 px-2 py-0.5 rounded-full text-xs text-white bg-brand-green">True</div>
      </Handle>
      <Handle id="false" type="source" position={Position.Bottom} style={{ left: '75%' }} className="!bg-brand-red">
         <div className="absolute top-2.5 transform -translate-x-1/2 left-1/2 px-2 py-0.5 rounded-full text-xs text-white bg-brand-red">False</div>
      </Handle>
    </div>
  );
};

export default memo(ConditionNode);