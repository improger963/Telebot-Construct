import React from 'react';

const StartSettings: React.FC<{ nodeId: string }> = ({ nodeId }) => {
    return (
        <p className="text-text-secondary">Это начальная точка сценария вашего бота. У нее нет настраиваемых параметров.</p>
    );
};

export default StartSettings;