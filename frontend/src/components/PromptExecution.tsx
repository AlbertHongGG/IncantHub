import React, { useState } from 'react';
import { usePromptStore } from '../store/usePromptStore';
import { Play, Loader2, ImagePlus } from 'lucide-react';
import './PromptExecution.css';

export function PromptExecution() {
  const { prompts, selectedPromptId, executePrompt, isExecuting, executionResult, error } = usePromptStore();
  const [userPrompt, setUserPrompt] = useState('');
  
  const selectedPrompt = prompts.find(p => p.id === selectedPromptId);

  if (!selectedPrompt) {
    return (
      <div className="execution-panel empty animate-fade-in">
        <div className="placeholder">
          Select a template from the list to start generating.
        </div>
      </div>
    );
  }

  const handleExecute = () => {
    if (!userPrompt.trim()) return;
    executePrompt(userPrompt);
  };

  return (
    <div className="execution-panel animate-fade-in">
      <div className="panel-header">
        <h3>{selectedPrompt.title}</h3>
        <span className="badge">{selectedPrompt.category}</span>
      </div>
      
      <div className="input-section">
        <label>Your Input</label>
        <textarea 
          placeholder="Enter your prompt here..."
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          rows={5}
        />
        
        {selectedPrompt.category === 'image' && (
          <div className="image-upload-mock">
            <ImagePlus size={18} />
            <span>Upload Image (Mock UI for now)</span>
          </div>
        )}

        <button 
          className="execute-button" 
          onClick={handleExecute}
          disabled={isExecuting || !userPrompt.trim()}
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
