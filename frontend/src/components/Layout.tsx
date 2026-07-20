import React from 'react';
import { useAgentStore } from '../store/useAgentStore';
import { useUIStore } from '../store/useUIStore';
import { Hexagon, MoreVertical, LayoutGrid, Image as ImageIcon, Circle, Blocks } from 'lucide-react';
import { NotificationContainer } from './ui/Notification';
import { Dropdown } from './ui/Dropdown';
import './Layout.css';

export function Layout({ children }: { children: React.ReactNode }) {
  const isServerOffline = useAgentStore(state => state.isServerOffline);
  const openPluginModal = useUIStore(state => state.openPluginModal);

  return (
    <div className="layout-root">
      <NotificationContainer />

      <header className="global-header">
        <div className="header-brand">
          <div className="brand-logo-container">
            <Hexagon size={16} className="brand-icon" />
          </div>
          <span className="brand-text">IncantHub</span>
        </div>

        <div className="header-controls">
          <button 
            className="header-icon-button plugin-trigger" 
            onClick={openPluginModal}
            title="Plugins"
          >
            <Blocks size={18} />
          </button>
          
          <div className={`status-badge ${isServerOffline ? 'offline' : 'online'}`} title={isServerOffline ? 'Server Offline' : 'Server Connected'}>
            <div className="status-dot"></div>
            <span className="status-text">{isServerOffline ? 'Offline' : 'Connected'}</span>
          </div>
        </div>
      </header>

      <main className="global-main">
        {children}
      </main>
    </div>
  );
}
