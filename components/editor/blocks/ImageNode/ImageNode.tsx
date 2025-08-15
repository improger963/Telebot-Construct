import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { useFlowStore } from '../../../../store/flowStore';
import { ImageIcon } from '../../../icons/ImageIcon';

const ImageNode: React.FC<NodeProps> = ({ data, id }) => {
  const activeNodeId = useFlowStore(state => state.activeNodeId);
  const isActive = activeNodeId === id;

  return (
    <div className={`w-72 rounded-2xl shadow-lg bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 border-t-4 border-brand-rose p-4 ${isActive ? 'node-active-highlight' : ''}`}>
      <Handle type="target" position={Position.Top} className="w-16 !bg-accent" />
      
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-md flex items-center justify-center bg-brand-rose/20">
          <ImageIcon className="h-5 w-5 text-brand-rose" />
        </div>
        <div className="text-md font-bold text-text-primary">
          Send Image
        </div>
      </div>
      
      <div className="pl-11">
        {data.url ? (
            <img src={data.url} alt="Bot media" className="mt-2 rounded-lg max-h-40 w-full object-contain" />
        ) : (
            <div className="mt-2 rounded-lg h-24 w-full bg-input flex items-center justify-center text-text-secondary text-sm">
                No Image Set
            </div>
        )}
        {data.caption && (
            <p className="text-xs text-text-secondary italic mt-2 whitespace-pre-wrap break-words">{data.caption}</p>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-16 !bg-primary" />
    </div>
  );
};

export default memo(ImageNode);