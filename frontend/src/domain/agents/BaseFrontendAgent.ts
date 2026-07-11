import type { MessagePart } from '../models/Message';
import type { AgentMetadata, AgentExecutionResult } from '../models/Agent';
import { generateId } from '../../utils/id';

export abstract class BaseFrontendAgent {
  public readonly metadata: AgentMetadata;

  constructor(metadata: AgentMetadata) {
    this.metadata = metadata;
  }

  /**
   * Transforms the raw form payload into MessageParts representing the user's input.
   */
  abstract formatUserMessageParts(payload: Record<string, any>): MessagePart[];

  /**
   * Transforms the execution result from the backend into MessageParts representing the assistant's output.
   * Provides a solid default implementation.
   */
  formatAssistantMessageParts(result: AgentExecutionResult): MessagePart[] {
    const parts: MessagePart[] = [];
    
    if (result.images && result.images.length > 0) {
      if (result.images.length > 1) {
        parts.push({
          id: generateId('res-gallery'),
          type: 'gallery',
          urls: result.images
        });
      } else {
        parts.push({
          id: generateId('res-img'),
          type: 'image',
          url: result.images[0]
        });
      }
    }
    
    if (result.content) {
      parts.push({
        id: generateId('res-txt'),
        type: 'text',
        text: result.content
      });
    }

    return parts;
  }
}
