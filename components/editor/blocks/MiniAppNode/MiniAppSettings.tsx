import React, { useEffect, useState, useMemo } from 'react';
import { useFlowStore } from '../../../../store/flowStore';
import SettingRow from '../../SettingRow';

const MiniAppSettings: React.FC<{ nodeId: string }> = ({ nodeId }) => {
    const { nodes, updateNodeData } = useFlowStore();
    const node = useMemo(() => nodes.find(n => n.id === nodeId), [nodes, nodeId]);

    const [url, setUrl] = useState(node?.data.url || '');
    const [title, setTitle] = useState(node?.data.title || '');
    const [buttonText, setButtonText] = useState(node?.data.buttonText || '');

    useEffect(() => {
        if (node) {
            setUrl(node.data.url || '');
            setTitle(node.data.title || '');
            setButtonText(node.data.buttonText || '');
        }
    }, [node]);

    if (!node) return null;

    const handleUpdate = (field: string, value: string) => {
        updateNodeData(nodeId, { [field]: value });
    };

    return (
        <div className="space-y-6">
            <SettingRow label="URL вашего Mini App" helpText="Полный HTTPS URL вашего веб-приложения.">
                <input
                    type="text"
                    value={url}
                    onChange={e => { setUrl(e.target.value); handleUpdate('url', e.target.value); }}
                    placeholder="https://yourapp.com"
                    className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
            </SettingRow>
            <SettingRow label="Заголовок окна приложения">
                <input
                    type="text"
                    value={title}
                    onChange={e => { setTitle(e.target.value); handleUpdate('title', e.target.value); }}
                    placeholder="Наше приложение"
                    className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
            </SettingRow>
            <SettingRow label="Текст на кнопке запуска">
                <input
                    type="text"
                    value={buttonText}
                    onChange={e => { setButtonText(e.target.value); handleUpdate('buttonText', e.target.value); }}
                    placeholder="Открыть"
                    className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
            </SettingRow>
        </div>
    );
};

export default MiniAppSettings;
