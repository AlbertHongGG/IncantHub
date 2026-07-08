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
  const agents = usePromptStore(state => state.agents);
  const activeCategory = usePromptStore(state => state.activeCategory);
  const fetchAgents = usePromptStore(state => state.fetchAgents);
  const selectAgent = usePromptStore(state => state.selectAgent);
  const selectedAgentId = usePromptStore(state => state.selectedAgentId);
  const isLoading = usePromptStore(state => state.isLoading);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const filteredAgents = agents.filter(a => a.category === activeCategory);

  if (isLoading) return <div className="prompt-list-loading">Loading agents...</div>;

  return (
    <div className="prompt-list animate-fade-in">
      <h3 className="section-title">Agents</h3>
      <div className="card-grid">
        {filteredAgents.map(agent => {
          const IconComponent = agent.icon ? IconMap[agent.icon] || FileText : FileText;
          return (
            <div 
              key={agent.id} 
              className={`prompt-card ${selectedAgentId === agent.id ? 'selected' : ''}`}
              onClick={() => selectAgent(agent.id)}
            >
              <div className="card-icon-wrapper">
                <IconComponent className="card-icon" size={24} />
              </div>
              <div className="card-content">
                <h4>{agent.name}</h4>
                <p>{agent.description}</p>
              </div>
            </div>
          );
        })}
        {filteredAgents.length === 0 && (
          <div className="empty-state">No agents found for this category.</div>
        )}
      </div>
    </div>
  );
}
