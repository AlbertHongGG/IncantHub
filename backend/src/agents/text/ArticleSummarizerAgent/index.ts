import { BaseAgent } from '../../core/BaseAgent';
import { ProviderFactory } from '../../../providers/ProviderFactory';
import { IPromptAgent, PromptExecutionOptions } from '../../core/IPromptAgent';
import { PromptBuilder } from '../../core/PromptBuilder';
import { TextCategory } from '../../categories/TextCategory';
import { ArticleSummarizerPromptDefinition } from './prompts';
import { IncantLogger } from '../../../logger/IncantLogger';

export class ArticleSummarizerAgent extends BaseAgent implements IPromptAgent {
  public readonly id = 'ArticleSummarizer';
  public readonly description = '將長篇文章進行重點摘要與萃取';
  public readonly category = TextCategory;
  private agentLogger: IncantLogger;

  constructor() {
    super('文章總結助手', ProviderFactory.createProvider('ArticleSummarizer'));
    this.agentLogger = new IncantLogger(this.id);
  }

  async executePrompt(input: string, options?: PromptExecutionOptions): Promise<any> {
    const systemPrompt = PromptBuilder.buildSystemPrompt(this.category, ArticleSummarizerPromptDefinition);
    const userPrompt = PromptBuilder.buildUserPrompt(input);
    
    this.agentLogger.logRequest(userPrompt, systemPrompt);

    const response = await this.provider.generate({
      prompt: userPrompt,
      systemPrompt: systemPrompt,
      temperature: options?.temperature ?? 0.7,
      sessionId: options?.sessionId,
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
