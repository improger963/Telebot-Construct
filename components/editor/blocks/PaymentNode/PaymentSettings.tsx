import React, { useEffect, useState, useMemo } from 'react';
import { useFlowStore } from '../../../../store/flowStore';
import SettingRow from '../../SettingRow';

const PaymentSettings: React.FC<{ nodeId: string }> = ({ nodeId }) => {
    const { nodes, updateNodeData } = useFlowStore();
    const node = useMemo(() => nodes.find(n => n.id === nodeId), [nodes, nodeId]);

    const [itemName, setItemName] = useState(node?.data.itemName || '');
    const [amount, setAmount] = useState(node?.data.amount || '');
    const [currency, setCurrency] = useState(node?.data.currency || 'RUB');
    const [provider, setProvider] = useState(node?.data.provider || 'telegram_payments');

    useEffect(() => {
        if (node) {
            setItemName(node.data.itemName || '');
            setAmount(node.data.amount || '');
            setCurrency(node.data.currency || 'RUB');
            setProvider(node.data.provider || 'telegram_payments');
        }
    }, [node]);

    if (!node) return null;

    const handleUpdate = (field: string, value: string) => {
        updateNodeData(nodeId, { [field]: value });
    };

    return (
        <div className="space-y-6">
            <SettingRow label="Провайдер платежей" helpText="Выберите сервис для обработки платежа.">
                <select
                    value={provider}
                    onChange={e => { setProvider(e.target.value); handleUpdate('provider', e.target.value); }}
                    className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                >
                    <option value="telegram_payments">Telegram Payments</option>
                    <option value="stripe_test">Stripe (Test Mode)</option>
                </select>
            </SettingRow>
            <SettingRow label="Название товара/услуги">
                <input
                    type="text"
                    value={itemName}
                    onChange={e => { setItemName(e.target.value); handleUpdate('itemName', e.target.value); }}
                    placeholder="Напр., Подписка Pro"
                    className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
            </SettingRow>
            <SettingRow label="Сумма">
                <input
                    type="text"
                    value={amount}
                    onChange={e => { setAmount(e.target.value); handleUpdate('amount', e.target.value); }}
                    placeholder="Напр., 100 или {total_price}"
                    className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
            </SettingRow>
             <SettingRow label="Валюта">
                <input
                    type="text"
                    value={currency}
                    onChange={e => { setCurrency(e.target.value); handleUpdate('currency', e.target.value); }}
                    placeholder="Напр., RUB"
                    className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
            </SettingRow>
        </div>
    );
};

export default PaymentSettings;