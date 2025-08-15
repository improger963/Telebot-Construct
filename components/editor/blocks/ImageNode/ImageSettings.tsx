import React, { useEffect, useState, useMemo, ChangeEvent } from 'react';
import { useFlowStore } from '../../../../store/flowStore';
import SettingRow from '../../SettingRow';

const ImageSettings: React.FC<{ nodeId: string }> = ({ nodeId }) => {
    const { nodes, updateNodeData } = useFlowStore();
    const node = useMemo(() => nodes.find(n => n.id === nodeId), [nodes, nodeId]);

    const [url, setUrl] = useState(node?.data.url || '');
    const [caption, setCaption] = useState(node?.data.caption || '');

    useEffect(() => {
        if (node) {
            setUrl(node.data.url || '');
            setCaption(node.data.caption || '');
        }
    }, [node]);

    if (!node) return null;

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUrl = e.target.value;
        setUrl(newUrl);
        updateNodeData(nodeId, { url: newUrl });
    };

    const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newCaption = e.target.value;
        setCaption(newCaption);
        updateNodeData(nodeId, { caption: newCaption });
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
            <SettingRow label="Image Source" helpText="Enter a public URL or upload an image file.">
                <input
                    type="text"
                    value={url.startsWith('data:') ? '' : url}
                    onChange={handleUrlChange}
                    placeholder="https://example.com/image.png"
                    className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
                <div className="text-center my-2 text-text-secondary text-sm">or</div>
                <label className="w-full text-center block cursor-pointer py-3 px-4 font-semibold text-primary-text bg-primary rounded-lg hover:bg-gray-200 transition-all">
                    Upload Image
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
                {url && (
                    <div className="mt-4 p-2 bg-background rounded-lg">
                        <p className="text-xs text-text-secondary mb-2 text-center">Preview:</p>
                        <img src={url} alt="Preview" className="rounded-md max-w-full max-h-40 mx-auto" />
                    </div>
                )}
            </SettingRow>
            <SettingRow label="Optional Caption">
                <textarea
                    value={caption}
                    onChange={handleCaptionChange}
                    rows={3}
                    placeholder="Describe the image..."
                    className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
            </SettingRow>
        </div>
    );
};

export default ImageSettings;