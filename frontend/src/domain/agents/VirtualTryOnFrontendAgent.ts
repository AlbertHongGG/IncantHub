import { BaseFrontendAgent } from './BaseFrontendAgent';
import type { MessagePart } from '../models/Message';
import { generateId } from '../../utils/id';

export class VirtualTryOnFrontendAgent extends BaseFrontendAgent {
  formatUserMessageParts(payload: Record<string, any>): MessagePart[] {
    const parts: MessagePart[] = [];
    const allImages: string[] = [];

    // Specific logic for VTON: show images first
    if (payload.humanImage && Array.isArray(payload.humanImage)) {
      allImages.push(...payload.humanImage);
    }
    if (payload.garmentImage && Array.isArray(payload.garmentImage)) {
      allImages.push(...payload.garmentImage);
    }

    if (allImages.length > 0) {
      parts.push({
        id: generateId('vton-gallery'),
        type: 'gallery',
        urls: allImages
      });
    }

    if (payload.prompt && typeof payload.prompt === 'string' && payload.prompt.trim() !== '') {
      parts.push({
        id: generateId('vton-txt'),
        type: 'text',
        text: `**Style Prompt**: ${payload.prompt}`
      });
    }

    return parts;
  }
}
