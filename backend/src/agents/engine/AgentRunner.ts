import { AgentConfig } from '../models/AgentConfig';
import { AgentCategory } from '../models/AgentCategory';
import { TextCategory } from '../categories/TextCategory';
import { ImageCategory } from '../categories/ImageCategory';
import { ProviderFactory } from '../../providers/ProviderFactory';
import { DefaultPromptBuilder, IPromptBuilder } from './PromptBuilder';
import { IncantLogger } from '../../logger/IncantLogger';

export interface RunOptions {
  sessionId?: string;
  temperature?: number;
  images?: string[];
}

export class AgentRunner {
  private promptBuilder: IPromptBuilder;

  constructor(promptBuilder?: IPromptBuilder) {
    this.promptBuilder = promptBuilder || new DefaultPromptBuilder();
  }

  async execute(config: AgentConfig, input: string, options?: RunOptions): Promise<any> {
    const category = this.resolveCategory(config.categoryId);
    const provider = ProviderFactory.createProvider(config.provider, config.model);
    const logger = new IncantLogger(config.id);

    const systemPrompt = this.promptBuilder.buildSystemPrompt(category, config);
    const userPrompt = this.promptBuilder.buildUserPrompt(input);

    logger.logRequest(userPrompt, systemPrompt);

    const response = await provider.generate({
      prompt: userPrompt,
      systemPrompt: systemPrompt,
      temperature: options?.temperature ?? 0.7,
      sessionId: options?.sessionId,
      images: options?.images,
    });

    logger.logResponse(response.text);

    try {
      return JSON.parse(response.text);
    } catch (e) {
      return { result: response.text, thought: "Failed to parse JSON" };
    }
  }

  private resolveCategory(categoryId: string): AgentCategory {
    if (categoryId === 'text') return new TextCategory();
    if (categoryId === 'image') return new ImageCategory();
    throw new Error(`Unknown category ID: ${categoryId}`);
  }
}
