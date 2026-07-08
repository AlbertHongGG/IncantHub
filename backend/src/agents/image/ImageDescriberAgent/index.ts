import { BaseAgent } from '../../core/BaseAgent';
import { ProviderFactory } from '../../../providers/ProviderFactory';
import { IPromptAgent, PromptExecutionOptions } from '../../core/IPromptAgent';
import { PromptBuilder } from '../../core/PromptBuilder';
import { ImageCategory } from '../../categories/ImageCategory';
import { ImageDescriberPromptDefinition } from './prompts';
import { IncantLogger } from '../../../logger/IncantLogger';

export class ImageDescriberAgent extends BaseAgent implements IPromptAgent {
  public readonly id = 'ImageDescriber';
  public readonly description = '分析與描述提供的圖片內容';
  public readonly category = ImageCategory;
  private agentLogger: IncantLogger;

  constructor() {
    super('圖片描述與分析', ProviderFactory.createProvider('ImageDescriber'));
    this.agentLogger = new IncantLogger(this.id);
  }

  async executePrompt(input: string, options?: PromptExecutionOptions): Promise<any> {
    const systemPrompt = PromptBuilder.buildSystemPrompt(this.category, ImageDescriberPromptDefinition);
    const userPrompt = PromptBuilder.buildUserPrompt(input);
    
    this.agentLogger.logRequest(userPrompt, systemPrompt);

    const response = await this.provider.generate({
      prompt: userPrompt,
      systemPrompt: systemPrompt,
      temperature: options?.temperature ?? 0.7,
      sessionId: options?.sessionId,
      images: options?.images, // Pass images to provider
    });

    this.agentLogger.logResponse(response.text);

    try {
      return JSON.parse(response.text);
    } catch (e) {
      return { result: response.text, thought: "Failed to parse JSON" };
    }
  }

  async execute(input: string, options?: PromptExecutionOptions): Promise<any> {
    return this.executePrompt(input, options);
  }
}
