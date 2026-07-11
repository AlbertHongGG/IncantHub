import { BaseFrontendAgent } from './BaseFrontendAgent';
import type { MessagePart } from '../models/Message';
import { generateId } from '../../utils/id';

export class UniversalFrontendAgent extends BaseFrontendAgent {
  formatUserMessageParts(payload: Record<string, any>): MessagePart[] {
    const parts: MessagePart[] = [];
    let textContent = '';
    const allInputImages: string[] = [];

    Object.entries(payload).forEach(([key, val]) => {
      const fieldSchema = this.metadata.inputSchema?.[key];
      const label = fieldSchema?.label || key;

      if (typeof val === 'string' && val.trim() !== '') {
        textContent += (textContent ? '\n\n' : '') + `**${label}**:\n${val}`;
      } else if (Array.isArray(val) && val.length > 0) {
        allInputImages.push(...val);
      }
    });

    if (textContent) {
      parts.push({
        id: generateId('universal-txt'),
        type: 'text',
        text: textContent
      });
    }

    if (allInputImages.length > 0) {
      parts.push({
        id: generateId('universal-gallery'),
        type: 'gallery',
        urls: allInputImages
      });
    }

    return parts;
  }
}
