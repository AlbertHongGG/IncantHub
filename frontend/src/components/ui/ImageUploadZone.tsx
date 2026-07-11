import React from 'react';
import { UploadCloud, X, Plus } from 'lucide-react';
import { useImageUpload } from '../../hooks/useImageUpload';
import './ImageUploadZone.css';

interface ImageUploadZoneProps {
  label: string;
  maxCount?: number;
  images: string[];
  onUpload: (base64Images: string[]) => void;
  onRemove: (index: number) => void;
}

export function ImageUploadZone({
  label,
  maxCount = 1,
  images,
  onUpload,
  onRemove
}: ImageUploadZoneProps) {
  const {
    isDragging,
    fileInputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    triggerUpload
  } = useImageUpload({ maxCount, onUpload });

  const hasImages = images.length > 0;
  const canUploadMore = images.length < maxCount;

  return (
    <div className="form-field-group">
      <div className="field-header">
        <span className="field-label">{label}</span>
        <span className="field-counter">{images.length}/{maxCount}</span>
      </div>

      <div 
        className="image-upload-zone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file"
          multiple={maxCount > 1}
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        <div className="image-previews-grid">
          {images.map((imgBase64, idx) => (
            <div key={idx} className="preview-item">
              <img src={imgBase64} alt={`Preview ${idx}`} />
              <button 
                type="button" 
                className="preview-remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(idx);
                }}
              >
                <X size={12} />
              </button>
            </div>
          ))}
          
          {canUploadMore && (
            <div 
              className={`upload-trigger compact ${isDragging ? 'dragging' : ''}`}
              onClick={triggerUpload}
              title="Upload image"
            >
              <Plus size={20} className="upload-icon" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
