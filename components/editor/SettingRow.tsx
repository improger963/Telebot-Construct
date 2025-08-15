import React from 'react';

const SettingRow: React.FC<{label: string, helpText?: string, children: React.ReactNode}> = ({ label, helpText, children }) => (
    <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">{label}</label>
        {children}
        {helpText && <p className="text-xs text-text-secondary mt-2">{helpText}</p>}
    </div>
);

export default SettingRow;
