import React, { useEffect } from 'react';
import { usePromptStore } from '../store/usePromptStore';
import { FileText, Image as ImageIcon, PenTool, Search, Grid } from 'lucide-react';
import './PromptList.css';

const IconMap: Record<string, React.ElementType> = {
  'file-text': FileText,
  'image': ImageIcon,
  'pen-tool': PenTool
};

export function PromptList() {
  const agents = usePromptStore(state => state.agents);
  const activeCategory = usePromptStore(state => state.activeCategory);
  const setCategory = usePromptStore(state => state.setCategory);
  const selectedAgentId = usePromptStore(state => state.selectedAgentId);
  const selectAgent = usePromptStore(state => state.selectAgent);
  const fetchAgents = usePromptStore(state => state.fetchAgents);
  const isLoading = usePromptStore(state => state.isLoading);
  const searchQuery = usePromptStore(state => state.searchQuery);
  const setSearchQuery = usePromptStore(state => state.setSearchQuery);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  // Filter agents by search query AND active category
  const filteredAgents = agents.filter(agent => {
    const matchesCategory = agent.category === activeCategory;
    const matchesSearch = 
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="portal-loading">
        <div className="portal-loading-spinner" />
      </div>
    );
  }

  return (
    <div className="catalog-portal animate-fade-in-up">
      {/* Intro section */}
      <section className="portal-intro">
        <h1>Template Catalog</h1>
        <p>Select a pre-configured AI Agent template to launch your workspace.</p>
      </section>

      {/* Control bar (Search + Filter tabs) */}
      <div className="portal-controls">
        <div className="search-bar-wrapper">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search templates by name or capabilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="portal-search-input"
          />
        </div>

        <div className="portal-tabs">
          <button 
            className={`portal-tab-btn ${activeCategory === 'text' ? 'active' : ''}`}
            onClick={() => setCategory('text')}
          >
            <span>Text Engines</span>
          </button>
          <button 
            className={`portal-tab-btn ${activeCategory === 'image' ? 'active' : ''}`}
            onClick={() => setCategory('image')}
          >
            <span>Image Engines</span>
          </button>
        </div>
      </div>

      {/* Grid view of Agents */}
      <div className="catalog-grid-wrapper">
        <div className="catalog-grid">
          {filteredAgents.map(agent => {
            const IconComponent = agent.icon ? IconMap[agent.icon] || FileText : FileText;
            
            return (
              <div 
                key={agent.id} 
                className="catalog-card"
                onClick={() => selectAgent(agent.id)}
              >
                <div className="card-header-row">
                  <div className="card-icon-box">
                    <IconComponent size={18} />
                  </div>
                  <span className="card-category-tag">{agent.category}</span>
                </div>
                
                <div className="card-main-info">
                  <h3>{agent.name}</h3>
                  <p>{agent.description}</p>
                </div>
                
                <div className="card-footer-action">
                  <span>Launch Workspace →</span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAgents.length === 0 && (
          <div className="portal-empty-state">
            <Grid size={32} className="empty-icon" />
            <h3>No Templates Found</h3>
            <p>Try adjusting your search query or switching categories.</p>
          </div>
        )}
      </div>
    </div>
  );
}
