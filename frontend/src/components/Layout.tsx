import React from 'react';
import { usePromptStore } from '../store/usePromptStore';
import { Type, Image as ImageIcon, Sparkles } from 'lucide-react';
import './Layout.css';

export function Layout({ children }: { children: React.ReactNode }) {
  const { activeCategory, setCategory } = usePromptStore();

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="logo">
          <Sparkles className="logo-icon" size={24} />
          <h2>IncantHub</h2>
        </div>
        
        <nav className="nav-menu">
          <p className="nav-title">Categories</p>
          <button 
            className={`nav-item ${activeCategory === 'text' ? 'active' : ''}`}
            onClick={() => setCategory('text')}
          >
            <Type size={18} />
            <span>Text Prompts</span>
          </button>
          <button 
            className={`nav-item ${activeCategory === 'image' ? 'active' : ''}`}
            onClick={() => setCategory('image')}
          >
            <ImageIcon size={18} />
            <span>Image Prompts</span>
          </button>
        </nav>
      </aside>
      
      <main className="main-content">
        <header className="header">
          <h1>Welcome to IncantHub</h1>
          <p className="subtitle">Select a prompt template and generate amazing content.</p>
        </header>
        <div className="content-area">
          {children}
        </div>
      </main>
    </div>
  );
}
