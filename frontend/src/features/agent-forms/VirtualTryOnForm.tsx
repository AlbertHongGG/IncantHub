import React, { useState } from 'react';
import { ChevronLeft, Send, Loader2 } from 'lucide-react';
import { useAgentStore } from '../../store/useAgentStore';
import { useChatSessionStore } from '../../store/useChatSessionStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { ImageUploadZone } from '../../components/ui/ImageUploadZone';
import { Textarea } from '../../components/ui/Input';
import './AgentForm.css';

export function VirtualTryOnForm() {
  const { agents, selectedAgentId, selectAgent, isServerOffline } = useAgentStore();
  const { sessions, updateSessionPayload, executeAgent } = useChatSessionStore();
  const addNotification = useNotificationStore(state => state.addNotification);

  const selectedAgent = agents.find(a => a.id === selectedAgentId);
  if (!selectedAgent || !selectedAgentId) return null;

  const session = sessions[selectedAgentId];
  const payload = session?.payload || {};
  const isExecuting = session?.isExecuting || false;

  const updatePayload = (key: string, value: any) => {
    updateSessionPayload(selectedAgentId, { ...payload, [key]: value });
  };

  const handleExecute = () => {
    if (isServerOffline) {
      addNotification("Server is offline. Cannot execute task.", "error");
      return;
    }
    
    // Validate custom logic if needed (e.g. requires exactly 1 human image and 1 garment image)
    if (!payload.humanImage || payload.humanImage.length === 0) {
      addNotification("Please upload a person image first.", "error");
      return;
    }
    if (!payload.garmentImage || payload.garmentImage.length === 0) {
      addNotification("Please upload a garment image first.", "error");
      return;
    }

    executeAgent(selectedAgentId, payload);
    
    // Clear text but keep images for rapid iteration? Or clear all? 
    updateSessionPayload(selectedAgentId, { ...payload, prompt: '' });
  };

  return (
    <aside className="agent-config-panel">
      <div className="agent-config-inner">
        <div className="agent-config-header">
          <button className="icon-back-btn" onClick={() => selectAgent(null)} title="Back to templates">
            <ChevronLeft size={20} />
          </button>
          <div className="agent-title">{selectedAgent.name} (Custom VTON Form)</div>
        </div>

        <div className="agent-config-form">
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
              placeholder="E.g., High fashion, street style, lighting..."
              value={payload.prompt || ''}
              onChange={(e) => updatePayload('prompt', e.target.value)}
              fullWidth
              rightElement={
                <button 
                  className={`composer-send-btn ${isExecuting ? 'loading' : ''} ${isServerOffline ? 'offline' : ''}`}
                  onClick={handleExecute}
                  disabled={isExecuting || isServerOffline}
                  title="Generate Try On"
                >
                  {isExecuting ? <Loader2 size={16} className="spinner" /> : <Send size={16} />}
                </button>
              }
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
