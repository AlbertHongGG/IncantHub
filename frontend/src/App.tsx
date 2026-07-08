import React from 'react';
import { Layout } from './components/Layout';
import { PromptList } from './components/PromptList';
import { PromptExecution } from './components/PromptExecution';
import { usePromptStore } from './store/usePromptStore';

function App() {
  const selectedAgentId = usePromptStore(state => state.selectedAgentId);

  return (
    <Layout>
      {selectedAgentId === null ? <PromptList /> : <PromptExecution />}
    </Layout>
  );
}

export default App;
