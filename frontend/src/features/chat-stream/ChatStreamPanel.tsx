import React, { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { useAgentStore } from '../../store/useAgentStore';
import { useChatSessionStore } from '../../store/useChatSessionStore';
import { UserMessageCard } from './UserMessageCard';
import { AssistantMessageCard } from './AssistantMessageCard';
import { Bubble } from '../../components/ui/Bubble';
import './ChatStreamPanel.css';

export function ChatStreamPanel() {
  const { agents, selectedAgentId } = useAgentStore();
  const { sessions } = useChatSessionStore();
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const selectedAgent = agents.find(a => a.id === selectedAgentId);
  const session = selectedAgentId ? sessions[selectedAgentId] : null;

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [session?.messages]);

  if (!selectedAgent || !session) return null;

  const messages = session.messages || [];
  const error = session.error;

  return (
    <section className="chat-stream-panel">
      <div className="chat-stream-header">
        <div className="chat-tab active">
          <Sparkles size={14} className="sparkles-icon" />
          Dialogue & Report
        </div>
      </div>
      
      <div className="chat-stream-body" ref={chatScrollRef}>
        {messages.length === 0 && !error && (
          <div className="chat-empty-state">
            <div className="empty-state-icon">
              <Sparkles size={32} />
            </div>
            <h3>Start a conversation with {selectedAgent.name}</h3>
            <p>Configure the fields on the left and hit send to begin.</p>
          </div>
        )}

        <div className="chat-messages-container">
          {messages.map((msg) => {
            if (msg.role === 'user') {
              return <UserMessageCard key={msg.id} message={msg} />;
            } else if (msg.role === 'assistant') {
              return <AssistantMessageCard key={msg.id} message={msg} />;
            }
            return null;
          })}

          {error && (
            <div className="system-error-row">
              <Bubble variant="system">
                <p><strong>System Error:</strong> {error}</p>
              </Bubble>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
