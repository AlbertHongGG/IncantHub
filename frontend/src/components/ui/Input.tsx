import React, { forwardRef, useEffect, useRef } from 'react';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helperText, fullWidth = false, ...props }, ref) => {
    const containerClasses = [
      'ui-input-container',
      fullWidth ? 'full-width' : '',
      error ? 'has-error' : '',
      className
    ].filter(Boolean).join(' ');

    return (
      <div className={containerClasses}>
        {label && <label className="ui-input-label">{label}</label>}
        <div className="ui-input-wrapper">
          <input ref={ref} className="ui-input" {...props} />
          <div className="ui-input-focus-line" />
        </div>
        {(error || helperText) && (
          <span className={`ui-input-helper ${error ? 'is-error' : ''}`}>
            {error || helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  rightElement?: React.ReactNode;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, helperText, fullWidth = false, rightElement, onChange, ...props }, forwardedRef) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLTextAreaElement>) || internalRef;

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (ref.current) {
        ref.current.style.height = 'auto';
        ref.current.style.height = `${ref.current.scrollHeight}px`;
      }
      if (onChange) onChange(e);
    };

    useEffect(() => {
      if (ref.current) {
        ref.current.style.height = 'auto';
        ref.current.style.height = `${ref.current.scrollHeight}px`;
      }
    }, [props.value, ref]);

    const containerClasses = [
      'ui-composer-container',
      fullWidth ? 'full-width' : '',
      error ? 'has-error' : '',
      className
    ].filter(Boolean).join(' ');

    return (
      <div className={containerClasses}>
        {label && <label className="ui-input-label">{label}</label>}
        <div className="ui-composer-wrapper">
          <textarea 
            ref={ref} 
            className="ui-composer-input" 
            onChange={handleInput}
            rows={1}
            {...props} 
          />
          {rightElement && (
            <div className="ui-composer-actions">
              {rightElement}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <span className={`ui-input-helper ${error ? 'is-error' : ''}`}>
            {error || helperText}
          </span>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
