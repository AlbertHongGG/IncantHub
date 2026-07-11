import React from 'react';
import { Textarea } from '../../ui/Input';
import { ImageUploadZone } from '../../ui/ImageUploadZone';
import type { FieldSchema } from '../../../domain/models/Agent';

interface DynamicFieldRendererProps {
  fieldName: string;
  schema: FieldSchema;
  value: any;
  onChange: (value: any) => void;
  isLastField?: boolean;
  submitButton?: React.ReactNode;
}

export function DynamicFieldRenderer({
  fieldName,
  schema,
  value,
  onChange,
  isLastField,
  submitButton
}: DynamicFieldRendererProps) {
  if (schema.type === 'text') {
    return (
      <div className="form-field-group">
        <Textarea 
          label={schema.label}
          placeholder="Type your message here..."
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          required={schema.required}
          fullWidth
          rightElement={isLastField ? submitButton : undefined}
        />
      </div>
    );
  }

  if (schema.type === 'image') {
    const max = schema.maxCount || 1;
    const images: string[] = value || [];
    
    return (
      <React.Fragment>
        <ImageUploadZone 
          label={schema.label}
          maxCount={max}
          images={images}
          onUpload={(base64Images) => {
            const combined = [...images, ...base64Images].slice(0, max);
            onChange(combined);
          }}
          onRemove={(idx) => {
            const filtered = images.filter((_, i) => i !== idx);
            onChange(filtered.length > 0 ? filtered : undefined);
          }}
        />
        {isLastField && submitButton && (
          <div className="standalone-send-actions" style={{ marginTop: 'var(--space-3)', display: 'flex', justifyContent: 'flex-end' }}>
            {submitButton}
          </div>
        )}
      </React.Fragment>
    );
  }

  return null;
}
