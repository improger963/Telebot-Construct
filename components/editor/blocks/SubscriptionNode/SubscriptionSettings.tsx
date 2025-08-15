import React, { useEffect, useState, useMemo } from 'react';
import { useFlowStore } from '../../../../store/flowStore';
import SettingRow from '../../SettingRow';

const SubscriptionSettings: React.FC<{ nodeId: string }> = ({ nodeId }) => {
    const { nodes, updateNodeData } = useFlowStore();
    const node = useMemo(() => nodes.find(n => n.id === nodeId), [nodes, nodeId]);

    const [planName, setPlanName] = useState(node?.data.planName || '');
    const [price, setPrice] = useState(node?.data.price || '');
    const [period, setPeriod] = useState(node?.data.period || 'месяц');

    useEffect(() => {
        if (node) {
            setPlanName(node.data.planName || '');
            setPrice(node.data.price || '');
            setPeriod(node.data.period || 'месяц');
        }
    }, [node]);

    if (!node) return null;

    const handleUpdate = (field: string, value: string) => {
        updateNodeData(nodeId, { [field]: value });
    };

    return (
        <div className="space-y-6">
            <SettingRow label="Название плана">
                <input
                    type="text"
                    value={planName}
                    onChange={e => { setPlanName(e.target.value); handleUpdate('planName', e.target.value); }}
                    placeholder="Напр., Pro"
                    className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
            </SettingRow>
            <SettingRow label="Цена">
                <input
                    type="text"
                    value={price}
                    onChange={e => { setPrice(e.target.value); handleUpdate('price', e.target.value); }}
                    placeholder="Напр., 999"
                    className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
            </SettingRow>
             <SettingRow label="Период">
                <input
                    type="text"
                    value={period}
                    onChange={e => { setPeriod(e.target.value); handleUpdate('period', e.target.value); }}
                    placeholder="Напр., месяц"
                    className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
            </SettingRow>
        </div>
    );
};

export default SubscriptionSettings;
