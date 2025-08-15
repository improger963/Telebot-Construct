import React, { useEffect, useState, useMemo } from 'react';
import { useFlowStore } from '../../../../store/flowStore';
import SettingRow from '../../SettingRow';
import { Node } from 'reactflow';

const ConditionSettings: React.FC<{ nodeId: string }> = ({ nodeId }) => {
    const { nodes, updateNodeData } = useFlowStore();
    
    const node = useMemo(() => nodes.find(n => n.id === nodeId), [nodes, nodeId]);

    const [variable, setVariable] = useState(node?.data.variable || '');
    const [value, setValue] = useState(node?.data.value || '');

    useEffect(() => {
        if (node) {
            setVariable(node.data.variable || '');
            setValue(node.data.value || '');
        }
    }, [node]);
    
    if (!node) return null;

    const handleVariableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVariable = e.target.value;
        setVariable(newVariable);
        updateNodeData(nodeId, { variable: newVariable });
    };
    
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        updateNodeData(nodeId, { value: newValue });
    };

    return (
        <div className="space-y-6">
          <SettingRow label="Проверяемая переменная" helpText="Используйте `userInput` для последнего сообщения или имя переменной.">
               <input
                  type="text"
                  value={variable}
                  onChange={handleVariableChange}
                  placeholder="напр. userInput"
                  className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
          </SettingRow>
          <SettingRow label="Значение для проверки" helpText="Условие будет истинным, если переменная содержит этот текст.">
               <input
                  type="text"
                  value={value}
                  onChange={handleValueChange}
                  placeholder="напр. 'да' или 'помощь'"
                  className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
          </SettingRow>
        </div>
    );
};

export default ConditionSettings;