import React from 'react';
import { ChevronLeft, Loader2, Sparkles } from 'lucide-react';
import { useAgentStore } from '../../store/useAgentStore';
import { useChatSessionStore } from '../../store/useChatSessionStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { DynamicFieldRenderer } from '../../components/widgets/form/DynamicFieldRenderer';
import { SplitViewLayout } from '../../components/layouts/SplitViewLayout';
import { ChatWidget } from '../../components/widgets/chat/ChatWidget';
import { AgentFactory } from '../../domain/agents/AgentFactory';
import './AgentPage.css';

export function UniversalAgentPage({ agentId }: { agentId: string }) {
  const agents = useAgentStore(state => state.agents);
  const selectAgent = useAgentStore(state => state.selectAgent);
  const isServerOffline = useAgentStore(state => state.isServerOffline);
  
  const sessions = useChatSessionStore(state => state.sessions);
  const updateSessionPayload = useChatSessionStore(state => state.updateSessionPayload);
  const executeAgent = useChatSessionStore(state => state.executeAgent);
  const addNotification = useNotificationStore(state => state.addNotification);

  const selectedAgent = agents.find(a => a.id === agentId);
  if (!selectedAgent) return null;

  const session = sessions[agentId];
  const payload = session?.payload || {};
  const isExecuting = session?.isExecuting || false;

  const handleInputChange = (fieldName: string, value: any) => {
    updateSessionPayload(agentId, { ...payload, [fieldName]: value });
  };

  const handleExecute = () => {
    if (isServerOffline) {
      addNotification("Server is offline. Cannot execute task.", "error");
      return;
    }
    
    // Validate required fields
    const missingFields = Object.entries(selectedAgent.inputSchema)
      .filter(([_, schema]) => schema.required)
      .filter(([key, _]) => {
        const val = payload[key];
        return val === undefined || val === null || (typeof val === 'string' && val.trim() === '') || (Array.isArray(val) && val.length === 0);
      })
      .map(([_, schema]) => schema.label);

    if (missingFields.length > 0) {
      addNotification(`Missing required fields: ${missingFields.join(', ')}`, "error");
      return;
    }

    const frontendAgent = AgentFactory.createAgent(selectedAgent);
    executeAgent(frontendAgent, payload);
    
    // Clear text inputs after execution
    const newPayload = { ...payload };
    Object.entries(selectedAgent.inputSchema).forEach(([key, schema]) => {
      if (schema.type === 'text') {
        newPayload[key] = '';
      }
    });
    updateSessionPayload(agentId, newPayload);
  };

  const schemaEntries = Object.entries(selectedAgent.inputSchema);

  const leftForm = (
    <div className="agent-page-left-panel">
      <div className="agent-page-header">
        <button className="icon-back-btn" onClick={() => selectAgent(null)} title="Back to templates">
          <ChevronLeft size={20} />
        </button>
        <div className="agent-title">{selectedAgent.name}</div>
      </div>

      <div className="agent-page-form">
        {schemaEntries.map(([fieldName, schema]) => (
          <DynamicFieldRenderer
            key={fieldName}
            fieldName={fieldName}
            schema={schema}
            value={payload[fieldName]}
            onChange={(val) => handleInputChange(fieldName, val)}
          />
        ))}
      </div>

      <div className="agent-page-action-area">
        <button 
          className={`agent-execute-btn ${isExecuting ? 'loading' : ''} ${isServerOffline ? 'offline' : ''}`}
          onClick={handleExecute}
          disabled={isExecuting || isServerOffline}
        >
          {isExecuting ? (
            <>
              <Loader2 size={18} className="spinner" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Run {selectedAgent.name}</span>
            </>
          )}
        </button>
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
