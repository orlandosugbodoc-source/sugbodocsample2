import React from 'react';

interface IconProps {
  className?: string;
}

export const PesoIcon: React.FC<IconProps> = ({ className = 'h-4 w-4' }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Capital P stem & loop */}
    <path d="M7 4h6.5a4.5 4.5 0 0 1 0 9H7V4z" />
    <path d="M7 13v7" />
    {/* Dual horizontal bars for Philippine Peso (₱) */}
    <line x1="4.5" y1="7.5" x2="16.5" y2="7.5" />
    <line x1="4.5" y1="10.5" x2="16.5" y2="10.5" />
  </svg>
);

export const PesoReceiptIcon: React.FC<IconProps> = ({ className = 'h-4 w-4' }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Receipt zig-zag outline paper */}
    <path d="M4 2v20l2.5-1.5L9 22l2.5-1.5L14 22l2.5-1.5L19 22l1-0.5V2l-1 0.5L16.5 1 14 2.5 11.5 1 9 2.5 6.5 1 4 2z" />
    {/* Philippine Peso symbol inside receipt */}
    <path d="M9.5 7h4a2.5 2.5 0 0 1 0 5h-4V7z" />
    <path d="M9.5 12v5" />
    <line x1="8" y1="9" x2="14.5" y2="9" />
    <line x1="8" y1="11" x2="14.5" y2="11" />
  </svg>
);
