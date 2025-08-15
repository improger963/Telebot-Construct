import React from 'react';

export const ConditionIcon: React.FC<{ className?: string }> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
        <path d="M9.707 3.293a1 1 0 010 1.414L6.414 8l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" />
        <path d="M10.293 16.707a1 1 0 011.414 0l4-4a1 1 0 010-1.414l-4-4a1 1 0 11-1.414 1.414L13.586 12l-3.293 3.293a1 1 0 010 1.414z" />
    </svg>
);
