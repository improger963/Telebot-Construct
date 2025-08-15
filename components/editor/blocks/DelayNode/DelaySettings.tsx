import React, { useEffect, useState, useMemo } from 'react';
import { useFlowStore } from '../../../../store/flowStore';
import SettingRow from '../../SettingRow';

const DelaySettings: React.FC<{ nodeId: string }> = ({ nodeId }) => {
    const { nodes, updateNodeData } = useFlowStore();
    const node = useMemo(() => nodes.find(n => n.id === nodeId), [nodes, nodeId]);
    const [seconds, setSeconds] = useState(node?.data.seconds || 1);

    useEffect(() => {
        if (node) {
            setSeconds(node.data.seconds || 1);
        }
    }, [node]);
    
    if (!node) return null;

    const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSeconds = Math.max(0, e.target.valueAsNumber || 0);
        setSeconds(newSeconds);
        updateNodeData(nodeId, { seconds: newSeconds });
    };

    return (
        <div className="space-y-6">
          <SettingRow label="Длительность задержки" helpText="Сценарий приостановится на это количество секунд перед продолжением.">
               <div className="flex items-center gap-2">
                 <input
                    type="number"
                    value={seconds}
                    onChange={handleSecondsChange}
                    min="0"
                    step="0.1"
                    className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
                <span className="text-text-secondary">секунд</span>
               </div>
          </SettingRow>
        </div>
    );
};

export default DelaySettings;