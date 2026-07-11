import React from 'react';
import { useAgentStore } from '../../store/useAgentStore';
import { getAgentForm } from './registry';

export function AgentFormRenderer() {
  const { agents, selectedAgentId } = useAgentStore();
  
  if (!selectedAgentId) return null;
  const selectedAgent = agents.find(a => a.id === selectedAgentId);
  if (!selectedAgent) return null;

  // Resolve the correct component from the registry
  const FormComponent = getAgentForm(selectedAgent.id, selectedAgent.category);

  return <FormComponent />;
}
