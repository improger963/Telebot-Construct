import React from 'react';

const StartSettings: React.FC<{ nodeId: string }> = ({ nodeId }) => {
    return (
        <p className="text-text-secondary">This is the starting point of your bot's flow. It has no configurable settings.</p>
    );
};

export default StartSettings;
