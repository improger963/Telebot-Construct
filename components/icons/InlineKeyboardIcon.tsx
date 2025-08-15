import React from 'react';

export const InlineKeyboardIcon: React.FC<{ className?: string }> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5h7.5m-7.5 3H12m-3.75 3h7.5M3 18.75V5.25c0-1.518 1.232-2.75 2.75-2.75h12.5c1.518 0 2.75 1.232 2.75 2.75v13.5c0 1.518-1.232 2.75-2.75 2.75H5.75c-1.518 0-2.75-1.232-2.75-2.75Z" />
    </svg>
);