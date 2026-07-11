import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import type { Components } from 'react-markdown';

import './MarkdownRenderer.css';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Define custom component mappings
  const components: Components = {
    // 1. Highlight Inline Code
    code({ node, inline, className, children, ...props }) {
      // If it's inline code, apply the highlight styling
      if (inline) {
        return (
          <code className="md-inline-code" {...props}>
            {children}
          </code>
        );
      }
      
      // Block code snippet - let pre handle it
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    
    // 2. Custom Separator (HR)
    hr({ node, ...props }) {
      return <hr className="md-divider" {...props} />;
    },

    // 3. Typography Overrides
    h1({ node, children, ...props }) {
      return <h1 className="md-h1" {...props}>{children}</h1>;
    },
    h2({ node, children, ...props }) {
      return <h2 className="md-h2" {...props}>{children}</h2>;
    },
    h3({ node, children, ...props }) {
      return <h3 className="md-h3" {...props}>{children}</h3>;
    },
    h4({ node, children, ...props }) {
      return <h4 className="md-h4" {...props}>{children}</h4>;
    },
    h5({ node, children, ...props }) {
      return <h5 className="md-h5" {...props}>{children}</h5>;
    },
    h6({ node, children, ...props }) {
      return <h6 className="md-h6" {...props}>{children}</h6>;
    }
  };

  return (
    <div className="premium-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
