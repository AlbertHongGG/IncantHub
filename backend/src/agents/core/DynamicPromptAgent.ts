import { AIProvider } from '../../providers/AIProvider';
import { ProviderFactory } from '../../providers/ProviderFactory';
import { IPromptAgent, PromptExecutionOptions } from './IPromptAgent';
import { PromptBuilder } from './PromptBuilder';
import { AgentCategory } from './AgentCategory';
import { AgentConfig } from './AgentConfig';
import { IncantLogger } from '../../logger/IncantLogger';
import { TextCategory } from '../categories/TextCategory';
import { ImageCategory } from '../categories/ImageCategory';

// Helper to resolve category singleton
function resolveCategory(categoryId: string): AgentCategory {
  if (categoryId === 'text') return TextCategory;
  if (categoryId === 'image') return ImageCategory;
  throw new Error(`Unknown category ID: ${categoryId}`);
}

export class DynamicPromptAgent implements IPromptAgent {
  public readonly id: string;
  public readonly name: string;
  public readonly description: string;
  public readonly category: AgentCategory;
  
  private provider: AIProvider;
  private agentLogger: IncantLogger;
  private config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
    this.id = config.id;
    this.name = config.name;
    this.description = config.description;
    this.category = resolveCategory(config.categoryId);
    this.provider = ProviderFactory.createProvider(config.provider, config.model);
    this.agentLogger = new IncantLogger(this.id);
  }

  async executePrompt(input: string, options?: PromptExecutionOptions): Promise<any> {
    const systemPrompt = PromptBuilder.buildSystemPrompt(this.category, {
      role: this.config.role,
      taskInstruction: this.config.taskInstruction
    });
    
    const userPrompt = PromptBuilder.buildUserPrompt(input);
    
    this.agentLogger.logRequest(userPrompt, systemPrompt);

    const response = await this.provider.generate({
      prompt: userPrompt,
      systemPrompt: systemPrompt,
      temperature: options?.temperature ?? 0.7,
      sessionId: options?.sessionId,
      images: options?.images,
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
