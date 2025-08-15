import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { MessageIcon } from '../../../icons/MessageIcon';
import { useFlowStore } from '../../../../store/flowStore';

const MessageNode: React.FC<NodeProps> = ({ data, id }) => {
  const activeNodeId = useFlowStore(state => state.activeNodeId);
  const isActive = activeNodeId === id;
  const hasButtons = data.buttons && data.buttons.length > 0;
  
  return (
    <div className={`w-72 rounded-2xl shadow-lg bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 border-t-4 border-brand-cyan ${isActive ? 'node-active-highlight' : ''}`}>
      <div className="p-4">
        <Handle type="target" position={Position.Top} className="w-16 !bg-accent" />
        
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-md flex items-center justify-center bg-brand-cyan/20">
            <MessageIcon className="h-5 w-5 text-brand-cyan" />
          </div>
          <div className="text-md font-bold text-text-primary">
            Отправить сообщение
          </div>
        </div>
        
        <div className="text-sm text-text-secondary max-w-xs break-words whitespace-pre-wrap pl-11 pb-3">
          {data.text || <span className="italic">Введите текст сообщения...</span>}
        </div>
      </div>
      
      {hasButtons ? (
        <div className="relative pt-2 border-t border-slate-700/50 px-2 pb-1.5 h-10 bg-slate-800/50 rounded-b-2xl">
            {data.buttons.map((button, index) => {
                const handlePosition = (100 / (data.buttons.length + 1)) * (index + 1);
                return (
                    <div key={button.id}>
                        <div className="absolute top-0 transform -translate-x-1/2" style={{ left: `${handlePosition}%` }}>
                            <p className="text-xs text-center text-text-secondary px-1 truncate max-w-[80px]" title={button.text}>{button.text || `Кнопка ${index + 1}`}</p>
                        </div>
                        <Handle
                            type="source"
                            position={Position.Bottom}
                            id={button.id}
                            style={{ left: `${handlePosition}%` }}
                            className="!bg-brand-cyan"
                        />
                    </div>
                );
            })}
        </div>
      ) : (
         <Handle type="source" position={Position.Bottom} className="w-16 !bg-primary" />
      )}
    </div>
  );
};

export default memo(MessageNode);