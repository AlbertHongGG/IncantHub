import React from 'react';
import { AgentConfigPanel } from '../features/agent-config-form/AgentConfigPanel';
import { ChatStreamPanel } from '../features/chat-stream/ChatStreamPanel';
import './WorkspacePage.css';

export function WorkspacePage() {
  return (
    <div className="workspace-page-layout animate-fade-in">
      <AgentConfigPanel />
      <ChatStreamPanel />
    </div>
  );
}
