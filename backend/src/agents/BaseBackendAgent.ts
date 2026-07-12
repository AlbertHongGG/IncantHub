import { AIProvider } from '../providers/AIProvider';
import type { AgentMetadata, AgentExecutionResult } from '../types/agent';

export abstract class BaseBackendAgent {
  public readonly name: string;
  protected provider: AIProvider;

  constructor(name: string, provider: AIProvider) {
    this.name = name;
    this.provider = provider;
  }

  protected abstract createMetadata(): AgentMetadata;

  /**
   * Template Method for generating final metadata, including systemic defaults.
   */
  public getMetadata(): AgentMetadata {
    const meta = this.createMetadata();
    
    // Default Cover Image Mechanism (Simplified & Deterministic)
    if (!meta.coverImage) {
      // Use picsum.photos with a seed based on the agent ID to generate a consistent but unique image per agent
      meta.coverImage = `https://picsum.photos/seed/${encodeURIComponent(meta.id)}/600/400`;
    }
    
    return meta;
  }

  /**
   * Template Method for executing an Agent.
   * Strictly validates inputs against the Agent's InputSchema before delegating to process().
   */
  async execute(inputs: Record<string, any>, options?: any): Promise<AgentExecutionResult> {
    const schema = this.getMetadata().inputSchema;
    const validatedInputs: Record<string, any> = {};

    for (const [fieldName, fieldSchema] of Object.entries(schema)) {
      const val = inputs[fieldName];

      if (fieldSchema.required && (val === undefined || val === null || val === '')) {
        throw new Error(`Validation Error: '${fieldName}' is required.`);
      }

      if (val !== undefined && val !== null && fieldSchema.type === 'image' && fieldSchema.maxCount) {
        if (Array.isArray(val) && val.length > fieldSchema.maxCount) {
          throw new Error(`Validation Error: '${fieldName}' allows maximum ${fieldSchema.maxCount} items.`);
        }
      }

      validatedInputs[fieldName] = val;
    }

    return this.process(validatedInputs, options);
  }

  protected abstract process(validatedInputs: Record<string, any>, options?: any): Promise<AgentExecutionResult>;

  /**
   * Template Method for executing an Agent with streaming output.
   * Validates inputs before delegating to processStream().
   */
  async *executeStream(inputs: Record<string, any>, options?: any): AsyncGenerator<AgentExecutionResult, void, unknown> {
    const schema = this.getMetadata().inputSchema;
    const validatedInputs: Record<string, any> = {};

    for (const [fieldName, fieldSchema] of Object.entries(schema)) {
      const val = inputs[fieldName];

      if (fieldSchema.required && (val === undefined || val === null || val === '')) {
        throw new Error(`Validation Error: '${fieldName}' is required.`);
      }

      if (val !== undefined && val !== null && fieldSchema.type === 'image' && fieldSchema.maxCount) {
        if (Array.isArray(val) && val.length > fieldSchema.maxCount) {
          throw new Error(`Validation Error: '${fieldName}' allows maximum ${fieldSchema.maxCount} items.`);
        }
      }

      validatedInputs[fieldName] = val;
    }

    yield* this.processStream(validatedInputs, options);
  }

  /**
   * Abstract stream processor. Subclasses should implement this if they support streaming.
   * If not overridden, it falls back to the standard non-streaming process method.
   */
  protected async *processStream(validatedInputs: Record<string, any>, options?: any): AsyncGenerator<AgentExecutionResult, void, unknown> {
    const result = await this.process(validatedInputs, options);
    yield result;
  }
}
