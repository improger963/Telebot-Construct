import React, { useEffect, useState, useMemo } from 'react';
import { useFlowStore } from '../../../../store/flowStore';
import SettingRow from '../../SettingRow';
import { Node } from 'reactflow';

const InputSettings: React.FC<{ nodeId: string }> = ({ nodeId }) => {
    const { nodes, updateNodeData } = useFlowStore();

    const node = useMemo(() => nodes.find(n => n.id === nodeId), [nodes, nodeId]);

    const [question, setQuestion] = useState(node?.data.question || '');
    const [variableName, setVariableName] = useState(node?.data.variableName || '');

    useEffect(() => {
        if (node) {
            setQuestion(node.data.question || '');
            setVariableName(node.data.variableName || '');
        }
    }, [node]);

    if (!node) return null;

    const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newQuestion = e.target.value;
        setQuestion(newQuestion);
        updateNodeData(nodeId, { question: newQuestion });
    };

    const handleVariableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVariable = e.target.value;
        setVariableName(newVariable);
        updateNodeData(nodeId, { variableName: newVariable });
    };

    return (
        <div className="space-y-6">
        <SettingRow label="Текст вопроса">
            <textarea
                value={question}
                onChange={handleQuestionChange}
                rows={4}
                className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
        </SettingRow>
        <SettingRow label="Сохранить ответ в переменную" helpText="Ответ пользователя будет сохранен в эту переменную.">
             <input
                type="text"
                value={variableName}
                onChange={handleVariableChange}
                placeholder="напр. userName"
                className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
        </SettingRow>
      </div>
    );
};

export default InputSettings;