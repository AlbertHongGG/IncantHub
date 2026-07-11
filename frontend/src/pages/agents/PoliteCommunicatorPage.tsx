import React from 'react';
import { ChevronLeft, Send, Loader2 } from 'lucide-react';
import { useAgentStore } from '../../store/useAgentStore';
import { useChatSessionStore } from '../../store/useChatSessionStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { Textarea } from '../../components/ui/Input';
import { SplitViewLayout } from '../../components/layouts/SplitViewLayout';
import { ChatWidget } from '../../components/widgets/chat/ChatWidget';
import './AgentPage.css';

export function PoliteCommunicatorPage({ agentId }: { agentId: string }) {
  const { selectAgent, isServerOffline } = useAgentStore();
  const { sessions, updateSessionPayload, executeAgent } = useChatSessionStore();
  const addNotification = useNotificationStore(state => state.addNotification);

  const session = sessions[agentId];
  const payload = session?.payload || {};
  const isExecuting = session?.isExecuting || false;

  const handleExecute = () => {
    if (isServerOffline) {
      addNotification("Server is offline. Cannot execute task.", "error");
      return;
    }
    
    if (!payload.message || payload.message.trim() === '') {
      return;
    }

    executeAgent(agentId, payload);
    updateSessionPayload(agentId, { ...payload, message: '' });
  };

  const leftForm = (
    <div className="agent-page-left-panel">
      <div className="agent-page-header">
        <button className="icon-back-btn" onClick={() => selectAgent(null)} title="Back to templates">
          <ChevronLeft size={20} />
        </button>
        <div className="agent-title">Polite Communicator</div>
      </div>

      <div className="agent-page-form">
        <div className="form-field-group" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <Textarea 
            label="Original Message"
            placeholder="Type your blunt or informal message here..."
            value={payload.message || ''}
            onChange={(e) => updateSessionPayload(agentId, { ...payload, message: e.target.value })}
            fullWidth
            rightElement={
              <button 
                className={`composer-send-btn ${isExecuting ? 'loading' : ''} ${isServerOffline ? 'offline' : ''}`}
                onClick={handleExecute}
                disabled={isExecuting || isServerOffline}
              >
                {isExecuting ? <Loader2 size={16} className="spinner" /> : <Send size={16} />}
              </button>
            }
          />
        </div>
      </div>
    </div>
  );

  return (
    <SplitViewLayout 
      leftPane={leftForm} 
      rightPane={<ChatWidget agentId={agentId} />} 
    />
  );
}
