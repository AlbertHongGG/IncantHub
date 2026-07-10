import React from 'react';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading = false, fullWidth = false, children, disabled, ...props }, ref) => {
    const classNames = [
      'ui-button',
      `variant-${variant}`,
      `size-${size}`,
      fullWidth ? 'full-width' : '',
      isLoading ? 'is-loading' : '',
      className
    ].filter(Boolean).join(' ');

    return (
      <button 
        ref={ref} 
        className={classNames} 
        disabled={disabled || isLoading} 
        {...props}
      >
        {isLoading && (
          <svg className="btn-spinner" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
            <path className="spinner-head" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        <span className="btn-content">{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
