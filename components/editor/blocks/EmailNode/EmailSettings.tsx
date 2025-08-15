import React, { useEffect, useState, useMemo } from 'react';
import { useFlowStore } from '../../../../store/flowStore';
import SettingRow from '../../SettingRow';

const EmailSettings: React.FC<{ nodeId: string }> = ({ nodeId }) => {
    const { nodes, updateNodeData } = useFlowStore();
    const node = useMemo(() => nodes.find(n => n.id === nodeId), [nodes, nodeId]);

    const [to, setTo] = useState(node?.data.to || '');
    const [subject, setSubject] = useState(node?.data.subject || '');
    const [body, setBody] = useState(node?.data.body || '');

    useEffect(() => {
        if (node) {
            setTo(node.data.to || '');
            setSubject(node.data.subject || '');
            setBody(node.data.body || '');
        }
    }, [node]);

    if (!node) return null;

    const handleUpdate = (field: string, value: string) => {
        updateNodeData(nodeId, { [field]: value });
    };

    return (
        <div className="space-y-6">
            <SettingRow label="Получатель (To)">
                <input
                    type="email"
                    value={to}
                    onChange={e => { setTo(e.target.value); handleUpdate('to', e.target.value); }}
                    placeholder="admin@example.com"
                    className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
            </SettingRow>
            <SettingRow label="Тема письма (Subject)">
                <input
                    type="text"
                    value={subject}
                    onChange={e => { setSubject(e.target.value); handleUpdate('subject', e.target.value); }}
                    placeholder="Новая заявка"
                    className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
            </SettingRow>
             <SettingRow label="Тело письма (Body)" helpText="Вы можете использовать переменные, например {name}.">
                <textarea
                    value={body}
                    onChange={e => { setBody(e.target.value); handleUpdate('body', e.target.value); }}
                    rows={6}
                    className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
            </SettingRow>
        </div>
    );
};

export default EmailSettings;
