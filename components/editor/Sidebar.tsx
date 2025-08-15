import React, { useState } from 'react';
import { blockConfigs } from './blockRegistry';
import { MessageIcon } from '../icons/MessageIcon'; // Example, adjust as needed
import { VariableIcon } from '../icons/VariableIcon';
import VariablesPanel from './VariablesPanel';

const NodeItem = ({ type, label, onDragStart, color, icon }: { type: string, label: string, onDragStart: (event: React.DragEvent) => void, color: string, icon: React.ReactNode }) => (
    <div
      className="p-4 border border-input rounded-lg cursor-grab bg-input mb-4 flex items-center space-x-3 hover:border-brand-green transition-all duration-200 ease-in-out hover:scale-105 active:shadow-lg active:shadow-brand-green/20"
      onDragStart={onDragStart}
      draggable
    >
        <div className={`w-8 h-8 rounded-md flex items-center justify-center ${color}`}>
            {icon}
        </div>
        <span className="font-medium text-text-primary">{label}</span>
    </div>
);

const BlocksPanel: React.FC = () => {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const botActionTypes = ['messageNode', 'inlineKeyboardNode', 'imageNode', 'delayNode'];
    const userInputLogicTypes = ['inputNode', 'buttonInputNode', 'conditionNode'];

    const botActionBlocks = blockConfigs.filter(c => botActionTypes.includes(c.type));
    const userInputLogicBlocks = blockConfigs.filter(c => userInputLogicTypes.includes(c.type));

    return (
        <div>
            <h3 className="text-xl font-bold mb-2 text-text-primary">Blocks</h3>
            <p className="text-xs text-text-secondary mb-6">Drag blocks onto the canvas to build your bot.</p>
            
            <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">Bot Actions</h4>
            {botActionBlocks.map(config => (
                <NodeItem 
                    key={config.type}
                    type={config.type}
                    label={config.name}
                    onDragStart={(event) => onDragStart(event, config.type)}
                    color={config.color}
                    icon={<config.icon className="h-5 w-5 text-white" />}
                />
            ))}

            <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3 mt-6">User Input &amp; Logic</h4>
             {userInputLogicBlocks.map(config => (
                <NodeItem 
                    key={config.type}
                    type={config.type}
                    label={config.name}
                    onDragStart={(event) => onDragStart(event, config.type)}
                    color={config.color}
                    icon={<config.icon className="h-5 w-5 text-white" />}
                />
            ))}
        </div>
    )
}


const Sidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blocks' | 'variables'>('blocks');

  return (
    <aside className="w-80 bg-surface border-r border-input flex flex-col flex-shrink-0 z-10">
      <div className="p-2 flex-shrink-0">
          <div className="bg-input p-1 rounded-lg flex gap-1">
              <button onClick={() => setActiveTab('blocks')} className={`w-1/2 py-2 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'blocks' ? 'bg-surface text-text-primary' : 'text-text-secondary hover:bg-surface/50'}`}>
                  Blocks
              </button>
              <button onClick={() => setActiveTab('variables')} className={`w-1/2 py-2 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'variables' ? 'bg-surface text-text-primary' : 'text-text-secondary hover:bg-surface/50'}`}>
                  <VariableIcon className="w-5 h-5" /> Variables
              </button>
          </div>
      </div>
      
      <div className="p-4 flex-grow overflow-y-auto">
        {activeTab === 'blocks' && <BlocksPanel />}
        {activeTab === 'variables' && <VariablesPanel />}
      </div>
    </aside>
  );
};

export default Sidebar;