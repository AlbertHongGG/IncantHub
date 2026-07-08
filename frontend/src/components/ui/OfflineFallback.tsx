import React, { useState } from 'react';
import { usePromptStore } from '../../store/usePromptStore';
import { AlertCircle, RefreshCw } from 'lucide-react';
import './OfflineFallback.css';

export function OfflineFallback() {
  const fetchAgents = usePromptStore(state => state.fetchAgents);
  const [reconnecting, setReconnecting] = useState(false);

  const handleReconnect = async () => {
    setReconnecting(true);
    await fetchAgents();
    setReconnecting(false);
  };

  return (
    <div className="offline-fallback-portal animate-fade-in-up">
      <div className="offline-card">
        <div className="offline-icon-glow">
          <AlertCircle size={28} />
        </div>
        
        <div className="offline-message">
          <h2>Unable to Connect to IncantHub Engine</h2>
          <p>The application cannot establish a link to the backend service running on port 3001.</p>
        </div>

        <div className="offline-troubleshoot">
          <h4>How to start the engine:</h4>
          <div className="code-block-slate">
            <code>
              cd backend<br />
              npm run dev
            </code>
          </div>
        </div>

        <button 
          className={`reconnect-action-btn ${reconnecting ? 'loading' : ''}`}
          onClick={handleReconnect}
          disabled={reconnecting}
        >
          <RefreshCw size={13} className={reconnecting ? 'spin' : ''} />
          <span>{reconnecting ? 'Connecting...' : 'Retry Connection'}</span>
        </button>
      </div>
    </div>
  );
}
