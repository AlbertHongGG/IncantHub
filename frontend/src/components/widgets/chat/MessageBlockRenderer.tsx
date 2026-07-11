import React from 'react';
import { Copy, CheckCheck, Loader2 } from 'lucide-react';
import { Bubble } from '../../ui/Bubble';
import { GalleryGrid } from '../../ui/GalleryGrid';
import { TypingIndicator } from '../../ui/TypingIndicator';
import type { MessagePart } from '../../../domain/models/Message';
import { MarkdownRenderer } from './MarkdownRenderer';

interface MessageBlockRendererProps {
  part: MessagePart;
}

export const MessageBlockRenderer: React.FC<MessageBlockRendererProps> = ({ part }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (part.type === 'text' && part.text) {
      navigator.clipboard.writeText(part.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyAction = (
    <button 
      className="icon-btn-small" 
      onClick={handleCopy}
      title="Copy text"
    >
      {copied ? <CheckCheck size={14} className="text-success" /> : <Copy size={14} />}
    </button>
  );

  if (part.type === 'text') {
    return (
      <Bubble variant="secondary" actions={copyAction}>
        <MarkdownRenderer content={part.text || ''} />
      </Bubble>
    );
  }

  if (part.type === 'image' && part.url) {
    return (
      <div className="message-image-container">
        <img src={part.url} alt="Assistant output" className="message-image" />
      </div>
    );
  }

  if (part.type === 'gallery' && part.urls) {
    return (
      <div className="message-gallery-container">
        <GalleryGrid images={part.urls} />
      </div>
    );
  }

  if (part.type === 'loading') {
    return (
      <Bubble variant="secondary" className="assistant-loading-bubble">
        <TypingIndicator />
      </Bubble>
    );
  }

  if (part.type === 'error') {
    return (
      <Bubble variant="error">
        <div className="error-content">
          <span className="error-icon">⚠️</span>
          <span>{part.text || 'An error occurred.'}</span>
        </div>
      </Bubble>
    );
  }

  return null;
};
