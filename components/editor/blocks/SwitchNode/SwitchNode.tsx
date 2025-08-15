import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { useFlowStore } from '../../../../store/flowStore';
import { SwitchIcon } from '../../../icons/SwitchIcon';

const SwitchNode: React.FC<NodeProps> = ({ data, id }) => {
  const activeNodeId = useFlowStore(state => state.activeNodeId);
  const isActive = activeNodeId === id;
  const cases = data.cases || [];

  return (
    <div className={`w-72 rounded-2xl shadow-lg bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 border-t-4 border-brand-violet p-4 ${isActive ? 'node-active-highlight' : ''}`}>
      <Handle type="target" position={Position.Top} className="w-16 !bg-accent" />
      
      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-700">
         <div className="w-8 h-8 rounded-md flex items-center justify-center bg-brand-violet/20">
            <SwitchIcon className="h-5 w-5 text-brand-violet" />
        </div>
        <div className="text-md font-bold text-text-primary">
          Переключатель
        </div>
      </div>
      
      <div className="text-sm text-text-secondary space-y-2 p-1">
        <span>Если переменная</span>
        <div className="font-mono bg-input p-2 rounded text-brand-violet w-full truncate">{`{${data.variable || 'переменная'}}`}</div>
        <span>равна одному из значений:</span>
      </div>

      <div className="relative pt-4 px-2 pb-2 mt-2 border-t border-slate-700/50">
        {cases.map((caseItem, index) => {
            const handlePosition = (100 / (cases.length + 2)) * (index + 1);
            return (
                <div key={caseItem.id}>
                    <div className="absolute top-0 transform -translate-x-1/2" style={{ left: `${handlePosition}%` }}>
                        <p className="text-xs text-center text-text-secondary bg-surface px-1.5 py-0.5 rounded-md truncate max-w-[80px]" title={caseItem.value}>{caseItem.value || `Кейс ${index + 1}`}</p>
                    </div>
                    <Handle
                        type="source"
                        position={Position.Bottom}
                        id={caseItem.id}
                        style={{ left: `${handlePosition}%` }}
                        className="!bg-brand-violet"
                    />
                </div>
            );
        })}
        
        {/* Default Handle */}
        <div className="absolute top-0 transform -translate-x-1/2" style={{ left: `${(100 / (cases.length + 2)) * (cases.length + 1)}%` }}>
            <p className="text-xs text-center text-text-secondary bg-surface px-1.5 py-0.5 rounded-md" title="Default">Иначе</p>
        </div>
        <Handle
            type="source"
            position={Position.Bottom}
            id="default"
            style={{ left: `${(100 / (cases.length + 2)) * (cases.length + 1)}%` }}
            className="!bg-slate-500"
        />

      </div>
    </div>
  );
};

export default memo(SwitchNode);