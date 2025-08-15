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
    <div className={`px-5 py-4 shadow-lg rounded-xl bg-surface border-t-4 border-brand-blue w-72 ${isActive ? 'node-active-highlight' : ''}`}>
      <Handle type="target" position={Position.Top} className="w-16 !bg-accent" />
      
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-md flex items-center justify-center bg-brand-blue/20">
          <MessageIcon className="h-5 w-5 text-brand-blue" />
        </div>
        <div className="text-md font-bold text-text-primary">
          Send Message
        </div>
      </div>
      
      <div className="text-sm text-text-secondary max-w-xs break-words whitespace-pre-wrap pl-11 pb-3">
        {data.text || <span className="italic">Enter message text...</span>}
      </div>
      
      {hasButtons ? (
        <div className="relative pt-2 border-t border-input/50 -mx-5 -mb-4 px-2 pb-1.5 h-10">
            {data.buttons.map((button, index) => {
                const handlePosition = (100 / (data.buttons.length + 1)) * (index + 1);
                return (
                    <div key={button.id}>
                        <div className="absolute top-0 transform -translate-x-1/2" style={{ left: `${handlePosition}%` }}>
                            <p className="text-xs text-center text-text-secondary px-1 truncate max-w-[80px]" title={button.text}>{button.text || `Button ${index + 1}`}</p>
                        </div>
                        <Handle
                            type="source"
                            position={Position.Bottom}
                            id={button.id}
                            style={{ left: `${handlePosition}%` }}
                            className="!bg-brand-blue"
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