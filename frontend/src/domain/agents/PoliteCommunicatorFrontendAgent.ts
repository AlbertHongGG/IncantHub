import { BaseFrontendAgent } from './BaseFrontendAgent';
import type { MessagePart } from '../models/Message';
import { generateId } from '../../utils/id';

export class PoliteCommunicatorFrontendAgent extends BaseFrontendAgent {
  formatUserMessageParts(payload: Record<string, any>): MessagePart[] {
    const parts: MessagePart[] = [];
    
    if (payload.message && typeof payload.message === 'string' && payload.message.trim() !== '') {
      parts.push({
        id: generateId('polite-txt'),
        type: 'text',
        text: payload.message
      });
    }

    return parts;
  }
}
