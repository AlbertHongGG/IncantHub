import React from 'react';
import { Sparkles } from 'lucide-react';
import type { ChatMessage } from '../../domain/models/Message';
import { MessageBlockRenderer } from './MessageBlockRenderer';
import './AssistantMessageCard.css';

interface AssistantMessageCardProps {
  message: ChatMessage;
}

export function AssistantMessageCard({ message }: AssistantMessageCardProps) {
  return (
    <div className={`assistant-message-card animate-fade-in-up ${message.isGenerating ? 'generating' : ''}`}>
      <div className="assistant-avatar">
        <Sparkles size={16} />
      </div>
      <div className="assistant-message-content">
        {message.parts.map((part) => (
          <MessageBlockRenderer key={part.id} part={part} />
        ))}
      </div>
    </div>
  );
}
