import React, { useEffect, useState, useMemo } from 'react';
import { useFlowStore } from '../../../../store/flowStore';
import SettingRow from '../../SettingRow';

const LocationSettings: React.FC<{ nodeId: string }> = ({ nodeId }) => {
    const { nodes, updateNodeData } = useFlowStore();
    const node = useMemo(() => nodes.find(n => n.id === nodeId), [nodes, nodeId]);

    const [question, setQuestion] = useState(node?.data.question || '');
    const [latVariable, setLatVariable] = useState(node?.data.latVariable || '');
    const [lonVariable, setLonVariable] = useState(node?.data.lonVariable || '');

    useEffect(() => {
        if (node) {
            setQuestion(node.data.question || '');
            setLatVariable(node.data.latVariable || '');
            setLonVariable(node.data.lonVariable || '');
        }
    }, [node]);

    if (!node) return null;

    const handleUpdate = (field: string, value: string) => {
        updateNodeData(nodeId, { [field]: value });
    };

    return (
        <div className="space-y-6">
            <SettingRow label="Текст вопроса">
                <textarea
                    value={question}
                    onChange={e => { setQuestion(e.target.value); handleUpdate('question', e.target.value); }}
                    rows={3}
                    className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
            </SettingRow>
            <SettingRow label="Сохранить широту (latitude) в переменную">
                 <input
                    type="text"
                    value={latVariable}
                    onChange={e => { setLatVariable(e.target.value); handleUpdate('latVariable', e.target.value); }}
                    placeholder="напр. latitude"
                    className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
            </SettingRow>
            <SettingRow label="Сохранить долготу (longitude) в переменную">
                 <input
                    type="text"
                    value={lonVariable}
                    onChange={e => { setLonVariable(e.target.value); handleUpdate('lonVariable', e.target.value); }}
                    placeholder="напр. longitude"
                    className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
            </SettingRow>
        </div>
    );
};

export default LocationSettings;
