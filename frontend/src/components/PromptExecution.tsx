import React, { useState, useEffect } from 'react';
import { usePromptStore } from '../store/usePromptStore';
import { Play, Loader2, ImagePlus } from 'lucide-react';
import './PromptExecution.css';

export function PromptExecution() {
  const agents = usePromptStore(state => state.agents);
  const selectedAgentId = usePromptStore(state => state.selectedAgentId);
  const executeAgent = usePromptStore(state => state.executeAgent);
  const isExecuting = usePromptStore(state => state.isExecuting);
  const executionResult = usePromptStore(state => state.executionResult);
  const error = usePromptStore(state => state.error);

  const [payload, setPayload] = useState<Record<string, any>>({});
  
  const selectedAgent = agents.find(p => p.id === selectedAgentId);

  useEffect(() => {
    setPayload({});
  }, [selectedAgentId]);

  if (!selectedAgent) {
    return (
      <div className="execution-panel empty animate-fade-in">
        <div className="placeholder">
          Select an agent from the list to start generating.
        </div>
      </div>
    );
  }

  const handleInputChange = (fieldName: string, value: any) => {
    setPayload(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleExecute = () => {
    executeAgent(payload);
  };

  const renderField = (fieldName: string, schema: any) => {
    if (schema.type === 'text') {
      return (
        <div className="form-group" key={fieldName}>
          <label>{schema.label} {schema.required && <span className="required">*</span>}</label>
          <textarea 
            placeholder={`Enter ${schema.label.toLowerCase()}...`}
            value={payload[fieldName] || ''}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            rows={3}
          />
        </div>
      );
    }
    if (schema.type === 'image') {
      return (
        <div className="form-group" key={fieldName}>
          <label>{schema.label} {schema.required && <span className="required">*</span>} {schema.maxCount && `(Max: ${schema.maxCount})`}</label>
          <div className="image-upload-mock" onClick={() => handleInputChange(fieldName, ['mock-base64-string'])}>
            <ImagePlus size={18} />
            <span>Upload {schema.label} (Mock UI)</span>
            {payload[fieldName] && <div className="mock-file-badge" style={{marginLeft: '10px', color: '#10b981', fontWeight: 'bold'}}>✓ File Selected</div>}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="execution-panel animate-fade-in">
      <div className="panel-header">
        <h3>{selectedAgent.name}</h3>
        <span className="badge">{selectedAgent.category}</span>
      </div>
      
      <div className="input-section">
        {Object.entries(selectedAgent.inputSchema).map(([fieldName, schema]) => 
          renderField(fieldName, schema)
        )}

        <button 
          className="execute-button" 
          onClick={handleExecute}
          disabled={isExecuting}
        >
          {isExecuting ? <Loader2 className="spin" size={18} /> : <Play size={18} />}
          {isExecuting ? 'Generating...' : 'Generate'}
        </button>
      </div>

      <div className="result-section">
        <label>Result</label>
        <div className={`result-box ${!executionResult && !error ? 'empty' : ''}`}>
          {error && <div className="error-message">{error}</div>}
          {!error && executionResult && <div className="result-content">{executionResult}</div>}
          {!error && !executionResult && <span className="placeholder-text">Generated content will appear here...</span>}
        </div>
      </div>
    </div>
  );
}
