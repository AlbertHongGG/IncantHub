import React, { useState } from 'react';
import { Download, Loader2, Check } from 'lucide-react';

interface DownloadButtonProps {
  url: string;
  filename?: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ url, filename = 'generated_image.png' }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (status === 'loading') return;

    try {
      setStatus('loading');
      // Fetch the image to trigger browser download avoiding CORS/new tab issues
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to download image:', error);
      setStatus('idle');
    }
  };

  return (
    <button onClick={handleDownload} title="Download image">
      {status === 'idle' && <Download size={16} />}
      {status === 'loading' && <Loader2 size={16} className="animate-spin" />}
      {status === 'success' && <Check size={16} className="text-success" />}
    </button>
  );
};
