import React from 'react';
import { usePromptStore } from '../store/usePromptStore';
import { Sparkles, AlertCircle, RefreshCw, MoreVertical } from 'lucide-react';
import { NotificationContainer } from './ui/Notification';
import { Dropdown } from './ui/Dropdown';
import './Layout.css';

export function Layout({ children }: { children: React.ReactNode }) {
  const isServerOffline = usePromptStore(state => state.isServerOffline);
  const fetchAgents = usePromptStore(state => state.fetchAgents);
  const setCategory = usePromptStore(state => state.setCategory);

  return (
    <div className="layout-root">
      {/* Mount global toasts container */}
      <NotificationContainer />

      {/* Clean Top Header */}
      <header className="main-header">
        <div className="header-logo">
          <Sparkles size={18} className="header-logo-icon" />
          <span>IncantHub</span>
        </div>
        <div className="header-status">
          <Dropdown>
            <Dropdown.Trigger>
              <button type="button" className="header-menu-trigger">
                <MoreVertical size={16} />
              </button>
            </Dropdown.Trigger>
            <Dropdown.Menu align="right">
              <Dropdown.Item onClick={() => setCategory('text')}>Text Engine Portal</Dropdown.Item>
              <Dropdown.Item onClick={() => setCategory('image')}>Image Engine Portal</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

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
