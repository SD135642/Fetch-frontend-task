import React from 'react';
import type { CSSProperties } from 'react';

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  style?: CSSProperties;
  onMouseOver?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseOut?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Button({ 
  onClick, 
  disabled = false, 
  children, 
  variant = 'primary',
  className = '',
  style = {},
  onMouseOver,
  onMouseOut
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`button ${variant} ${className}`}
      style={{
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s ease',
        backgroundColor: variant === 'primary' ? 'rgb(11, 118, 11)' : '#fff',
        color: variant === 'primary' ? '#fff' : '#333',
        border: variant === 'secondary' ? '1px solid #ddd' : 'none',
        opacity: disabled ? 0.6 : 1,
        ...style
      }}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      {children}
    </button>
  );
} 