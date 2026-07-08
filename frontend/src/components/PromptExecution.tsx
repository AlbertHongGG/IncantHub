import React, { useState, useEffect, useRef } from 'react';
import { usePromptStore } from '../store/usePromptStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { Tooltip } from './ui/Tooltip';
import { Play, Loader2, UploadCloud, X, Copy, Check, ChevronLeft, AlertTriangle } from 'lucide-react';
import './PromptExecution.css';

export function PromptExecution() {
  const agents = usePromptStore(state => state.agents);
  const selectedAgentId = usePromptStore(state => state.selectedAgentId);
  const selectAgent = usePromptStore(state => state.selectAgent);
  const executeAgent = usePromptStore(state => state.executeAgent);
  const isExecuting = usePromptStore(state => state.isExecuting);
  const executionResult = usePromptStore(state => state.executionResult);
  const error = usePromptStore(state => state.error);
  const isServerOffline = usePromptStore(state => state.isServerOffline);

  const addNotification = useNotificationStore(state => state.addNotification);

  const [payload, setPayload] = useState<Record<string, any>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const selectedAgent = agents.find(p => p.id === selectedAgentId);

  useEffect(() => {
    setPayload({});
  }, [selectedAgentId]);

  // Notifications for success and error states
  useEffect(() => {
    if (error) {
      addNotification(error, 'error');
    }
  }, [error, addNotification]);

  useEffect(() => {
    if (executionResult) {
      addNotification('Agent executed successfully!', 'success');
    }
  }, [executionResult, addNotification]);

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
    if (isServerOffline) return;
    executeAgent(payload);
  };

  const handleCopy = () => {
    if (executionResult) {
      navigator.clipboard.writeText(executionResult);
      addNotification('Copied output to clipboard!', 'success');
    }
  };

  const renderField = (fieldName: string, schema: any) => {
    if (schema.type === 'text') {
      return (
        <div className="workspace-input-field" key={fieldName}>
          <div className="field-label-row">
            <span className="field-title">{schema.label}</span>
            {schema.required && (
              <Tooltip content="This parameter is required to proceed" position="top">
                <span className="required-indicator">Required</span>
              </Tooltip>
            )}
          </div>
          <textarea 
            placeholder={`Enter ${schema.label.toLowerCase()} here...`}
            value={payload[fieldName] || ''}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            rows={5}
            className="workspace-textarea"
          />
        </div>
      );
    }

    if (schema.type === 'image') {
      const max = schema.maxCount || 1;
      const images: string[] = payload[fieldName] || [];
      
      return (
        <div className="workspace-input-field" key={fieldName}>
          <div className="field-label-row">
            <span className="field-title">{schema.label}</span>
            <span className="field-badge">{images.length}/{max} selected</span>
          </div>

          <div className="dropzone-area">
            {images.length < max && (
              <div 
                className="image-dropzone"
                onClick={() => fileInputRefs.current[fieldName]?.click()}
              >
                <UploadCloud size={16} className="dropzone-icon" />
                <span>Upload image reference</span>
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
              <div className="image-previews">
                {images.map((imgBase64, idx) => (
                  <div key={idx} className="preview-card">
                    <img src={imgBase64} alt={`Upload preview ${idx}`} />
                    <button 
                      type="button" 
                      className="preview-remove-trigger"
                      onClick={() => removeImage(fieldName, idx)}
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="workspace-canvas animate-fade-in-up">
      {/* Workspace Header (Breadcrumbs) */}
      <header className="workspace-breadcrumbs">
        <button className="back-to-catalog-btn" onClick={() => selectAgent(null)}>
          <ChevronLeft size={16} />
          <span>Templates</span>
        </button>
        <span className="breadcrumb-divider">/</span>
        <span className="active-breadcrumb">{selectedAgent.name}</span>
      </header>

      <div className="workspace-split-view">
        {/* Left Side: Parameters Form */}
        <div className="workspace-parameters-pane">
          <div className="pane-intro">
            <h2>Configuration</h2>
            <p>Define inputs and adjust options for execution.</p>
          </div>

          <div className="pane-form">
            {Object.entries(selectedAgent.inputSchema).map(([fieldName, schema]) => 
              renderField(fieldName, schema)
            )}
          </div>

          <div className="pane-actions">
            <button 
              className={`submit-btn ${isExecuting ? 'loading' : ''}`}
              onClick={handleExecute}
              disabled={isExecuting || isServerOffline}
            >
              {isExecuting ? (
                <>
                  <Loader2 className="btn-spinner" size={14} />
                  <span>Executing...</span>
                </>
              ) : isServerOffline ? (
                <>
                  <AlertTriangle size={14} />
                  <span>Server Offline</span>
                </>
              ) : (
                <>
                  <Play size={12} fill="currentColor" />
                  <span>Submit Task</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Output Visual Canvas */}
        <div className="workspace-output-pane">
          <div className="output-pane-header">
            <h3>Execution Output</h3>
            {executionResult && (
              <button className="workspace-copy-action" onClick={handleCopy}>
                {copied ? <Check size={12} className="copy-success-icon" /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>

          <div className="output-canvas-inner">
            {error && (
              <div className="canvas-error-state">
                <AlertTriangle size={24} className="error-state-icon" />
                <h4>Execution Failure</h4>
                <p>{error}</p>
              </div>
            )}
            
            {!error && executionResult && (
              <div className="canvas-success-markdown">
                {executionResult}
              </div>
            )}
            
            {!error && !executionResult && !isExecuting && (
              <div className="canvas-empty-state">
                <p>Submit the configuration to render visual outputs.</p>
              </div>
            )}

            {isExecuting && (
              <div className="canvas-loading-state">
                <div className="pulse-loader">
                  <div />
                  <div />
                  <div />
                </div>
                <p>Generating task response...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
