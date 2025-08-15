import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { useFlowStore } from '../../../../store/flowStore';

// A simpler play icon component to match the design, defined locally.
const PlayTriangleIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M8 5v14l11-7z" />
    </svg>
);

const StartNode: React.FC<NodeProps> = ({ data, id }) => {
  const activeNodeId = useFlowStore(state => state.activeNodeId);
  const isActive = activeNodeId === id;

  return (
    // This single root container will correctly receive selection/active shadows.
    // Padding is used to create space for the absolutely positioned accents,
    // ensuring the shadow wraps around the entire visual element.
    <div className={`relative w-56 pt-2 pb-5 transition-transform duration-200 ease-in-out hover:scale-105 group ${isActive ? 'node-active-highlight' : ''}`}>
        
        {/* Top green accent bar. Positioned at the top of the container, within the padding. */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-1.5 bg-brand-emerald rounded-full shadow-lg shadow-brand-emerald/25" />

        {/* Node main body */}
        <div className="px-6 py-5 shadow-2xl shadow-black/40 rounded-3xl bg-slate-800/80 backdrop-blur-lg border border-slate-700 flex items-center gap-4 justify-center">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-brand-emerald flex-shrink-0 shadow-lg shadow-brand-emerald/40">
                <PlayTriangleIcon className="h-6 w-6 text-white" style={{ transform: 'translateX(2px)' }}/>
            </div>
            <div className="text-xl font-bold text-text-primary">
                {data.label}
            </div>
        </div>

        {/* Bottom handle indicator. */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-300 rounded-b-xl shadow-md" />

        {/* Actual React Flow Handle (invisible). Stretches over the bottom indicator. */}
        <Handle
            type="source"
            position={Position.Bottom}
            className="!w-24 !h-5 !bg-transparent !border-0 !-translate-x-1/2"
            style={{ left: '50%', bottom: 0 }}
        />
    </div>
  );
};

export default memo(StartNode);