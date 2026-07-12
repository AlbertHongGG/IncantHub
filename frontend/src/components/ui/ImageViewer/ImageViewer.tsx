import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import './ImageViewer.css';

interface ImageViewerProps {
  src: string;
  alt?: string;
  actions?: React.ReactNode;
  enableLightbox?: boolean;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ 
  src, 
  alt = 'Image', 
  actions,
  enableLightbox = true
}) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleOpenLightbox = () => {
    if (enableLightbox) {
      setIsLightboxOpen(true);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleCloseLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLightboxOpen(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const zoomSensitivity = 0.002;
    const delta = -e.deltaY * zoomSensitivity;
    setScale(prev => Math.min(Math.max(0.5, prev + delta), 5));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Global mouse up to catch drags that leave the image area
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      return () => window.removeEventListener('mouseup', handleMouseUp);
    }
  }, [isDragging]);

  return (
    <>
      <div className={`image-viewer-container ${enableLightbox ? 'has-lightbox' : ''}`}>
        <img 
          src={src} 
          alt={alt} 
          className="image-viewer-image" 
          onClick={handleOpenLightbox}
        />
        
        {/* Toolbar Overlay */}
        <div className="image-viewer-toolbar">
          {actions}
        </div>
      </div>

      {/* Lightbox Modal rendered via Portal to escape stacking contexts */}
      {isLightboxOpen && createPortal(
        <div 
          className="lightbox-overlay" 
          onClick={handleCloseLightbox}
          onWheel={handleWheel}
          onMouseMove={handleMouseMove}
        >
          <div className="lightbox-content">
            <img 
              src={src} 
              alt={alt} 
              className={`lightbox-image ${isDragging ? 'dragging' : ''}`} 
              style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }}
              onMouseDown={handleMouseDown}
              onClick={(e) => e.stopPropagation()}
              draggable={false}
            />
          </div>
          
          <button className="lightbox-close" onClick={handleCloseLightbox} title="Close">
            <X size={24} />
          </button>
        </div>,
        document.body
      )}
    </>
  );
};
