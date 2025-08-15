import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { useFlowStore } from '../../../../store/flowStore';
import { WebAppIcon } from '../../../icons/WebAppIcon';

const MiniAppNode: React.FC<NodeProps> = ({ data, id }) => {
  const activeNodeId = useFlowStore(state => state.activeNodeId);
  const isActive = activeNodeId === id;

  return (
    <div className={`w-72 rounded-2xl shadow-lg bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 border-t-4 border-blue-500 p-4 ${isActive ? 'node-active-highlight' : ''}`}>
      <Handle type="target" position={Position.Top} className="w-16 !bg-accent" />
      
      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-700">
         <div className="w-8 h-8 rounded-md flex items-center justify-center bg-blue-500/20">
            <WebAppIcon className="h-5 w-5 text-blue-400" />
        </div>
        <div className="text-md font-bold text-text-primary">
          Mini App
        </div>
      </div>
      
      <div className="text-sm text-text-secondary space-y-2 p-1">
        <p>Название: <span className="text-text-primary font-semibold">{data.title || '...'}</span></p>
        <p>Текст кнопки: <span className="text-text-primary font-semibold">{data.buttonText || '...'}</span></p>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-primary" />
    </div>
  );
};

export default memo(MiniAppNode);
