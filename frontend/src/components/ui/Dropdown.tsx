import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import './Dropdown.css';

// Context to share dropdown state
const DropdownContext = createContext<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

function useDropdown() {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown compound components must be rendered within a <Dropdown />');
  }
  return context;
}

export function Dropdown({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click Outside detection hook logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="dropdown" ref={dropdownRef}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

// Trigger Component
Dropdown.Trigger = function DropdownTrigger({ children }: { children: React.ReactElement }) {
  const { isOpen, setIsOpen } = useDropdown();

  return React.cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      // Execute original click handler if it exists
      if (children.props.onClick) children.props.onClick(e);
      setIsOpen(!isOpen);
    },
    className: `${children.props.className || ''} dropdown-trigger-btn ${isOpen ? 'active' : ''}`.trim()
  });
};

// Menu Component
Dropdown.Menu = function DropdownMenu({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'right' }) {
  const { isOpen } = useDropdown();

  if (!isOpen) return null;

  return (
    <div className={`dropdown-menu ${align}`}>
      {children}
    </div>
  );
};

// Item Component
Dropdown.Item = function DropdownItem({ 
  children, 
  onClick,
  variant = 'default'
}: { 
  children: React.ReactNode; 
  onClick?: () => void;
  variant?: 'default' | 'danger';
}) {
  const { setIsOpen } = useDropdown();

  const handleItemClick = () => {
    if (onClick) onClick();
    setIsOpen(false);
  };

  return (
    <button 
      type="button" 
      className={`dropdown-item ${variant}`}
      onClick={handleItemClick}
    >
      {children}
    </button>
  );
};
