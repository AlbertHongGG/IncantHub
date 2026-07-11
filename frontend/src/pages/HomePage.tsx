import React, { useEffect, useMemo } from 'react';
import { useAgentStore } from '../store/useAgentStore';
import { FileText, Image as ImageIcon, PenTool, Search, LayoutGrid, ArrowRight, Tags } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { TagInput } from '../components/ui/TagInput';
import { Button } from '../components/ui/Button';
import './HomePage.css';

const IconMap: Record<string, React.ElementType> = {
  'file-text': FileText,
  'image': ImageIcon,
  'pen-tool': PenTool
};

export function HomePage() {
  const agents = useAgentStore(state => state.agents);
  const selectedTags = useAgentStore(state => state.selectedTags);
  const selectedCategories = useAgentStore(state => state.selectedCategories);
  const availableTags = useAgentStore(state => state.availableTags);
  const toggleTagFilter = useAgentStore(state => state.toggleTagFilter);
  const toggleCategoryFilter = useAgentStore(state => state.toggleCategoryFilter);
  const addTagToAgent = useAgentStore(state => state.addTagToAgent);
  const removeTagFromAgent = useAgentStore(state => state.removeTagFromAgent);
  const selectAgent = useAgentStore(state => state.selectAgent);
  const fetchAgents = useAgentStore(state => state.fetchAgents);
  const isLoading = useAgentStore(state => state.isLoading);
  const searchQuery = useAgentStore(state => state.searchQuery);
  const setSearchQuery = useAgentStore(state => state.setSearchQuery);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const filteredAgents = useMemo(() => {
    return agents.filter(agent => {
      const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => agent.tags?.includes(tag));
      const matchesCategory = selectedCategories.length === 0 ||
        selectedCategories.includes(agent.category);
      return matchesSearch && matchesTags && matchesCategory;
    });
  }, [agents, searchQuery, selectedTags, selectedCategories]);

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
      <div className="gallery-toolbar-container">
        <div className="gallery-main-toolbar">
          <div className="toolbar-left-group">
            <div className="toolbar-search">
              <Search size={16} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input-raw"
              />
            </div>
            
            <div className="toolbar-categories">
              {['text', 'image'].map(cat => {
                const isSelected = selectedCategories.includes(cat);
                return (
                  <button 
                    key={cat}
                    className={`category-tab ${isSelected ? 'active' : ''}`}
                    onClick={() => toggleCategoryFilter(cat)}
                  >
                    {cat === 'text' ? <FileText size={14} /> : <ImageIcon size={14} />}
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="toolbar-right-group">
            <div className="toolbar-stats">
              <span className="stats-badge">{filteredAgents.length} Agents</span>
            </div>
          </div>
        </div>

        {availableTags.length > 0 && (
          <div className="gallery-tags-toolbar">
            <div className="tags-toolbar-label">
              <Tags size={14} />
              <span>Tags</span>
            </div>
            <div className="tags-scroll-area">
              {availableTags.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button 
                    key={tag}
                    className={`tag-pill ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleTagFilter(tag)}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="gallery-grid">
        {filteredAgents.map((agent, idx) => {
          const IconComponent = agent.icon ? IconMap[agent.icon] || FileText : FileText;
          return (
            <div 
              key={agent.id} 
              className="gallery-card"
              style={{ animationDelay: `${idx * 50}ms` }}
              onClick={() => selectAgent(agent.id)}
            >
              {agent.coverImage ? (
                <div className="card-cover-container">
                  <img src={agent.coverImage} alt={agent.name} className="card-cover-image" />
                </div>
              ) : (
                <div className="card-visual-header">
                  <div className="icon-wrapper">
                    <IconComponent size={24} strokeWidth={1.5} />
                  </div>
                  <div className="card-action-hint">
                    <ArrowRight size={16} />
                  </div>
                </div>
              )}
              
              <div className="card-body">
                <div className="card-content">
                  <h3 className="card-title">
                    <IconComponent size={20} className="card-title-icon" strokeWidth={2} />
                    {agent.name}
                  </h3>
                  <p className="card-description">{agent.description}</p>
                </div>
                <div className="card-tags-area" onClick={e => e.stopPropagation()}>
                  <TagInput 
                    tags={agent.tags || []} 
                    availableTags={availableTags}
                    onAddTag={(tag) => addTagToAgent(agent.id, tag)}
                    onRemoveTag={(tag) => removeTagFromAgent(agent.id, tag)}
                    placeholder="Add a tag..."
                  />
                </div>
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
