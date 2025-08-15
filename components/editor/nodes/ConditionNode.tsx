
import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';

const ConditionNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className="px-5 py-4 shadow-lg rounded-xl bg-surface border-t-4 border-orange-500 w-64 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="flex flex-col">
        <div className="text-md font-bold text-text-primary mb-2">
          Condition
        </div>
        <div className="text-sm text-text-secondary space-y-1">
          <span>If</span>
          <div className="font-mono bg-input p-1 rounded text-orange-300 w-full truncate">{`{${data.variable || 'variable'}}`}</div>
          <span>contains</span>
          <div className="font-mono bg-input p-1 rounded text-orange-300 w-full truncate">{`"${data.value || 'value'}"`}</div>
        </div>
      </div>
      <Handle type="target" position={Position.Top} className="w-16 !bg-accent" />
      <Handle id="true" type="source" position={Position.Bottom} style={{ left: '25%' }} className="!bg-green-500">
        <div className="absolute top-2.5 transform -translate-x-1/2 left-1/2 px-2 py-0.5 rounded-full text-xs text-white bg-green-500">True</div>
      </Handle>
      <Handle id="false" type="source" position={Position.Bottom} style={{ left: '75%' }} className="!bg-red-500">
         <div className="absolute top-2.5 transform -translate-x-1/2 left-1/2 px-2 py-0.5 rounded-full text-xs text-white bg-red-500">False</div>
      </Handle>
    </div>
  );
};

export default memo(ConditionNode);