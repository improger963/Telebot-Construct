import React from 'react';

export const VariableIcon: React.FC<{ className?: string }> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.353-.026.715-.026 1.068 0 1.13.094 1.976 1.057 1.976 2.192V7.5M8.25 7.5h7.5M8.25 7.5v3.75c0 1.5-1.5 2.25-3.75 2.25S.75 12.75.75 11.25V7.5M15.75 7.5v3.75c0 1.5 1.5 2.25 3.75 2.25s3.75-1.5 3.75-2.25V7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15h7.5" />
    </svg>
);