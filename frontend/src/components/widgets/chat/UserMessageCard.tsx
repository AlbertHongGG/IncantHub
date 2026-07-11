import React from 'react';
import { Bubble } from '../../ui/Bubble';
import { GalleryGrid } from '../../ui/GalleryGrid';
import type { ChatMessage } from '../../../domain/models/Message';
import './UserMessageCard.css';

interface UserMessageCardProps {
  message: ChatMessage;
}

export function UserMessageCard({ message }: UserMessageCardProps) {
  // A user message contains Text parts and possibly a Gallery part
  return (
    <div className="user-message-card animate-fade-in-up">
      <div className="user-message-content">
        {message.parts.map((part) => {
          if (part.type === 'text') {
            return (
              <Bubble key={part.id} variant="primary">
                <div className="markdown-prose user-prose">
                  {/* Simplistic render for now, or use ReactMarkdown if needed */}
                  {part.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < part.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </Bubble>
            );
          }
          if (part.type === 'gallery') {
            return (
              <div key={part.id} className="user-gallery-wrapper">
                <GalleryGrid urls={part.urls} />
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
