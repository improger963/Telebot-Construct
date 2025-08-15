import React, { useEffect, useState, useMemo } from 'react';
import { useFlowStore } from '../../../../store/flowStore';
import SettingRow from '../../SettingRow';

const DatabaseSettings: React.FC<{ nodeId: string }> = ({ nodeId }) => {
    const { nodes, updateNodeData } = useFlowStore();
    const node = useMemo(() => nodes.find(n => n.id === nodeId), [nodes, nodeId]);

    const [action, setAction] = useState(node?.data.action || 'GET');
    const [key, setKey] = useState(node?.data.key || '');
    const [value, setValue] = useState(node?.data.value || '');
    const [resultVariable, setResultVariable] = useState(node?.data.resultVariable || '');

    useEffect(() => {
        if (node) {
            setAction(node.data.action || 'GET');
            setKey(node.data.key || '');
            setValue(node.data.value || '');
            setResultVariable(node.data.resultVariable || '');
        }
    }, [node]);

    if (!node) return null;

    const handleUpdate = (field: string, fieldValue: any) => {
        updateNodeData(nodeId, { [field]: fieldValue });
    };

    return (
        <div className="space-y-6">
            <SettingRow label="Действие">
                <select 
                    value={action} 
                    onChange={e => { setAction(e.target.value); handleUpdate('action', e.target.value); }}
                    className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                >
                    <option value="GET">Получить значение</option>
                    <option value="SET">Сохранить значение</option>
                    <option value="DELETE">Удалить значение</option>
                </select>
            </SettingRow>

            <SettingRow label="Ключ" helpText="Уникальный идентификатор для ваших данных (напр., `user_{userId}_name`).">
                <input
                    type="text"
                    value={key}
                    onChange={e => { setKey(e.target.value); handleUpdate('key', e.target.value); }}
                    placeholder="напр. user_name"
                    className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
            </SettingRow>

            {action === 'SET' && (
                <SettingRow label="Значение" helpText="Данные, которые вы хотите сохранить. Можно использовать переменные.">
                    <textarea
                        value={value}
                        onChange={e => { setValue(e.target.value); handleUpdate('value', e.target.value); }}
                        rows={3}
                        className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                    />
                </SettingRow>
            )}

            {action === 'GET' && (
                <SettingRow label="Сохранить результат в переменную" helpText="Полученное значение будет сохранено в эту переменную.">
                    <input
                        type="text"
                        value={resultVariable}
                        onChange={e => { setResultVariable(e.target.value); handleUpdate('resultVariable', e.target.value); }}
                        placeholder="напр. db_result"
                        className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                    />
                </SettingRow>
            )}
        </div>
    );
};

export default DatabaseSettings;
