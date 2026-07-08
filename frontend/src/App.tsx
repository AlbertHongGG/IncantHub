import React from 'react';
import { Layout } from './components/Layout';
import { PromptList } from './components/PromptList';
import { PromptExecution } from './components/PromptExecution';
import { OfflineFallback } from './components/ui/OfflineFallback';
import { usePromptStore } from './store/usePromptStore';

function App() {
  const selectedAgentId = usePromptStore(state => state.selectedAgentId);
  const isServerOffline = usePromptStore(state => state.isServerOffline);
  const agents = usePromptStore(state => state.agents);

  // If server is offline and no agents are loaded, show fullscreen fallback portal
  if (isServerOffline && agents.length === 0) {
    return <OfflineFallback />;
  }

  return (
    <Layout>
      {selectedAgentId === null ? <PromptList /> : <PromptExecution />}
    </Layout>
  );
}

export default App;
