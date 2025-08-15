import React, { useEffect, useState, useMemo } from 'react';
import { useFlowStore } from '../../../../store/flowStore';
import SettingRow from '../../SettingRow';

const SwitchSettings: React.FC<{ nodeId: string }> = ({ nodeId }) => {
    const { nodes, updateNodeData } = useFlowStore();
    const node = useMemo(() => nodes.find(n => n.id === nodeId), [nodes, nodeId]);

    const [variable, setVariable] = useState(node?.data.variable || '');
    const [cases, setCases] = useState(node?.data.cases || []);

    useEffect(() => {
        if (node) {
            setVariable(node.data.variable || '');
            setCases(node.data.cases || []);
        }
    }, [node]);

    const handleVariableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVariable = e.target.value;
        setVariable(newVariable);
        updateNodeData(nodeId, { variable: newVariable });
    };

    const handleAddCase = () => {
        const newCases = [...cases, { id: `case_${+new Date()}`, value: '' }];
        setCases(newCases);
        updateNodeData(nodeId, { cases: newCases });
    };

    const handleCaseValueChange = (id: string, newValue: string) => {
        const newCases = cases.map(c => c.id === id ? { ...c, value: newValue } : c);
        setCases(newCases);
        updateNodeData(nodeId, { cases: newCases });
    };

    const handleRemoveCase = (id: string) => {
        const newCases = cases.filter(c => c.id !== id);
        setCases(newCases);
        updateNodeData(nodeId, { cases: newCases });
    };
    
    if (!node) return null;

    return (
        <div className="space-y-6">
            <SettingRow label="Проверяемая переменная" helpText="Значение этой переменной будет сравниваться с каждым вариантом.">
                <input
                    type="text"
                    value={variable}
                    onChange={handleVariableChange}
                    placeholder="напр. userChoice"
                    className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
            </SettingRow>
            <hr className="border-input" />
            <SettingRow label="Варианты (Cases)" helpText="Каждый вариант создает новый путь вывода. Если совпадений нет, используется выход 'Иначе'.">
                <div className="space-y-3">
                    {cases.map((caseItem) => (
                        <div key={caseItem.id} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={caseItem.value}
                                onChange={(e) => handleCaseValueChange(caseItem.id, e.target.value)}
                                placeholder="Значение для сравнения"
                                className="w-full px-3 py-2 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                            />
                            <button onClick={() => handleRemoveCase(caseItem.id)} className="p-2 text-text-secondary hover:text-brand-red rounded-full hover:bg-surface transition-colors flex-shrink-0" aria-label="Удалить вариант">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                    ))}
                    <button onClick={handleAddCase} className="w-full text-sm font-medium text-brand-green p-2 rounded-lg hover:bg-input transition-colors">
                        + Добавить вариант
                    </button>
                </div>
            </SettingRow>
        </div>
    );
};

export default SwitchSettings;