import React from 'react';
import { Layout } from './components/Layout';
import { PromptList } from './components/PromptList';
import { PromptExecution } from './components/PromptExecution';

function App() {
  return (
    <Layout>
      <PromptList />
      <PromptExecution />
    </Layout>
  );
}

export default App;
