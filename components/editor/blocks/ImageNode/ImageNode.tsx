import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { useFlowStore } from '../../../../store/flowStore';
import { ImageIcon } from '../../../icons/ImageIcon';

const ImageNode: React.FC<NodeProps> = ({ data, id }) => {
  const activeNodeId = useFlowStore(state => state.activeNodeId);
  const isActive = activeNodeId === id;

  return (
    <div className={`px-5 py-4 shadow-lg rounded-xl bg-surface border-t-4 border-pink-500 w-72 ${isActive ? 'node-active-highlight' : ''}`}>
      <Handle type="target" position={Position.Top} className="w-16 !bg-accent" />
      
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-md flex items-center justify-center bg-pink-500/20">
          <ImageIcon className="h-5 w-5 text-pink-500" />
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