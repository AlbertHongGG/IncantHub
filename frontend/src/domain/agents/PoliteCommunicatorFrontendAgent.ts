import { BaseFrontendAgent } from './BaseFrontendAgent';
import type { MessagePart } from '../models/Message';
import { generateId } from '../../utils/id';

export class PoliteCommunicatorFrontendAgent extends BaseFrontendAgent {
  formatUserMessageParts(payload: Record<string, any>): MessagePart[] {
    const parts: MessagePart[] = [];
    let text = '';
    
    if (payload.raw_message && typeof payload.raw_message === 'string' && payload.raw_message.trim() !== '') {
      text += `**Original Message:**\n${payload.raw_message}`;
    }
    
    if (payload.audience && typeof payload.audience === 'string' && payload.audience.trim() !== '') {
      text += `\n\n**Target Audience:**\n${payload.audience}`;
    }

    if (text !== '') {
      parts.push({
        id: generateId('polite-txt'),
        type: 'text',
        text: text
      });
    }

    return parts;
  }
}
