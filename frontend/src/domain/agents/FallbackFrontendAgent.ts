import { BaseFrontendAgent } from './BaseFrontendAgent';
import type { MessagePart } from '../models/Message';
import { generateId } from '../../utils/id';

export class FallbackFrontendAgent extends BaseFrontendAgent {
  formatUserMessageParts(payload: Record<string, any>): MessagePart[] {
    const parts: MessagePart[] = [];
    let textContent = '';
    const allInputImages: string[] = [];

    // Fallback logic: blindly iterate and group text vs images
    Object.entries(payload).forEach(([key, val]) => {
      if (typeof val === 'string' && val.trim() !== '') {
        textContent += (textContent ? '\n\n' : '') + `**${key}**: ${val}`;
      } else if (Array.isArray(val) && val.length > 0) {
        allInputImages.push(...val);
      }
    });

    if (textContent) {
      parts.push({
        id: generateId('fallback-txt'),
        type: 'text',
        text: textContent
      });
    }

    if (allInputImages.length > 0) {
      parts.push({
        id: generateId('fallback-gallery'),
        type: 'gallery',
        urls: allInputImages
      });
    }

    return parts;
  }
}
