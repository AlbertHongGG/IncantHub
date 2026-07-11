import React from 'react';
import { ChevronLeft, Send, Loader2 } from 'lucide-react';
import { useAgentStore } from '../../store/useAgentStore';
import { useChatSessionStore } from '../../store/useChatSessionStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { DynamicFieldRenderer } from './DynamicFieldRenderer';
import './AgentForm.css';

export function FallbackForm() {
  const { agents, selectedAgentId, selectAgent, isServerOffline } = useAgentStore();
  const { sessions, updateSessionPayload, executeAgent } = useChatSessionStore();
  const addNotification = useNotificationStore(state => state.addNotification);

  const selectedAgent = agents.find(a => a.id === selectedAgentId);
  if (!selectedAgent || !selectedAgentId) return null;

  const session = sessions[selectedAgentId];
  const payload = session?.payload || {};
  const isExecuting = session?.isExecuting || false;

  const handleInputChange = (fieldName: string, value: any) => {
    updateSessionPayload(selectedAgentId, { ...payload, [fieldName]: value });
  };

  const handleExecute = () => {
    if (isServerOffline) {
      addNotification("Server is offline. Cannot execute task.", "error");
      return;
    }
    executeAgent(selectedAgentId, payload);
    
    // Clear text inputs to prepare for the next round
    const newPayload = { ...payload };
    Object.entries(selectedAgent.inputSchema).forEach(([key, schema]) => {
      if (schema.type === 'text') {
        newPayload[key] = '';
      }
    });
    updateSessionPayload(selectedAgentId, newPayload);
  };

  const schemaEntries = Object.entries(selectedAgent.inputSchema);
  const lastFieldKey = schemaEntries.length > 0 ? schemaEntries[schemaEntries.length - 1][0] : null;

  return (
    <aside className="agent-config-panel">
      <div className="agent-config-inner">
        <div className="agent-config-header">
          <button className="icon-back-btn" onClick={() => selectAgent(null)} title="Back to templates">
            <ChevronLeft size={20} />
          </button>
          <div className="agent-title">{selectedAgent.name}</div>
        </div>

        <div className="agent-config-form">
          {schemaEntries.map(([fieldName, schema]) => {
            const isLast = fieldName === lastFieldKey;
            
            const submitButton = isLast ? (
              <button 
                className={`composer-send-btn ${isExecuting ? 'loading' : ''} ${isServerOffline ? 'offline' : ''}`}
                onClick={handleExecute}
                disabled={isExecuting || isServerOffline}
                title="Execute Task"
              >
                {isExecuting ? <Loader2 size={16} className="spinner" /> : <Send size={16} />}
              </button>
            ) : undefined;

            return (
              <DynamicFieldRenderer
                key={fieldName}
                fieldName={fieldName}
                schema={schema}
                value={payload[fieldName]}
                onChange={(val) => handleInputChange(fieldName, val)}
                isLastField={isLast}
                submitButton={submitButton}
              />
            );
          })}
        </div>
      </div>
    </aside>
  );
}
