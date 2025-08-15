import React from 'react';

const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 32 32" {...props}>
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#34d399" />
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="24" height="24" rx="6" fill="url(#logoGradient)" />
    <path d="M12 10v12l8-6z" fill="white" />
  </svg>
);

export default Logo;