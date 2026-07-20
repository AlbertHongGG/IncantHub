import React, { useEffect } from 'react';
import { usePluginStore } from '../store/usePluginStore';
import { useUIStore } from '../store/useUIStore';
import { X, Puzzle } from 'lucide-react';
import '../styles/PluginModal.css';

export const PluginModal: React.FC = () => {
  const { plugins, isLoading, error, loadPlugins, togglePlugin } = usePluginStore();
  const { isPluginModalOpen, closePluginModal } = useUIStore();

  useEffect(() => {
    if (isPluginModalOpen) {
      loadPlugins();
    }
  }, [isPluginModalOpen, loadPlugins]);

  if (!isPluginModalOpen) return null;

  return (
    <div className="plugin-modal-overlay" onClick={closePluginModal}>
      <div className="plugin-modal-container" onClick={e => e.stopPropagation()}>
        <div className="plugin-modal-header">
          <div className="plugin-modal-title-group">
            <div className="plugin-modal-icon-wrapper">
              <Puzzle size={18} />
            </div>
            <h2>Plugins</h2>
          </div>
          <button className="plugin-modal-close" onClick={closePluginModal}>
            <X size={20} />
          </button>
        </div>

        <div className="plugin-modal-body">
          {isLoading && plugins.length === 0 ? (
            <div className="plugin-modal-state plugin-loading">
              <div className="spinner"></div>
              <span>Syncing plugins...</span>
            </div>
          ) : error ? (
            <div className="plugin-modal-state plugin-error">
              <span>{error}</span>
            </div>
          ) : plugins.length === 0 ? (
            <div className="plugin-modal-state plugin-empty">
              <span>No plugins found.</span>
            </div>
          ) : (
            <div className="settings-group">
              {plugins.map(plugin => (
                <div key={plugin.id} className="settings-row">
                  <div className="settings-row-info">
                    <h3 className="plugin-name">{plugin.name}</h3>
                  </div>
                  <div className="settings-row-action">
                    <label className="apple-switch">
                      <input 
                        type="checkbox" 
                        checked={plugin.isEnabled} 
                        onChange={(e) => togglePlugin(plugin.id, e.target.checked)} 
                      />
                      <span className="apple-slider"></span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
