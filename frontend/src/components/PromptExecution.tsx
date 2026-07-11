import React, { useEffect, useRef } from 'react';
import { usePromptStore } from '../store/usePromptStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { Tooltip } from './ui/Tooltip';
import { Button } from './ui/Button';
import { Textarea } from './ui/Input';
import { Play, UploadCloud, X, Copy, ChevronLeft, LayoutPanelLeft, Send, Loader2, Sparkles, CheckCheck } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ImageUploadZone } from './ui/ImageUploadZone';
import './PromptExecution.css';

export function PromptExecution() {
  const { 
    agents, 
    selectedAgentId, 
    selectAgent, 
    executeAgent, 
    sessions,
    updateSessionPayload,
    isServerOffline
  } = usePromptStore();

  const addNotification = useNotificationStore(state => state.addNotification);
  
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const selectedAgent = agents.find(p => p.id === selectedAgentId);
  const currentSession = selectedAgentId ? sessions[selectedAgentId] : null;

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [currentSession?.messages]);

  if (!selectedAgent || !currentSession) return null;

  const payload = currentSession.payload;
  const isExecuting = currentSession.isExecuting;
  const error = currentSession.error;

  const handleInputChange = (fieldName: string, value: any) => {
    updateSessionPayload(selectedAgent.id, { ...payload, [fieldName]: value });
  };

  const handleExecute = () => {
    if (isServerOffline) {
      addNotification("Server is offline. Cannot execute task.", "error");
      return;
    }
    executeAgent(payload);
    // Clear text inputs after sending to prepare for next interaction
    const newPayload = { ...payload };
    Object.entries(selectedAgent.inputSchema).forEach(([key, schema]: [string, any]) => {
      if (schema.type === 'text') {
        newPayload[key] = '';
      }
    });
    updateSessionPayload(selectedAgent.id, newPayload);
  };

  const handleCopy = (content: string, id: string) => {
    if (content) {
      navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const schemaEntries = Object.entries(selectedAgent.inputSchema);
  const lastFieldKey = schemaEntries.length > 0 ? schemaEntries[schemaEntries.length - 1][0] : null;

  const renderField = (fieldName: string, schema: any) => {
    const isLast = fieldName === lastFieldKey;
    
    const sendButton = isLast ? (
      <button 
        className={`composer-send-btn ${isExecuting ? 'loading' : ''} ${isServerOffline ? 'offline' : ''}`}
        onClick={handleExecute}
        disabled={isExecuting || isServerOffline}
        title="Execute Task"
      >
        {isExecuting ? <Loader2 size={16} className="spinner" /> : <Send size={16} />}
      </button>
    ) : null;

    if (schema.type === 'text') {
      return (
        <div className="form-field-group" key={fieldName}>
          <Textarea 
            label={schema.label}
            placeholder="Type your message here..."
            value={payload[fieldName] || ''}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            required={schema.required}
            fullWidth
            rightElement={sendButton}
          />
        </div>
      );
    }

    if (schema.type === 'image') {
      const max = schema.maxCount || 1;
      const images: string[] = payload[fieldName] || [];
      
      return (
        <React.Fragment key={fieldName}>
          <ImageUploadZone 
            label={schema.label}
            maxCount={max}
            images={images}
            onUpload={(base64Images) => {
              const combined = [...images, ...base64Images].slice(0, max);
              handleInputChange(fieldName, combined);
            }}
            onRemove={(idx) => {
              const filtered = images.filter((_, i) => i !== idx);
              handleInputChange(fieldName, filtered.length > 0 ? filtered : undefined);
            }}
          />
          {isLast && (
             <div className="standalone-send-actions">
               {sendButton}
             </div>
          )}
        </React.Fragment>
      );
    }

    return null;
  };

  return (
    <div className="workspace-layout animate-fade-in">
      <div className="workspace-panels">
        {/* Left Panel: Configuration */}
        <aside className="panel-config">
          <div className="panel-inner">
            <div className="config-sidebar-header">
              <button className="icon-back-btn" onClick={() => selectAgent(null)} title="Back to templates">
                <ChevronLeft size={20} />
              </button>
              <div className="workspace-title">{selectedAgent.name}</div>
            </div>

            <div className="config-form">
              {schemaEntries.map(([fieldName, schema]) => 
                renderField(fieldName, schema)
              )}
            </div>
          </div>
        </aside>

        {/* Right Panel: Chat Stream */}
        <section className="panel-chat-stream">
          <div className="chat-header">
            <div className="chat-tab active">
              <Sparkles size={14} className="sparkles-icon" />
              Dialogue & Report
            </div>
          </div>
          
          <div className="chat-body" ref={chatScrollRef}>
            {currentSession.messages.length === 0 && !error && (
              <div className="chat-empty-state">
                <div className="empty-state-icon">
                  <Sparkles size={32} />
                </div>
                <h3>Start a conversation with {selectedAgent.name}</h3>
                <p>Configure the fields on the left and hit send to begin.</p>
              </div>
            )}

            {currentSession.messages.map((msg) => (
              <div key={msg.id} className={`chat-message-row ${msg.role}`}>
                {msg.role === 'assistant' && (
                  <div className="message-avatar assistant">
                    <Sparkles size={16} />
                  </div>
                )}
                
                <div className="message-content-wrapper">
                  <div className={`message-bubble ${(!msg.content && msg.images && msg.images.length > 0) ? 'image-only' : ''}`}>
                    {msg.isGenerating && (
                      <div className="generating-indicator">
                        <div className="dot" />
                        <div className="dot" />
                        <div className="dot" />
                      </div>
                    )}
                    
                    {msg.images && msg.images.length > 0 && (
                      <div className="message-gallery">
                        {msg.images.map((imgUrl, idx) => (
                          <div key={idx} className="message-image-box">
                            <img src={imgUrl} alt={`Attached ${idx + 1}`} />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {msg.content && (
                      <div className="message-text">
                        {msg.role === 'assistant' ? (
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        ) : (
                          msg.content.split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                              {line}
                              <br />
                            </React.Fragment>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  
                  {msg.role === 'assistant' && !msg.isGenerating && msg.content && (
                    <div className="message-actions">
                      <button 
                        className="msg-action-btn"
                        onClick={() => handleCopy(msg.content!, msg.id)}
                        title="Copy to clipboard"
                      >
                        {copiedId === msg.id ? <CheckCheck size={14} className="text-success" /> : <Copy size={14} />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {error && (
              <div className="chat-message-row system">
                <div className="message-error-bubble">
                  {error}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
