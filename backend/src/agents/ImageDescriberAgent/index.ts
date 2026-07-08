import { BaseAgent } from '../BaseAgent';
import { ProviderFactory } from '../../providers/ProviderFactory';
import { IPromptAgent, PromptExecutionOptions } from '../IPromptAgent';
import { AgentMetadata, SystemPrompt } from './prompts';
import { IncantLogger } from '../../logger/IncantLogger';

export class ImageDescriberAgent extends BaseAgent implements IPromptAgent {
  public readonly metadata = AgentMetadata;
  private systemPrompt = SystemPrompt;
  private incantLogger: IncantLogger;

  constructor() {
    const provider = ProviderFactory.createProvider('IMAGEDESCRIBER');
    super(AgentMetadata.id, provider);
    this.incantLogger = new IncantLogger(this.metadata.id);
  }

  async execute(...args: any[]): Promise<any> {
    const options = args[0] as PromptExecutionOptions;
    return this.executePrompt(options);
  }

  async executePrompt(options: PromptExecutionOptions): Promise<string> {
    const startTime = Date.now();
    try {
      this.incantLogger.info(`Executing ${this.metadata.title}`);
      
      const response = await this.provider.generate({
        prompt: options.userPrompt,
        systemPrompt: this.systemPrompt,
        images: options.images,
      });

      const duration = Date.now() - startTime;
      
      this.incantLogger.writeExecutionLog(
        { userPrompt: options.userPrompt, systemPrompt: this.systemPrompt, imagesCount: options.images?.length || 0 },
        { text: response.text },
        { durationMs: duration, success: true }
      );

      return response.text;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      this.incantLogger.error(`Error executing prompt: ${error.message}`);
      
      this.incantLogger.writeExecutionLog(
        { userPrompt: options.userPrompt },
        { error: error.message },
        { durationMs: duration, success: false }
      );

      throw error;
    }
  }
}
