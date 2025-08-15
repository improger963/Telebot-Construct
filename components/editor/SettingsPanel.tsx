import React from 'react';
import { useFlowStore } from '../../store/flowStore';
import { blockRegistry } from './blockRegistry';
import { InfoIcon } from '../icons/InfoIcon';

const SettingsPanel: React.FC = () => {
  const selectedNode = useFlowStore((state) => state.selectedNode);

  if (!selectedNode) {
    return (
        <aside className="w-96 bg-slate-900/50 backdrop-blur-xl p-6 border-l border-slate-800/50 flex-shrink-0 flex items-center justify-center z-10">
            <div className="text-center space-y-4">
              <InfoIcon className="w-12 h-12 mx-auto text-text-secondary opacity-50" />
              <h4 className="font-bold text-text-primary">Node Settings</h4>
              <p className="text-text-secondary text-sm">Select a node on the canvas to view and edit its properties here.</p>
            </div>
        </aside>
    );
  }

  const config = blockRegistry[selectedNode.type as string];
  
  // This case handles nodes that might exist in the flow but have no config (e.g., legacy nodes)
  if (!config) {
    return (
      <aside className="w-96 bg-slate-900/50 backdrop-blur-xl p-6 border-l border-slate-800/50 flex-shrink-0 animate-slideInFromRight z-10">
        <h3 className="text-xl font-bold mb-6 text-text-primary">Settings</h3>
        <p className="text-text-secondary">Error: Unknown node type "{selectedNode.type}".</p>
      </aside>
    );
  }
  
  const SettingsComponent = config.settingsComponent;

  return (
    <aside className="w-96 bg-slate-900/50 backdrop-blur-xl p-6 border-l border-slate-800/50 flex-shrink-0 animate-slideInFromRight z-10 overflow-y-auto">
      <h3 className="text-xl font-bold mb-6 text-text-primary">Settings</h3>
      <div className="space-y-6">
        <div>
            <p className="text-sm font-bold text-text-secondary uppercase tracking-wider">Node Type</p>
            <p className="text-md font-semibold text-brand-emerald">{config.name}</p>
        </div>
        <hr className="border-accent" />
        <SettingsComponent nodeId={selectedNode.id} />
      </div>
    </aside>
  );
};

export default SettingsPanel;