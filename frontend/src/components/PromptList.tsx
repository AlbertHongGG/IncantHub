import React, { useEffect } from 'react';
import { usePromptStore } from '../store/usePromptStore';
import { FileText, Image as ImageIcon, PenTool } from 'lucide-react';
import './PromptList.css';

const IconMap: Record<string, React.ElementType> = {
  'file-text': FileText,
  'image': ImageIcon,
  'pen-tool': PenTool
};

export function PromptList() {
  const { prompts, activeCategory, fetchPrompts, selectPrompt, selectedPromptId, isLoading } = usePromptStore();

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  const filteredPrompts = prompts.filter(p => p.category === activeCategory);

  if (isLoading) return <div className="prompt-list-loading">Loading templates...</div>;

  return (
    <div className="prompt-list animate-fade-in">
      <h3 className="section-title">Templates</h3>
      <div className="card-grid">
        {filteredPrompts.map(prompt => {
          const IconComponent = prompt.icon ? IconMap[prompt.icon] || FileText : FileText;
          return (
            <div 
              key={prompt.id} 
              className={`prompt-card ${selectedPromptId === prompt.id ? 'selected' : ''}`}
              onClick={() => selectPrompt(prompt.id)}
            >
              <div className="card-icon-wrapper">
                <IconComponent className="card-icon" size={24} />
              </div>
              <div className="card-content">
                <h4>{prompt.title}</h4>
                <p>{prompt.description}</p>
              </div>
            </div>
          );
        })}
        {filteredPrompts.length === 0 && (
          <div className="empty-state">No templates found for this category.</div>
        )}
      </div>
    </div>
  );
}
