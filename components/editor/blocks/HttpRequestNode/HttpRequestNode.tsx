import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { useFlowStore } from '../../../../store/flowStore';
import { WebhookIcon } from '../../../icons/WebhookIcon';

const HttpRequestNode: React.FC<NodeProps> = ({ data, id }) => {
  const activeNodeId = useFlowStore(state => state.activeNodeId);
  const isActive = activeNodeId === id;

  return (
    <div className={`w-72 rounded-2xl shadow-lg bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 border-t-4 border-slate-500 p-4 ${isActive ? 'node-active-highlight' : ''}`}>
      <Handle type="target" position={Position.Top} className="w-16 !bg-accent" />
      
      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-700">
         <div className="w-8 h-8 rounded-md flex items-center justify-center bg-slate-500/20">
            <WebhookIcon className="h-5 w-5 text-slate-400" />
        </div>
        <div className="text-md font-bold text-text-primary">
          HTTP Запрос
        </div>
      </div>
      
      <div className="text-sm text-text-secondary space-y-2 p-1">
        <div className="font-mono bg-input p-2 rounded text-slate-300 w-full truncate"><span className="font-sans text-text-secondary">{data.method || 'GET'}:</span> {data.url || '...'}</div>
      </div>
      
      <Handle id="success" type="source" position={Position.Bottom} style={{ left: '25%' }} className="!bg-brand-green">
        <div className="absolute top-2.5 transform -translate-x-1/2 left-1/2 px-2 py-0.5 rounded-full text-xs text-white bg-brand-green">✅ Успех</div>
      </Handle>
      <Handle id="failure" type="source" position={Position.Bottom} style={{ left: '75%' }} className="!bg-brand-red">
         <div className="absolute top-2.5 transform -translate-x-1/2 left-1/2 px-2 py-0.5 rounded-full text-xs text-white bg-brand-red">❌ Ошибка</div>
      </Handle>
    </div>
  );
};

export default memo(HttpRequestNode);
