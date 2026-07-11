import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useAgentStore } from '../../store/useAgentStore';
import { Button } from './Button';
import './OfflineFallback.css';

export function OfflineFallback() {
  const fetchAgents = useAgentStore(state => state.fetchAgents);
  const isLoading = useAgentStore(state => state.isLoading);

  return (
    <div className="offline-portal animate-fade-in">
      <div className="offline-content">
        <div className="offline-icon-wrapper">
          <WifiOff size={32} strokeWidth={1.5} />
        </div>
        <h2 className="offline-title">Connection Lost</h2>
        <p className="offline-desc">
          Unable to reach the core engine. Please ensure the backend server is running on port 3001.
        </p>
        <div className="offline-action">
          <Button 
            variant="primary" 
            size="md" 
            onClick={fetchAgents} 
            isLoading={isLoading}
          >
            {!isLoading && <RefreshCw size={14} />}
            Reconnect
          </Button>
        </div>
      </div>
    </div>
  );
}
