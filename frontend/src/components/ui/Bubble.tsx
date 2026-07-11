import React from 'react';
import './Bubble.css';

interface BubbleProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'system' | 'ghost';
  className?: string;
  actions?: React.ReactNode;
}

export function Bubble({ children, variant = 'primary', className = '', actions }: BubbleProps) {
  return (
    <div className={`ui-bubble-wrapper ${className}`}>
      <div className={`ui-bubble bubble-${variant}`}>
        {children}
      </div>
      {actions && (
        <div className="ui-bubble-actions">
          {actions}
        </div>
      )}
    </div>
  );
}
