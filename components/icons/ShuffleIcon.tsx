import React from 'react';

export const ShuffleIcon: React.FC<{ className?: string }> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-3.375A4.5 4.5 0 0 0 9 13.5H3.375M3 3h3.375c2.481 0 4.5 2.019 4.5 4.5v3.375M21 21l-3.375-3.375M17.625 3l-3.375 3.375" />
    </svg>
);