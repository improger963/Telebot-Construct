import React, { useState } from 'react';
import { blockConfigs } from './blockRegistry';
import { MessageIcon } from '../icons/MessageIcon'; // Example, adjust as needed
import { VariableIcon } from '../icons/VariableIcon';
import VariablesPanel from './VariablesPanel';

const NodeItem = ({ type, label, onDragStart, color, icon }: { type: string, label: string, onDragStart: (event: React.DragEvent) => void, color: string, icon: React.ReactNode }) => (
    <div
      className="p-3 border border-slate-700/50 rounded-xl cursor-grab bg-slate-800/50 mb-3 flex items-center space-x-4 hover:border-brand-emerald/50 hover:bg-slate-700/50 transition-all duration-200 ease-in-out hover:scale-105 active:shadow-lg active:shadow-brand-emerald/10"
      onDragStart={onDragStart}
      draggable
    >
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
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

    const botActionTypes = ['messageNode', 'inlineKeyboardNode', 'delayNode', 'randomMessageNode'];
    const userInputLogicTypes = ['inputNode', 'buttonInputNode', 'conditionNode', 'switchNode'];
    const mediaTypes = ['imageNode', 'videoNode', 'audioNode', 'documentNode', 'stickerNode'];
    const integrationTypes = ['httpRequestNode', 'databaseNode'];

    const getBlocks = (types: string[]) => blockConfigs.filter(c => types.includes(c.type));

    return (
        <div>
            <h3 className="text-xl font-bold mb-2 text-text-primary">Блоки</h3>
            <p className="text-xs text-text-secondary mb-6">Перетаскивайте блоки на холст, чтобы построить своего бота.</p>
            
            <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">Действия бота</h4>
            {getBlocks(botActionTypes).map(config => (
                <NodeItem 
                    key={config.type}
                    type={config.type}
                    label={config.name}
                    onDragStart={(event) => onDragStart(event, config.type)}
                    color={config.color}
                    icon={<config.icon className="h-5 w-5 text-white" />}
                />
            ))}

            <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3 mt-6">Ввод и логика</h4>
             {getBlocks(userInputLogicTypes).map(config => (
                <NodeItem 
                    key={config.type}
                    type={config.type}
                    label={config.name}
                    onDragStart={(event) => onDragStart(event, config.type)}
                    color={config.color}
                    icon={<config.icon className="h-5 w-5 text-white" />}
                />
            ))}
            
            <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3 mt-6">Медиа</h4>
             {getBlocks(mediaTypes).map(config => (
                <NodeItem 
                    key={config.type}
                    type={config.type}
                    label={config.name}
                    onDragStart={(event) => onDragStart(event, config.type)}
                    color={config.color}
                    icon={<config.icon className="h-5 w-5 text-white" />}
                />
            ))}
            
            <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3 mt-6">Интеграции</h4>
             {getBlocks(integrationTypes).map(config => (
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
    <aside className="w-80 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800/50 flex flex-col flex-shrink-0 z-10">
      <div className="p-2 flex-shrink-0">
          <div className="bg-input p-1 rounded-lg flex gap-1">
              <button onClick={() => setActiveTab('blocks')} className={`w-1/2 py-2 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'blocks' ? 'bg-surface text-text-primary' : 'text-text-secondary hover:bg-surface/50'}`}>
                  Блоки
              </button>
              <button onClick={() => setActiveTab('variables')} className={`w-1/2 py-2 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'variables' ? 'bg-surface text-text-primary' : 'text-text-secondary hover:bg-surface/50'}`}>
                  <VariableIcon className="w-5 h-5" /> Переменные
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
