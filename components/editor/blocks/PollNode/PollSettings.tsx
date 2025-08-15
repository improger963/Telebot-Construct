import React, { useEffect, useState, useMemo } from 'react';
import { useFlowStore } from '../../../../store/flowStore';
import SettingRow from '../../SettingRow';

const PollSettings: React.FC<{ nodeId: string }> = ({ nodeId }) => {
    const { nodes, updateNodeData } = useFlowStore();
    const node = useMemo(() => nodes.find(n => n.id === nodeId), [nodes, nodeId]);
    
    const [question, setQuestion] = useState(node?.data.question || '');
    const [options, setOptions] = useState(node?.data.options || []);

    useEffect(() => {
        if (node) {
            setQuestion(node.data.question || '');
            setOptions(node.data.options || []);
        }
    }, [node]);

    if (!node) return null;

    const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        setQuestion(newText);
        updateNodeData(nodeId, { question: newText });
    };

    const handleAddOption = () => {
        if (options.length >= 10) return;
        const newOptions = [...options, { id: `opt_${+new Date()}`, text: 'Новый вариант' }];
        setOptions(newOptions);
        updateNodeData(nodeId, { options: newOptions });
    };

    const handleOptionTextChange = (id: string, newText: string) => {
        const newOptions = options.map(o => o.id === id ? { ...o, text: newText } : o);
        setOptions(newOptions);
        updateNodeData(nodeId, { options: newOptions });
    };

    const handleRemoveOption = (id: string) => {
        if (options.length <= 2) return;
        const newOptions = options.filter(o => o.id !== id);
        setOptions(newOptions);
        updateNodeData(nodeId, { options: newOptions });
    };
    
    return (
        <div className="space-y-6">
            <SettingRow label="Вопрос опроса">
                <textarea
                  value={question}
                  onChange={handleQuestionChange}
                  rows={3}
                  className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
            </SettingRow>
            <SettingRow label="Варианты ответа" helpText="Минимум 2, максимум 10 вариантов.">
                <div className="space-y-3">
                    {options.map((option) => (
                        <div key={option.id} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={option.text}
                                onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
                                className="w-full px-3 py-2 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                            />
                            <button 
                                onClick={() => handleRemoveOption(option.id)} 
                                className="p-2 text-text-secondary hover:text-brand-red rounded-full hover:bg-surface transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed" 
                                aria-label="Удалить вариант"
                                disabled={options.length <= 2}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                    ))}
                    <button 
                        onClick={handleAddOption} 
                        className="w-full text-sm font-medium text-brand-green p-2 rounded-lg hover:bg-input transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={options.length >= 10}
                    >
                        + Добавить вариант
                    </button>
                </div>
            </SettingRow>
        </div>
    );
};

export default PollSettings;
