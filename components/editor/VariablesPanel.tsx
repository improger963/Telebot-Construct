import React, { useMemo } from 'react';
import { useFlowStore } from '../../store/flowStore';
import { Node } from 'reactflow';
import { InfoIcon } from '../icons/InfoIcon';
import { VariableIcon } from '../icons/VariableIcon';

interface VariableInfo {
  name: string;
  definedIn: string | null;
  usedIn: string[];
}

const VariablesPanel: React.FC = () => {
  const { nodes, reactFlowInstance } = useFlowStore();

  const variables = useMemo<VariableInfo[]>(() => {
    const definedIn: Record<string, string> = {};
    const usedIn: Record<string, string[]> = {};
    const allVarNames = new Set<string>();

    nodes.forEach(node => {
      // Find where variables are defined
      if (node.type === 'inputNode' && node.data.variableName) {
        const varName = node.data.variableName.trim();
        if (varName) {
            definedIn[varName] = node.id;
            allVarNames.add(varName);
        }
      }

      // Find where variables are used
      if (node.type === 'messageNode' && node.data.text) {
        const matches = node.data.text.match(/\{(\w+)\}/g);
        if (matches) {
          matches.forEach(match => {
            const varName = match.slice(1, -1);
            if (!usedIn[varName]) usedIn[varName] = [];
            usedIn[varName].push(node.id);
            allVarNames.add(varName);
          });
        }
      }
      if (node.type === 'conditionNode' && node.data.variable) {
        const varName = node.data.variable.trim();
        if(varName) {
            if (!usedIn[varName]) usedIn[varName] = [];
            usedIn[varName].push(node.id);
            allVarNames.add(varName);
        }
      }
    });

    return Array.from(allVarNames).map(name => ({
      name,
      definedIn: definedIn[name] || null,
      usedIn: [...new Set(usedIn[name])] || [], // Ensure unique node IDs
    }));
  }, [nodes]);

  const handleNodeClick = (nodeId: string) => {
    if (!reactFlowInstance) return;
    const node = reactFlowInstance.getNode(nodeId);
    if (node) {
        reactFlowInstance.fitView({ nodes: [node], duration: 300, padding: 0.2 });
    }
  };

  if (variables.length === 0) {
    return (
        <div className="text-center space-y-4 pt-10">
            <VariableIcon className="w-12 h-12 mx-auto text-text-secondary opacity-50" />
            <h4 className="font-bold text-text-primary">No Variables Found</h4>
            <p className="text-text-secondary text-sm">Create variables using the "User Input" block to store and reuse user data in your flow.</p>
        </div>
    );
  }

  return (
    <div>
        <h3 className="text-xl font-bold mb-2 text-text-primary">Variables</h3>
        <p className="text-xs text-text-secondary mb-6">Here are all the variables detected in your flow.</p>

        <div className="space-y-4">
            {variables.map(v => {
                const isUndefined = !v.definedIn && v.usedIn.length > 0;
                const isUnused = !!v.definedIn && v.usedIn.length === 0;
                
                return (
                    <div key={v.name} className="bg-input p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                            <p className="font-mono bg-background px-2 py-1 rounded text-brand-purple text-lg">{`{${v.name}}`}</p>
                            {isUndefined && <span className="text-xs font-semibold bg-brand-red text-white px-2 py-1 rounded-full" title="This variable is used but never defined in an Input node.">Undefined</span>}
                            {isUnused && <span className="text-xs font-semibold bg-brand-orange text-white px-2 py-1 rounded-full" title="This variable is defined but never used.">Unused</span>}
                        </div>

                        <div className="text-sm space-y-2">
                           <div className="text-text-secondary">
                                <span className="font-semibold">Defined in:</span>
                                {v.definedIn ? (
                                    <button onClick={() => handleNodeClick(v.definedIn)} className="ml-2 hover:underline text-text-primary">Node ID: ...{v.definedIn.slice(-4)}</button>
                                ): <span className="ml-2 text-text-secondary italic">Not defined</span>}
                           </div>
                           <div className="text-text-secondary">
                                <span className="font-semibold">Used in:</span>
                                {v.usedIn.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 mt-1">
                                    {v.usedIn.map(nodeId => (
                                        <button key={nodeId} onClick={() => handleNodeClick(nodeId)} className="bg-background px-2 py-1 text-xs rounded hover:bg-surface text-text-primary">...{nodeId.slice(-4)}</button>
                                    ))}
                                    </div>
                                ): <span className="ml-2 text-text-secondary italic">Not used</span>}
                           </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};

export default VariablesPanel;
