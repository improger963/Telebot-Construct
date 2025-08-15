import React, { useEffect, useState, useMemo } from 'react';
import { useFlowStore } from '../../../../store/flowStore';
import SettingRow from '../../SettingRow';

const InlineKeyboardSettings: React.FC<{ nodeId: string }> = ({ nodeId }) => {
    const { nodes, updateNodeData } = useFlowStore();
    const node = useMemo(() => nodes.find(n => n.id === nodeId), [nodes, nodeId]);
    
    const [text, setText] = useState(node?.data.text || '');
    const [buttons, setButtons] = useState(node?.data.buttons || []);
    const [columns, setColumns] = useState(node?.data.columns || 2);

    useEffect(() => {
        if (node) {
            setText(node.data.text || '');
            setButtons(node.data.buttons || []);
            setColumns(node.data.columns || 2);
        }
    }, [node]);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        setText(newText);
        updateNodeData(nodeId, { text: newText });
    };

    const handleColumnsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColumns = Math.max(1, e.target.valueAsNumber || 1);
        setColumns(newColumns);
        updateNodeData(nodeId, { columns: newColumns });
    };

    const handleAddButton = () => {
        const newButtons = [...buttons, { id: `btn_${+new Date()}`, text: 'New Button' }];
        setButtons(newButtons);
        updateNodeData(nodeId, { buttons: newButtons });
    };

    const handleButtonTextChange = (id: string, newText: string) => {
        const newButtons = buttons.map(b => b.id === id ? { ...b, text: newText } : b);
        setButtons(newButtons);
        updateNodeData(nodeId, { buttons: newButtons });
    };

    const handleRemoveButton = (id: string) => {
        const newButtons = buttons.filter(b => b.id !== id);
        setButtons(newButtons);
        updateNodeData(nodeId, { buttons: newButtons });
    };
    
    if (!node) return null;

    return (
        <div className="space-y-6">
            <SettingRow label="Message Text">
                <textarea
                  value={text}
                  onChange={handleTextChange}
                  rows={5}
                  className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
            </SettingRow>
            <hr className="border-input" />
            <SettingRow label="Buttons" helpText="Each button creates a new output path from the node.">
                 <div className="space-y-3">
                    {buttons.map((button) => (
                        <div key={button.id} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={button.text}
                                onChange={(e) => handleButtonTextChange(button.id, e.target.value)}
                                className="w-full px-3 py-2 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                            />
                            <button onClick={() => handleRemoveButton(button.id)} className="p-2 text-text-secondary hover:text-brand-red rounded-full hover:bg-surface transition-colors flex-shrink-0" aria-label="Remove button">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                    ))}
                    <button onClick={handleAddButton} className="w-full text-sm font-medium text-brand-green p-2 rounded-lg hover:bg-input transition-colors">
                        + Add Button
                    </button>
                </div>
            </SettingRow>
        </div>
    );
};

export default InlineKeyboardSettings;