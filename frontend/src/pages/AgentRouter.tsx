import React from 'react';
import { useAgentStore } from '../store/useAgentStore';
import { UniversalAgentPage } from './agents/UniversalAgentPage';

export function AgentRouter() {
  const selectedAgentId = useAgentStore(state => state.selectedAgentId);
  
  if (!selectedAgentId) return null;

  return <UniversalAgentPage agentId={selectedAgentId} />;
}
