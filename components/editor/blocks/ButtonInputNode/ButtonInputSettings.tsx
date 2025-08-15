import React, { useEffect, useState, useMemo } from 'react';
import { useFlowStore } from '../../../../store/flowStore';
import SettingRow from '../../SettingRow';

const ButtonInputSettings: React.FC<{ nodeId: string }> = ({ nodeId }) => {
    const { nodes, updateNodeData } = useFlowStore();
    const node = useMemo(() => nodes.find(n => n.id === nodeId), [nodes, nodeId]);

    const [question, setQuestion] = useState(node?.data.question || '');
    const [variableName, setVariableName] = useState(node?.data.variableName || '');
    const [buttons, setButtons] = useState(node?.data.buttons || []);

    useEffect(() => {
        if (node) {
            setQuestion(node.data.question || '');
            setVariableName(node.data.variableName || '');
            setButtons(node.data.buttons || []);
        }
    }, [node]);

    const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        setQuestion(newText);
        updateNodeData(nodeId, { question: newText });
    };

    const handleVariableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVariable = e.target.value;
        setVariableName(newVariable);
        updateNodeData(nodeId, { variableName: newVariable });
    };

    const handleAddButton = () => {
        const newButtons = [...buttons, { id: `btn_${+new Date()}`, text: 'Новый вариант' }];
        setButtons(newButtons);
        updateNodeData(nodeId, { buttons: newButtons });
    };

    const handleButtonTextChange = (id: string, newText: string) => {
        const newButtons = buttons.map(b => b.id === id ? { ...b, text: newText } : b);
        setButtons(newButtons);
        updateNodeData(nodeId, { buttons: newButtons });
    };

    const handleRemoveButton = (id: string) => {
        const newButtons = buttons.filter(b => b.id !== id);
        setButtons(newButtons);
        updateNodeData(nodeId, { buttons: newButtons });
    };
    
    if (!node) return null;

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
             <SettingRow label="Сохранить ответ в переменную" helpText="Текст выбранной кнопки будет сохранен здесь.">
                 <input
                    type="text"
                    value={variableName}
                    onChange={handleVariableChange}
                    placeholder="напр. userChoice"
                    className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
            </SettingRow>
             <hr className="border-input" />
            <SettingRow label="Кнопки для ответа" helpText="Пользователь должен выбрать один из этих вариантов для продолжения.">
                <div className="space-y-3">
                    {buttons.map((button) => (
                        <div key={button.id} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={button.text}
                                onChange={(e) => handleButtonTextChange(button.id, e.target.value)}
                                className="w-full px-3 py-2 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                            />
                            <button onClick={() => handleRemoveButton(button.id)} className="p-2 text-text-secondary hover:text-brand-red rounded-full hover:bg-surface transition-colors flex-shrink-0" aria-label="Удалить кнопку">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                    ))}
                    <button onClick={handleAddButton} className="w-full text-sm font-medium text-brand-green p-2 rounded-lg hover:bg-input transition-colors">
                        + Добавить вариант
                    </button>
                </div>
            </SettingRow>
        </div>
    );
};

export default ButtonInputSettings;