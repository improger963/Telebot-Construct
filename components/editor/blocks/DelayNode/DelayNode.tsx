import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { useFlowStore } from '../../../../store/flowStore';
import { DelayIcon } from '../../../icons/DelayIcon';

const getSecondsText = (seconds: number) => {
    const s = seconds || 1;
    if (s % 10 === 1 && s % 100 !== 11) {
        return `${s} секунду`;
    }
    if ([2, 3, 4].includes(s % 10) && ![12, 13, 14].includes(s % 100)) {
        return `${s} секунды`;
    }
    return `${s} секунд`;
}


const DelayNode: React.FC<NodeProps> = ({ data, id }) => {
  const activeNodeId = useFlowStore(state => state.activeNodeId);
  const isActive = activeNodeId === id;

  return (
    <div className={`w-72 rounded-2xl shadow-lg bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 border-t-4 border-slate-500 p-4 ${isActive ? 'node-active-highlight' : ''}`}>
      <Handle type="target" position={Position.Top} className="w-16 !bg-accent" />
      
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-md flex items-center justify-center bg-slate-500/20">
            <DelayIcon className="h-5 w-5 text-slate-400" />
        </div>
        <div className="text-md font-bold text-text-primary">
          Подождать {getSecondsText(data.seconds)}
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-primary" />
    </div>
  );
};

export default memo(DelayNode);