import React from 'react';
import { useAgentStore } from '../store/useAgentStore';
import { VirtualTryOnPage } from './agents/VirtualTryOnPage';
import { PoliteCommunicatorPage } from './agents/PoliteCommunicatorPage';
import { FallbackAgentPage } from './agents/FallbackAgentPage';

const AgentPageRegistry: Record<string, React.ElementType> = {
  // Map exact agent IDs or unique slugs to their specific Page component
  // E.g., 'vton-agent-id': VirtualTryOnPage
};

// Fallback logic by category or partial name matching if exact ID isn't known yet
function resolveAgentPage(agentId: string, agents: any[]): React.ElementType {
  if (AgentPageRegistry[agentId]) return AgentPageRegistry[agentId];

  const agent = agents.find(a => a.id === agentId);
  if (!agent) return FallbackAgentPage;

  if (agent.name.toLowerCase().includes('try on')) {
    return VirtualTryOnPage;
  }
  
  if (agent.name.toLowerCase().includes('polite') || agent.name.toLowerCase().includes('communicator')) {
    return PoliteCommunicatorPage;
  }

  return FallbackAgentPage;
}

export function AgentRouter() {
  const agents = useAgentStore(state => state.agents);
  const selectedAgentId = useAgentStore(state => state.selectedAgentId);
  
  if (!selectedAgentId) return null;

  const PageComponent = resolveAgentPage(selectedAgentId, agents);

  return <PageComponent agentId={selectedAgentId} />;
}
