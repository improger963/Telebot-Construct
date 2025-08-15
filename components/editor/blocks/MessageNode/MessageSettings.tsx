import React, { useEffect, useState, useMemo } from 'react';
import { useFlowStore } from '../../../../store/flowStore';
import SettingRow from '../../SettingRow';
import { Node } from 'reactflow';

const MessageSettings: React.FC<{ nodeId: string }> = ({ nodeId }) => {
    const { nodes, updateNodeData } = useFlowStore();

    const node = useMemo(() => nodes.find(n => n.id === nodeId), [nodes, nodeId]);
    
    const [text, setText] = useState(node?.data.text || '');

    useEffect(() => {
        if (node) {
            setText(node.data.text || '');
        }
    }, [node]);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        setText(newText);
        updateNodeData(nodeId, { text: newText });
    };
    
    if (!node) return null;

    return (
        <SettingRow label="Message Text" helpText="Use {variableName} to insert stored data.">
            <textarea
              value={text}
              onChange={handleTextChange}
              rows={5}
              className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
        </SettingRow>
    );
};

export default MessageSettings;
