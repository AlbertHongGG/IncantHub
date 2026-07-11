import React from 'react';
import { AgentFormRenderer } from '../features/agent-forms/AgentFormRenderer';
import { ChatStreamPanel } from '../features/chat-stream/ChatStreamPanel';
import './AgentWorkspacePage.css';

export function AgentWorkspacePage() {
  return (
    <div className="workspace-page-layout animate-fade-in">
      <AgentFormRenderer />
      <ChatStreamPanel />
    </div>
  );
}
