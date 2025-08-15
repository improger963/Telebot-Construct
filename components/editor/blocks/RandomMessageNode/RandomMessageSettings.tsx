import React, { useEffect, useState, useMemo } from 'react';
import { useFlowStore } from '../../../../store/flowStore';
import SettingRow from '../../SettingRow';
import { Node } from 'reactflow';

const RandomMessageSettings: React.FC<{ nodeId: string }> = ({ nodeId }) => {
    const { nodes, updateNodeData } = useFlowStore();
    const node = useMemo(() => nodes.find(n => n.id === nodeId), [nodes, nodeId]);
    
    const [messages, setMessages] = useState(node?.data.messages || []);

    useEffect(() => {
        if (node) {
            setMessages(node.data.messages || []);
        }
    }, [node]);

    const handleAddMessage = () => {
        const newMessages = [...messages, { id: `msg_${+new Date()}`, text: 'Новый вариант' }];
        setMessages(newMessages);
        updateNodeData(nodeId, { messages: newMessages });
    };

    const handleMessageTextChange = (id: string, newText: string) => {
        const newMessages = messages.map(m => m.id === id ? { ...m, text: newText } : m);
        setMessages(newMessages);
        updateNodeData(nodeId, { messages: newMessages });
    };

    const handleRemoveMessage = (id: string) => {
        const newMessages = messages.filter(m => m.id !== id);
        setMessages(newMessages);
        updateNodeData(nodeId, { messages: newMessages });
    };
    
    if (!node) return null;

    return (
        <div className="space-y-6">
            <SettingRow label="Варианты сообщений" helpText="Бот случайным образом выберет и отправит одно из этих сообщений.">
                <div className="space-y-3">
                    {messages.map((message) => (
                        <div key={message.id} className="flex items-start gap-2">
                            <textarea
                                value={message.text}
                                onChange={(e) => handleMessageTextChange(message.id, e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                            />
                            <button onClick={() => handleRemoveMessage(message.id)} className="p-2 text-text-secondary hover:text-brand-red rounded-full hover:bg-surface transition-colors flex-shrink-0 mt-1" aria-label="Удалить сообщение">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                    ))}
                    <button onClick={handleAddMessage} className="w-full text-sm font-medium text-brand-green p-2 rounded-lg hover:bg-input transition-colors">
                        + Добавить сообщение
                    </button>
                </div>
            </SettingRow>
        </div>
    );
};

export default RandomMessageSettings;