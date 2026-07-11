import React from 'react';
import { Textarea, Input } from '../../ui/Input';
import { ImageUploadZone } from '../../ui/ImageUploadZone';
import type { FieldSchema } from '../../../domain/models/Agent';

interface DynamicFieldRendererProps {
  fieldName: string;
  schema: FieldSchema;
  value: any;
  onChange: (value: any) => void;
}

export function DynamicFieldRenderer({
  fieldName,
  schema,
  value,
  onChange
}: DynamicFieldRendererProps) {
  if (schema.type === 'text') {
    if (schema.uiType === 'input') {
      return (
        <div className="form-field-group">
          <Input 
            label={schema.label}
            placeholder={schema.placeholder || "Enter text..."}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={schema.required}
            fullWidth
          />
        </div>
      );
    }
    
    return (
      <div className="form-field-group">
        <Textarea 
          label={schema.label}
          placeholder={schema.placeholder || "Type your message here..."}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          required={schema.required}
          fullWidth
        />
      </div>
    );
  }

  if (schema.type === 'image') {
    const max = schema.maxCount || 1;
    const images: string[] = value || [];
    
    return (
      <div className="form-field-group">
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
      </div>
    );
  }

  return null;
}
