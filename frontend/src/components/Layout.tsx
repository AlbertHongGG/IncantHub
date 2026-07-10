import React from 'react';
import { usePromptStore } from '../store/usePromptStore';
import { Hexagon, MoreVertical, LayoutGrid, Image as ImageIcon, Circle } from 'lucide-react';
import { NotificationContainer } from './ui/Notification';
import { Dropdown } from './ui/Dropdown';
import './Layout.css';

export function Layout({ children }: { children: React.ReactNode }) {
  const isServerOffline = usePromptStore(state => state.isServerOffline);
  const setCategory = usePromptStore(state => state.setCategory);

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
          <div className="status-indicator" title={isServerOffline ? 'Server Offline' : 'Server Online'}>
            <Circle size={10} className={isServerOffline ? 'status-offline' : 'status-online'} fill="currentColor" />
          </div>

          <Dropdown>
            <Dropdown.Trigger>
              <button type="button" className="header-menu-btn">
                <MoreVertical size={16} />
              </button>
            </Dropdown.Trigger>
            <Dropdown.Menu align="right">
              <Dropdown.Item icon={<LayoutGrid size={14} />} onClick={() => setCategory('text')}>
                Text Engines
              </Dropdown.Item>
              <Dropdown.Item icon={<ImageIcon size={14} />} onClick={() => setCategory('image')}>
                Image Engines
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>

      <main className="global-main">
        {children}
      </main>
    </div>
  );
}
