import React from 'react';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { AgentRouter } from './pages/AgentRouter';
import { OfflineFallback } from './components/ui/OfflineFallback';
import { useAgentStore } from './store/useAgentStore';

function App() {
  const selectedAgentId = useAgentStore(state => state.selectedAgentId);
  const isServerOffline = useAgentStore(state => state.isServerOffline);
  const agents = useAgentStore(state => state.agents);

  // If server is offline and no agents are loaded, show fullscreen fallback portal
  if (isServerOffline && agents.length === 0) {
    return <OfflineFallback />;
  }

  return (
    <Layout>
      {selectedAgentId ? (
        <AgentRouter />
      ) : <HomePage />}
    </Layout>
  );
}

export default App;
