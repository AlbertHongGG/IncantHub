import React from 'react';
import './SplitViewLayout.css';

interface SplitViewLayoutProps {
  leftPane: React.ReactNode;
  rightPane: React.ReactNode;
  leftWidth?: string;
}

export function SplitViewLayout({ leftPane, rightPane, leftWidth = '340px' }: SplitViewLayoutProps) {
  return (
    <div className="split-view-layout animate-fade-in">
      <aside className="split-view-left" style={{ flex: `0 0 ${leftWidth}` }}>
        {leftPane}
      </aside>
      <main className="split-view-right">
        {rightPane}
      </main>
    </div>
  );
}
