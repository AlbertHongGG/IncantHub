import React, { useState, useEffect, useRef } from 'react';
import { usePromptStore } from '../store/usePromptStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { Tooltip } from './ui/Tooltip';
import { Button } from './ui/Button';
import { Input, Textarea } from './ui/Input';
import { Play, UploadCloud, X, Copy, ChevronLeft, LayoutPanelLeft, Send, Loader2 } from 'lucide-react';
import './PromptExecution.css';

export function PromptExecution() {
  const { 
    agents, 
    selectedAgentId, 
    selectAgent, 
    executeAgent, 
    isExecuting, 
    executionResult, 
    error,
    isServerOffline
  } = usePromptStore();

  const addNotification = useNotificationStore(state => state.addNotification);
  
  const [payload, setPayload] = useState<Record<string, any>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const selectedAgent = agents.find(p => p.id === selectedAgentId);

  useEffect(() => {
    setPayload({});
  }, [selectedAgentId]);

  useEffect(() => {
    if (error) addNotification(error, 'error');
  }, [error, addNotification]);

  if (!selectedAgent) return null;

  const handleInputChange = (fieldName: string, value: any) => {
    setPayload(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleFileChange = (fieldName: string, files: FileList | null, maxCount = 1) => {
    if (!files || files.length === 0) return;
    
    const newFilesArray = Array.from(files).slice(0, maxCount);
    Promise.all(
      newFilesArray.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    ).then(base64Strings => {
      const currentVal = payload[fieldName] || [];
      const combined = [...currentVal, ...base64Strings].slice(0, maxCount);
      handleInputChange(fieldName, combined);
    });
  };

  const removeImage = (fieldName: string, indexToRemove: number) => {
    const currentVal: string[] = payload[fieldName] || [];
    const filtered = currentVal.filter((_, idx) => idx !== indexToRemove);
    handleInputChange(fieldName, filtered.length > 0 ? filtered : undefined);
  };

  const handleExecute = () => {
    if (isServerOffline) {
      addNotification("Server is offline. Cannot execute task.", "error");
      return;
    }
    executeAgent(payload);
  };

  const handleCopy = () => {
    if (executionResult?.content) {
      navigator.clipboard.writeText(executionResult.content);
      addNotification('Output copied to clipboard.', 'success');
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
        <div className="form-field-group" key={fieldName}>
          <div className="field-header">
            <span className="field-label">{schema.label}</span>
            <span className="field-counter">{images.length}/{max}</span>
          </div>

          <div className="image-upload-zone">
            {images.length < max && (
              <div 
                className="upload-trigger"
                onClick={() => fileInputRefs.current[fieldName]?.click()}
              >
                <UploadCloud size={20} className="upload-icon" />
                <input 
                  type="file"
                  multiple={max > 1}
                  accept="image/*"
                  ref={el => fileInputRefs.current[fieldName] = el}
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileChange(fieldName, e.target.files, max)}
                />
              </div>
            )}

            {images.length > 0 && (
              <div className="image-previews-grid">
                {images.map((imgBase64, idx) => (
                  <div key={idx} className="preview-item">
                    <img src={imgBase64} alt={`Preview ${idx}`} />
                    <button 
                      type="button" 
                      className="preview-remove-btn"
                      onClick={() => removeImage(fieldName, idx)}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* If the last field is an image field, we put the send button below it */}
          {isLast && (
             <div className="standalone-send-actions">
               {sendButton}
             </div>
          )}
        </div>
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

        {/* Right Panel: Canvas Output */}
        <section className="panel-canvas">
          <div className="canvas-header">
            <div className="canvas-tab active">
              <LayoutPanelLeft size={14} />
              Output Console
            </div>
            {executionResult && (
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                <Copy size={14} />
                Copy
              </Button>
            )}
          </div>
          
          <div className="canvas-body">
            {!isExecuting && !executionResult && !error && (
              <div className="canvas-placeholder">
                Configuration pending execution.
              </div>
            )}

            {isExecuting && (
              <div className="canvas-loading">
                <div className="skeleton-block header-skeleton animate-pulse" />
                <div className="skeleton-block text-skeleton animate-pulse" />
                <div className="skeleton-block text-skeleton animate-pulse w-80" />
                <div className="skeleton-block text-skeleton animate-pulse w-60" />
              </div>
            )}

            {!isExecuting && executionResult && (
              <div className="canvas-result animate-fade-in-up">
                {(executionResult.type === 'image' || executionResult.type === 'mixed') && executionResult.images && executionResult.images.length > 0 && (
                  <div className="result-gallery">
                    {executionResult.images.map((imgUrl, idx) => (
                      <div key={idx} className="result-image-box">
                        <img src={imgUrl} alt={`Generated output ${idx + 1}`} />
                      </div>
                    ))}
                  </div>
                )}
                
                {executionResult.content && (
                  <div className="result-text">
                    {executionResult.content}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
