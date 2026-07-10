import React, { useEffect, useMemo } from 'react';
import { usePromptStore } from '../store/usePromptStore';
import { FileText, Image as ImageIcon, PenTool, Search, LayoutGrid, ArrowRight } from 'lucide-react';
import { Input } from './ui/Input';
import './PromptList.css';

const IconMap: Record<string, React.ElementType> = {
  'file-text': FileText,
  'image': ImageIcon,
  'pen-tool': PenTool
};

export function PromptList() {
  const { 
    agents, 
    activeCategory, 
    selectAgent, 
    fetchAgents, 
    isLoading, 
    searchQuery, 
    setSearchQuery 
  } = usePromptStore();

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const filteredAgents = useMemo(() => {
    return agents.filter(agent => {
      const matchesCategory = agent.category === activeCategory;
      const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [agents, activeCategory, searchQuery]);

  if (isLoading) {
    return (
      <div className="gallery-layout loading-state">
        <div className="skeleton-grid">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="gallery-card skeleton animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-layout animate-fade-in">
      <div className="gallery-toolbar">
        <div className="toolbar-search">
          <Search size={16} className="search-icon" />
          <Input 
            type="text" 
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input-override"
            fullWidth
          />
        </div>
        <div className="toolbar-stats">
          <span className="stats-badge">{filteredAgents.length}</span>
        </div>
      </div>

      <div className="gallery-grid">
        {filteredAgents.map((agent, idx) => {
          const IconComponent = agent.icon ? IconMap[agent.icon] || FileText : FileText;
          return (
            <div 
              key={agent.id} 
              className="gallery-card hover-lift"
              style={{ animationDelay: `${idx * 50}ms` }}
              onClick={() => selectAgent(agent.id)}
            >
              <div className="card-visual-header">
                <div className="icon-wrapper">
                  <IconComponent size={24} strokeWidth={1.5} />
                </div>
                <div className="card-action-hint">
                  <ArrowRight size={16} />
                </div>
              </div>
              <div className="card-content">
                <h3 className="card-title">{agent.name}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAgents.length === 0 && (
        <div className="gallery-empty animate-fade-in-up">
          <LayoutGrid size={32} className="empty-icon" />
          <p>No results found.</p>
        </div>
      )}
    </div>
  );
}
