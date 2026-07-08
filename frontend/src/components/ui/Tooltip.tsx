import React, { useState } from 'react';
import './Tooltip.css';

interface TooltipProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  children: React.ReactElement;
}

export function Tooltip({ content, position = 'top', delay = 200, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  let timeout: NodeJS.Timeout;

  const showTip = () => {
    timeout = setTimeout(() => {
      setVisible(true);
    }, delay);
  };

  const hideTip = () => {
    clearTimeout(timeout);
    setVisible(false);
  };

  return (
    <div 
      className="tooltip-wrapper" 
      onMouseEnter={showTip} 
      onMouseLeave={hideTip}
    >
      {children}
      {visible && (
        <div className={`tooltip-tip ${position}`}>
          {content}
        </div>
      )}
    </div>
  );
}
