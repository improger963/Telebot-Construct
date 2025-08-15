import React, { useEffect, useState, useMemo } from 'react';
import { useFlowStore } from '../../../../store/flowStore';
import SettingRow from '../../SettingRow';

const HttpRequestSettings: React.FC<{ nodeId: string }> = ({ nodeId }) => {
    const { nodes, updateNodeData } = useFlowStore();
    const node = useMemo(() => nodes.find(n => n.id === nodeId), [nodes, nodeId]);

    const [method, setMethod] = useState(node?.data.method || 'GET');
    const [url, setUrl] = useState(node?.data.url || '');
    const [headers, setHeaders] = useState(node?.data.headers || []);
    const [body, setBody] = useState(node?.data.body || '');
    const [responseVariable, setResponseVariable] = useState(node?.data.responseVariable || '');

    useEffect(() => {
        if (node) {
            setMethod(node.data.method || 'GET');
            setUrl(node.data.url || '');
            setHeaders(node.data.headers || []);
            setBody(node.data.body || '');
            setResponseVariable(node.data.responseVariable || '');
        }
    }, [node]);

    if (!node) return null;

    const handleUpdate = (data: object) => updateNodeData(nodeId, data);
    
    const handleHeaderChange = (index: number, field: 'key' | 'value', value: string) => {
        const newHeaders = [...headers];
        newHeaders[index][field] = value;
        setHeaders(newHeaders);
        handleUpdate({ headers: newHeaders });
    };
    
    const addHeader = () => {
        const newHeaders = [...headers, { key: '', value: '' }];
        setHeaders(newHeaders);
        handleUpdate({ headers: newHeaders });
    };

    const removeHeader = (index: number) => {
        const newHeaders = headers.filter((_, i) => i !== index);
        setHeaders(newHeaders);
        handleUpdate({ headers: newHeaders });
    };

    return (
        <div className="space-y-6">
            <SettingRow label="Метод">
                <select value={method} onChange={e => { setMethod(e.target.value); handleUpdate({ method: e.target.value }); }} className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green">
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                </select>
            </SettingRow>

            <SettingRow label="URL">
                <input type="text" value={url} onChange={e => { setUrl(e.target.value); handleUpdate({ url: e.target.value }); }} placeholder="https://api.example.com/data" className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green" />
            </SettingRow>

            <SettingRow label="Заголовки (Headers)">
                <div className="space-y-2">
                    {headers.map((header, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input type="text" placeholder="Ключ" value={header.key} onChange={e => handleHeaderChange(index, 'key', e.target.value)} className="w-1/2 px-3 py-2 text-text-primary bg-background rounded-md border-none focus:outline-none focus:ring-2 focus:ring-brand-green" />
                            <input type="text" placeholder="Значение" value={header.value} onChange={e => handleHeaderChange(index, 'value', e.target.value)} className="w-1/2 px-3 py-2 text-text-primary bg-background rounded-md border-none focus:outline-none focus:ring-2 focus:ring-brand-green" />
                            <button onClick={() => removeHeader(index)} className="p-2 text-text-secondary hover:text-brand-red rounded-full hover:bg-surface transition-colors flex-shrink-0" aria-label="Удалить заголовок">&times;</button>
                        </div>
                    ))}
                    <button onClick={addHeader} className="w-full text-sm font-medium text-brand-green p-2 rounded-lg hover:bg-input transition-colors">+ Добавить заголовок</button>
                </div>
            </SettingRow>

            {method === 'POST' && (
                <SettingRow label="Тело (Body)" helpText="Используйте JSON или другой текстовый формат. Переменные {var} будут подставлены.">
                    <textarea value={body} onChange={e => { setBody(e.target.value); handleUpdate({ body: e.target.value }); }} rows={5} className="w-full px-4 py-3 font-mono text-sm text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green" />
                </SettingRow>
            )}

            <SettingRow label="Сохранить ответ в переменную" helpText="Тело ответа от сервера будет сохранено в эту переменную.">
                <input type="text" value={responseVariable} onChange={e => { setResponseVariable(e.target.value); handleUpdate({ responseVariable: e.target.value }); }} placeholder="напр. api_response" className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green" />
            </SettingRow>
        </div>
    );
};

export default HttpRequestSettings;
