import React, { useEffect, useState, useMemo, ChangeEvent } from 'react';
import { useFlowStore } from '../../../../store/flowStore';
import SettingRow from '../../SettingRow';

const AudioSettings: React.FC<{ nodeId: string }> = ({ nodeId }) => {
    const { nodes, updateNodeData } = useFlowStore();
    const node = useMemo(() => nodes.find(n => n.id === nodeId), [nodes, nodeId]);

    const [url, setUrl] = useState(node?.data.url || '');

    useEffect(() => {
        if (node) setUrl(node.data.url || '');
    }, [node]);

    if (!node) return null;

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUrl = e.target.value;
        setUrl(newUrl);
        updateNodeData(nodeId, { url: newUrl });
    };

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setUrl(base64String);
                updateNodeData(nodeId, { url: base64String });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6">
            <SettingRow label="Источник аудио" helpText="Введите публичный URL или загрузите аудиофайл.">
                <input
                    type="text"
                    value={url.startsWith('data:') ? '' : url}
                    onChange={handleUrlChange}
                    placeholder="https://example.com/audio.mp3"
                    className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
                <div className="text-center my-2 text-text-secondary text-sm">или</div>
                <label className="w-full text-center block cursor-pointer py-3 px-4 font-semibold text-primary-text bg-primary rounded-lg hover:bg-gray-200 transition-all">
                    Загрузить аудио
                    <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
                </label>
                {url && url.startsWith('data:audio') && (
                    <div className="mt-4 p-2 bg-background rounded-lg">
                        <p className="text-xs text-text-secondary mb-2 text-center">Предпросмотр:</p>
                        <audio controls src={url} className="w-full" />
                    </div>
                )}
            </SettingRow>
        </div>
    );
};

export default AudioSettings;
