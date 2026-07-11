import React from 'react';
import { ChevronLeft, Send, Loader2 } from 'lucide-react';
import { useAgentStore } from '../../store/useAgentStore';
import { useChatSessionStore } from '../../store/useChatSessionStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { ImageUploadZone } from '../../components/ui/ImageUploadZone';
import { Textarea } from '../../components/ui/Input';
import { SplitViewLayout } from '../../components/layouts/SplitViewLayout';
import { ChatWidget } from '../../components/widgets/chat/ChatWidget';
import { AgentFactory } from '../../domain/agents/AgentFactory';
import './AgentPage.css';

export function VirtualTryOnPage({ agentId }: { agentId: string }) {
  const selectAgent = useAgentStore(state => state.selectAgent);
  const isServerOffline = useAgentStore(state => state.isServerOffline);
  
  const sessions = useChatSessionStore(state => state.sessions);
  const updateSessionPayload = useChatSessionStore(state => state.updateSessionPayload);
  const executeAgent = useChatSessionStore(state => state.executeAgent);
  const addNotification = useNotificationStore(state => state.addNotification);

  const session = sessions[agentId];
  const payload = session?.payload || {};
  const isExecuting = session?.isExecuting || false;

  const updatePayload = (key: string, value: any) => {
    updateSessionPayload(agentId, { ...payload, [key]: value });
  };

  const handleExecute = () => {
    if (isServerOffline) {
      addNotification("Server is offline. Cannot execute task.", "error");
      return;
    }
    
    if (!payload.humanImage || payload.humanImage.length === 0) {
      addNotification("Please upload a person image first.", "error");
      return;
    }
    if (!payload.garmentImage || payload.garmentImage.length === 0) {
      addNotification("Please upload a garment image first.", "error");
      return;
    }

    const selectedAgent = useAgentStore.getState().agents.find(a => a.id === agentId);
    if (!selectedAgent) return;
    const frontendAgent = AgentFactory.createAgent(selectedAgent);

    executeAgent(frontendAgent, payload);
    updateSessionPayload(agentId, { ...payload, prompt: '' });
  };

  const leftForm = (
    <div className="agent-page-left-panel">
      <div className="agent-page-header">
        <button className="icon-back-btn" onClick={() => selectAgent(null)} title="Back to templates">
          <ChevronLeft size={20} />
        </button>
        <div className="agent-title">Virtual Try On</div>
      </div>

      <div className="agent-page-form">
        <div className="form-field-group">
          <ImageUploadZone 
            label="Person Image (Required)"
            maxCount={1}
            images={payload.humanImage || []}
            onUpload={(imgs) => updatePayload('humanImage', imgs)}
            onRemove={() => updatePayload('humanImage', [])}
          />
        </div>

        <div className="form-field-group">
          <ImageUploadZone 
            label="Garment Image (Required)"
            maxCount={1}
            images={payload.garmentImage || []}
            onUpload={(imgs) => updatePayload('garmentImage', imgs)}
            onRemove={() => updatePayload('garmentImage', [])}
          />
        </div>

        <div className="form-field-group">
          <Textarea 
            label="Style Prompt (Optional)"
            placeholder="E.g., High fashion, street style..."
            value={payload.prompt || ''}
            onChange={(e) => updatePayload('prompt', e.target.value)}
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
