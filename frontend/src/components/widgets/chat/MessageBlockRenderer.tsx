import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, CheckCheck, Loader2 } from 'lucide-react';
import { Bubble } from '../../ui/Bubble';
import { GalleryGrid } from '../../ui/GalleryGrid';
import type { MessagePart } from '../../../domain/models/Message';

interface MessageBlockRendererProps {
  part: MessagePart;
}

export function MessageBlockRenderer({ part }: MessageBlockRendererProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (part.type === 'loading') {
    return (
      <Bubble variant="ghost" className="assistant-loading-bubble">
        <Loader2 className="spinner text-accent" size={24} />
      </Bubble>
    );
  }

  if (part.type === 'text') {
    const copyAction = (
      <button 
        className="icon-btn-small" 
        onClick={() => handleCopy(part.text)}
        title="Copy text"
      >
        {copied ? <CheckCheck size={14} className="text-success" /> : <Copy size={14} />}
      </button>
    );

    return (
      <Bubble variant="secondary" actions={copyAction}>
        <div className="markdown-prose">
          <ReactMarkdown>
            {part.text}
          </ReactMarkdown>
        </div>
      </Bubble>
    );
  }

  if (part.type === 'image') {
    return (
      <Bubble variant="ghost">
        <div className="assistant-single-image">
          <img src={part.url} alt="Generated content" />
        </div>
      </Bubble>
    );
  }

  if (part.type === 'gallery') {
    return (
      <Bubble variant="ghost">
        <div className="assistant-gallery">
          <GalleryGrid urls={part.urls} />
        </div>
      </Bubble>
    );
  }

  if (part.type === 'error') {
    return (
      <Bubble variant="system">
        <p>Something went wrong processing this part.</p>
      </Bubble>
    );
  }

  return null;
}
