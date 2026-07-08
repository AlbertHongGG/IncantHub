import React from 'react';
import { usePromptStore } from '../store/usePromptStore';
import { Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import './Layout.css';

export function Layout({ children }: { children: React.ReactNode }) {
  const isServerOffline = usePromptStore(state => state.isServerOffline);
  const fetchAgents = usePromptStore(state => state.fetchAgents);

  return (
    <div className="layout-root">
      {/* Offline Banner */}
      {isServerOffline && (
        <div className="offline-banner">
          <div className="offline-banner-content">
            <AlertCircle size={16} />
            <span>Backend server is offline. Please run <code>npm run dev</code> in the backend directory.</span>
          </div>
          <button className="reconnect-btn" onClick={fetchAgents}>
            <RefreshCw size={12} />
            <span>Reconnect</span>
          </button>
        </div>
      )}

      {/* Clean Top Header */}
      <header className="main-header">
        <div className="header-logo">
          <Sparkles size={18} className="header-logo-icon" />
          <span>IncantHub</span>
        </div>
        <div className="header-status">
          <span className={`status-dot ${isServerOffline ? 'offline' : 'online'}`} />
          <span className="status-text">{isServerOffline ? 'Offline' : 'Connected'}</span>
        </div>
      </header>

      {/* Content Area */}
      <main className="main-container">
        {children}
      </main>
    </div>
  );
}
