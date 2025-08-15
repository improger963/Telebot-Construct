import React, { useEffect, useState, useMemo } from 'react';
import { useFlowStore } from '../../../../store/flowStore';
import SettingRow from '../../SettingRow';

const CrmSettings: React.FC<{ nodeId: string }> = ({ nodeId }) => {
    const { nodes, updateNodeData } = useFlowStore();
    const node = useMemo(() => nodes.find(n => n.id === nodeId), [nodes, nodeId]);
    
    const [mappings, setMappings] = useState(node?.data.mappings || []);

    useEffect(() => {
        if (node) {
            setMappings(node.data.mappings || []);
        }
    }, [node]);

    if (!node) return null;

    const handleMappingChange = (index: number, variableName: string) => {
        const newMappings = [...mappings];
        newMappings[index].variableName = variableName;
        setMappings(newMappings);
        updateNodeData(nodeId, { mappings: newMappings });
    };
    
    return (
        <div className="space-y-6">
            <SettingRow label="Сопоставление полей" helpText="Укажите, какие переменные соответствуют полям в вашей CRM.">
                <div className="space-y-3">
                    {mappings.map((mapping, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <label className="w-1/3 text-sm text-text-secondary">{mapping.crmField}</label>
                            <input
                                type="text"
                                value={mapping.variableName}
                                onChange={(e) => handleMappingChange(index, e.target.value)}
                                placeholder="имя переменной"
                                className="w-2/3 px-3 py-2 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                            />
                        </div>
                    ))}
                </div>
            </SettingRow>
        </div>
    );
};

export default CrmSettings;
