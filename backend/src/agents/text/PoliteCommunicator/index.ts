import { BaseAgent } from '../../BaseAgent';
import type { AgentMetadata } from '../../../models/AgentMetadata';
import type { AgentExecutionResult } from '../../../models/AgentExecutionResult';
import { AIProvider } from '../../../../../../_Framework/MultiAgent/src/providers/AIProvider';
import { buildSystemPrompt, buildUserPrompt } from './prompt';

export class PoliteCommunicatorAgent extends BaseAgent {
  constructor(provider: AIProvider) {
    super('PoliteCommunicator', provider);
  }

  getMetadata(): AgentMetadata {
    return {
      id: 'polite-communicator',
      name: 'Polite Communicator',
      category: 'text',
      description: 'Transforms casual or blunt text into a polite, professional message suitable for work.',
      icon: 'message-square',
      inputSchema: {
        raw_message: {
          type: 'text',
          label: 'Raw Message',
          required: true
        },
        tone: {
          type: 'text',
          label: 'Desired Tone',
          required: false
        }
      }
    };
  }

  protected async process(inputs: Record<string, any>, options?: any): Promise<AgentExecutionResult> {
    const rawMessage = inputs['raw_message'];
    const tone = inputs['tone'] || 'professional and polite';

    const systemPrompt = buildSystemPrompt(tone);
    const userPrompt = buildUserPrompt(rawMessage);

    const response = await this.provider.generate({
      prompt: userPrompt,
      systemPrompt: systemPrompt,
      temperature: 0.7,
      sessionId: options?.sessionId
    });

    return {
      type: 'text',
      content: response.text
    };
  }
}
