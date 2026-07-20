import React from 'react';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { UniversalAgentPage } from './pages/agents/UniversalAgentPage';
import { OfflineFallback } from './components/ui/OfflineFallback';
import { useAgentStore } from './store/useAgentStore';
import { PluginModal } from './components/PluginModal';

function App() {
  const selectedAgentId = useAgentStore(state => state.selectedAgentId);
  const isServerOffline = useAgentStore(state => state.isServerOffline);
  const agents = useAgentStore(state => state.agents);

  // If server is offline and no agents are loaded, show fullscreen fallback portal
  if (isServerOffline && agents.length === 0) {
    return <OfflineFallback />;
  }

  return (
    <>
      <Layout>
        {selectedAgentId ? (
          <UniversalAgentPage agentId={selectedAgentId} />
        ) : <HomePage />}
      </Layout>
      <PluginModal />
    </>
  );
}

export default App;
