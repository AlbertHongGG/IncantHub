import React, { useEffect, useState } from 'react';
import { usePluginStore } from '../store/usePluginStore';
import '../styles/PluginSettings.css';

export const PluginSettings: React.FC = () => {
  const { plugins, isLoading, error, loadPlugins, togglePlugin } = usePluginStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadPlugins();
    }
  }, [isOpen, loadPlugins]);

  return (
    <>
      <button 
        className="plugin-settings-trigger"
        onClick={() => setIsOpen(true)}
      >
        <span className="icon">⚙️</span> Plugins
      </button>

      {isOpen && (
        <div className="plugin-settings-overlay" onClick={() => setIsOpen(false)}>
          <div className="plugin-settings-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Plugin Settings</h2>
              <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
            </div>
            
            <div className="modal-content">
              {isLoading && plugins.length === 0 ? (
                <div className="loading-state">Loading plugins...</div>
              ) : error ? (
                <div className="error-state">{error}</div>
              ) : plugins.length === 0 ? (
                <div className="empty-state">No plugins available.</div>
              ) : (
                <ul className="plugin-list">
                  {plugins.map(plugin => (
                    <li key={plugin.id} className="plugin-item">
                      <div className="plugin-info">
                        <h3>{plugin.name}</h3>
                        <p>{plugin.description}</p>
                      </div>
                      <div className="plugin-action">
                        <label className="switch">
                          <input 
                            type="checkbox" 
                            checked={plugin.isEnabled} 
                            onChange={(e) => togglePlugin(plugin.id, e.target.checked)} 
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
