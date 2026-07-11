import { BaseBackendAgent } from '../../BaseBackendAgent';
import type { AgentMetadata, AgentExecutionResult } from '../../../types/agent';
import { AIProvider } from '../../../../../../_Framework/MultiAgent/src/providers/AIProvider';
import { buildSystemPrompt, buildUserPrompt } from './prompt';

export class PoliteCommunicatorAgent extends BaseBackendAgent {
  constructor(provider: AIProvider) {
    super('PoliteCommunicator', provider);
  }

  getMetadata(): AgentMetadata {
    return {
      id: 'polite-communicator',
      name: 'Polite Communicator',
      category: 'text',
      description: 'Converts blunt or informal text into a polite, professional message suitable for the workplace.',
      icon: 'file-text',
      coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80',
      inputSchema: {
        raw_message: {
          type: 'text',
          uiType: 'textarea',
          label: 'Original Message',
          placeholder: 'Type your blunt or informal message here...',
          required: true
        },
        audience: {
          type: 'text',
          uiType: 'input',
          label: 'Target Audience',
          placeholder: 'E.g., Your boss, a client, the marketing team...',
          required: false
        }
      }
    };
  }

  protected async process(inputs: Record<string, any>, options?: any): Promise<AgentExecutionResult> {
    const rawMessage = inputs['raw_message'];
    const audience = inputs['audience'] || 'professional and polite';

    const systemPrompt = buildSystemPrompt(audience);
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
