import React from 'react';
import './GalleryGrid.css';

interface GalleryGridProps {
  urls: string[];
}

export function GalleryGrid({ urls }: GalleryGridProps) {
  if (!urls || urls.length === 0) return null;

  // Determine layout class based on number of images
  let layoutClass = 'layout-single';
  if (urls.length === 2) layoutClass = 'layout-duo';
  else if (urls.length === 3) layoutClass = 'layout-trio';
  else if (urls.length >= 4) layoutClass = 'layout-grid';

  return (
    <div className={`gallery-grid-container ${layoutClass}`}>
      {urls.slice(0, 4).map((url, idx) => (
        <div key={idx} className="gallery-item">
          <img src={url} alt={`Attachment ${idx + 1}`} />
          {urls.length > 4 && idx === 3 && (
            <div className="gallery-more-overlay">
              +{urls.length - 4}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
