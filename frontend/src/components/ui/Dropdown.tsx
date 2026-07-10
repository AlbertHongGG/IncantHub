import React, { useState, useRef, useEffect } from 'react';
import './Dropdown.css';

interface DropdownContextType {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

const DropdownContext = React.createContext<DropdownContextType>({ isOpen: false, setIsOpen: () => {} });

export function Dropdown({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="ui-dropdown" ref={containerRef}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

function DropdownTrigger({ children, asChild = false }: { children: React.ReactNode, asChild?: boolean }) {
  const { isOpen, setIsOpen } = React.useContext(DropdownContext);
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: (e: any) => {
        setIsOpen(!isOpen);
        if (children.props.onClick) children.props.onClick(e);
      }
    });
  }

  return (
    <div className="ui-dropdown-trigger" onClick={() => setIsOpen(!isOpen)}>
      {children}
    </div>
  );
}

function DropdownMenu({ children, align = 'left' }: { children: React.ReactNode, align?: 'left' | 'right' }) {
  const { isOpen } = React.useContext(DropdownContext);
  if (!isOpen) return null;

  return (
    <div className={`ui-dropdown-menu align-${align} animate-fade-in-down`}>
      {children}
    </div>
  );
}

function DropdownItem({ children, onClick, icon }: { children: React.ReactNode, onClick?: () => void, icon?: React.ReactNode }) {
  const { setIsOpen } = React.useContext(DropdownContext);
  return (
    <button 
      className="ui-dropdown-item" 
      onClick={() => {
        if (onClick) onClick();
        setIsOpen(false);
      }}
    >
      {icon && <span className="ui-dropdown-icon">{icon}</span>}
      {children}
    </button>
  );
}

function DropdownDivider() {
  return <div className="ui-dropdown-divider" />;
}

Dropdown.Trigger = DropdownTrigger;
Dropdown.Menu = DropdownMenu;
Dropdown.Item = DropdownItem;
Dropdown.Divider = DropdownDivider;
