import React, { useState, useRef, useEffect, useMemo } from 'react';
import { X, Plus, Hash } from 'lucide-react';
import './TagInput.css';

interface TagInputProps {
  tags: string[];
  availableTags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  placeholder?: string;
}

export function TagInput({ tags, availableTags, onAddTag, onRemoveTag, placeholder = "Add tag..." }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = useMemo(() => {
    const val = inputValue.toLowerCase().trim();
    // Filter out tags that the agent already has, then match search
    const matches = availableTags.filter(t => !tags.includes(t) && t.toLowerCase().includes(val));
    
    // If exact match doesn't exist, we add a "Create" option at the end
    const exactMatchExists = matches.some(t => t.toLowerCase() === val) || tags.some(t => t.toLowerCase() === val);
    
    const options = [...matches];
    if (val && !exactMatchExists) {
      options.push(`CREATE:${inputValue.trim()}`);
    }
    
    return options;
  }, [inputValue, availableTags, tags]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Reset active index when options change
    setActiveIndex(0);
  }, [filteredOptions.length]);

  const handleSelect = (option: string) => {
    if (option.startsWith('CREATE:')) {
      onAddTag(option.replace('CREATE:', ''));
    } else {
      onAddTag(option);
    }
    setInputValue('');
    setIsOpen(false);
    inputRef.current?.focus(); // keep focus for rapid tagging
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      onRemoveTag(tags[tags.length - 1]);
      return;
    }

    if (!isOpen && e.key === 'Enter') {
      // Prevent form submission if inside a form
      e.preventDefault();
      return;
    }

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredOptions[activeIndex]) {
          handleSelect(filteredOptions[activeIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className="tag-input-container" ref={containerRef}>
      <div className="tag-input-display" onClick={() => inputRef.current?.focus()}>
        {tags.map(tag => (
          <span key={tag} className="tag-input-badge">
            <Hash size={10} className="tag-badge-icon" />
            {tag}
            <button 
              type="button" 
              className="tag-badge-remove" 
              onClick={(e) => {
                e.stopPropagation();
                onRemoveTag(tag);
              }}
            >
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          className="tag-input-field"
          placeholder={tags.length === 0 ? placeholder : ""}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <div className="tag-input-menu">
          {filteredOptions.map((opt, idx) => {
            const isCreate = opt.startsWith('CREATE:');
            const displayLabel = isCreate ? opt.replace('CREATE:', '') : opt;
            
            return (
              <div 
                key={opt}
                className={`tag-input-option ${idx === activeIndex ? 'active' : ''}`}
                onClick={() => handleSelect(opt)}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                {isCreate ? (
                  <>
                    <Plus size={14} className="opt-icon create" />
                    <span className="opt-text">Create <strong>"{displayLabel}"</strong></span>
                  </>
                ) : (
                  <>
                    <Hash size={14} className="opt-icon" />
                    <span className="opt-text">{displayLabel}</span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
