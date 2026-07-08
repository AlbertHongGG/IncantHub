import { BaseAgent } from '../BaseAgent';
import type { AgentMetadata } from '../../models/AgentMetadata';
import { AIProvider } from '../../../../../_Framework/MultiAgent/src/providers/AIProvider';
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
      description: 'Rewrites rough expressions into formal, polite, and clear communication.',
      icon: 'pen-tool',
      inputSchema: {
        raw_text: {
          type: 'text',
          label: 'Raw Text',
          required: true
        },
        target_audience: {
          type: 'text',
          label: 'Target Audience',
          required: false
        }
      }
    };
  }

  async execute(inputs: Record<string, any>, options?: any): Promise<any> {
    const rawText = inputs['raw_text'];
    const audience = inputs['target_audience'] || 'general professional audience';

    if (!rawText) {
      throw new Error('raw_text is required');
    }

    const systemPrompt = buildSystemPrompt(audience);
    const userPrompt = buildUserPrompt(rawText);
    
    const response = await this.provider.generate({
      prompt: userPrompt,
      systemPrompt: systemPrompt,
      temperature: 0.7,
      sessionId: options?.sessionId
    });

    return response.text;
  }
}
