import React, { useMemo } from 'react';
import { useFlowStore } from '../../store/flowStore';
import { VariableIcon } from '../icons/VariableIcon';

interface VariableInfo {
  name: string;
  definedIn: string | null;
  usedIn: string[];
  status: 'DEFINED' | 'UNUSED' | 'UNDEFINED';
}

const getStatus = (definedIn: string | null, usedIn: string[]): VariableInfo['status'] => {
    if (definedIn && usedIn.length > 0) return 'DEFINED';
    if (definedIn && usedIn.length === 0) return 'UNUSED';
    if (!definedIn && usedIn.length > 0) return 'UNDEFINED';
    return 'DEFINED'; // Should not happen
}

const statusInfo = {
    DEFINED: { text: "Определена", color: "bg-brand-green/20 text-brand-green", tooltip: "Эта переменная определена и используется в схеме." },
    UNUSED: { text: "Не используется", color: "bg-brand-amber/20 text-brand-amber", tooltip: "Эта переменная определена, но нигде не используется." },
    UNDEFINED: { text: "Не определена", color: "bg-brand-red/20 text-brand-red", tooltip: "Эта переменная используется, но нигде не определяется в блоках ввода." },
}

const VariablesPanel: React.FC = () => {
  const { nodes, reactFlowInstance } = useFlowStore();

  const variables = useMemo<VariableInfo[]>(() => {
    const definedIn: Record<string, string> = {};
    const usedIn: Record<string, string[]> = {};
    const allVarNames = new Set<string>();

    const extractVarsFromText = (text: string, nodeId: string) => {
        const matches = text?.match(/\{(\w+)\}/g);
        if (matches) {
            matches.forEach(match => {
                const varName = match.slice(1, -1);
                if (!usedIn[varName]) usedIn[varName] = [];
                usedIn[varName].push(nodeId);
                allVarNames.add(varName);
            });
        }
    }

    nodes.forEach(node => {
      // Find where variables are defined
      if ((node.type === 'inputNode' || node.type === 'buttonInputNode') && node.data.variableName) {
        const varName = node.data.variableName.trim();
        if (varName) {
            definedIn[varName] = node.id;
            allVarNames.add(varName);
        }
      }

      // Find where variables are used
      if (node.type === 'messageNode' && node.data.text) {
        extractVarsFromText(node.data.text, node.id);
      }
      if (node.type === 'randomMessageNode' && node.data.messages) {
        node.data.messages.forEach((msg: {text: string}) => extractVarsFromText(msg.text, node.id));
      }
      if ((node.type === 'conditionNode' || node.type === 'switchNode') && node.data.variable) {
        const varName = node.data.variable.trim();
        if(varName) {
            if (!usedIn[varName]) usedIn[varName] = [];
            usedIn[varName].push(node.id);
            allVarNames.add(varName);
        }
      }
    });

    return Array.from(allVarNames).map(name => {
      const def = definedIn[name] || null;
      const uses = [...new Set(usedIn[name])] || [];
      return {
        name,
        definedIn: def,
        usedIn: uses,
        status: getStatus(def, uses)
      }
    }).sort((a,b) => a.name.localeCompare(b.name));
  }, [nodes]);

  const handleNodeClick = (nodeId: string) => {
    if (!reactFlowInstance) return;
    const node = reactFlowInstance.getNode(nodeId);
    if (node) {
        reactFlowInstance.fitView({ nodes: [node], duration: 300, padding: 0.2 });
        // Select the node to open its settings
        reactFlowInstance.setNodes(n => n.map(item => ({...item, selected: item.id === nodeId})));
    }
  };

  if (variables.length === 0) {
    return (
        <div className="text-center space-y-4 pt-10">
            <VariableIcon className="w-12 h-12 mx-auto text-text-secondary opacity-50" />
            <h4 className="font-bold text-text-primary">Переменные не найдены</h4>
            <p className="text-text-secondary text-sm">Создавайте переменные с помощью блоков "Ввод", чтобы хранить и повторно использовать данные пользователя в вашей схеме.</p>
        </div>
    );
  }

  return (
    <div>
        <h3 className="text-xl font-bold mb-2 text-text-primary">Переменные схемы</h3>
        <p className="text-xs text-text-secondary mb-6">Здесь находятся все переменные, обнаруженные в вашей схеме.</p>

        <div className="space-y-4">
            {variables.map(v => {
                const status = statusInfo[v.status];
                return (
                    <div key={v.name} className="bg-input p-4 rounded-xl border border-accent">
                        <div className="flex justify-between items-start mb-3">
                            <p className="font-mono bg-background px-3 py-1.5 rounded text-brand-violet text-lg">{`{${v.name}}`}</p>
                            <span title={status.tooltip} className={`text-xs font-semibold px-2 py-1 rounded-full ${status.color}`}>{status.text}</span>
                        </div>

                        <div className="text-sm space-y-3">
                           <div className="text-text-secondary">
                                <span className="font-semibold text-text-primary">Определена в:</span>
                                {v.definedIn ? (
                                    <button onClick={() => handleNodeClick(v.definedIn)} className="ml-2 hover:underline text-brand-teal">Блок: ...{v.definedIn.slice(-4)}</button>
                                ): <span className="ml-2 text-text-secondary/70 italic">Нигде</span>}
                           </div>
                           <div className="text-text-secondary">
                                <span className="font-semibold text-text-primary">Используется в:</span>
                                {v.usedIn.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 mt-1">
                                    {v.usedIn.map(nodeId => (
                                        <button key={nodeId} onClick={() => handleNodeClick(nodeId)} className="bg-background px-2 py-1 text-xs rounded hover:bg-surface text-text-primary">...{nodeId.slice(-4)}</button>
                                    ))}
                                    </div>
                                ): <span className="ml-2 text-text-secondary/70 italic">Нигде</span>}
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