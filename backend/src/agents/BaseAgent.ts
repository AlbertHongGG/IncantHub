import { BaseAgent as MultiAgentBase } from '../../../../_Framework/MultiAgent/src/agents/BaseAgent';
import { AIProvider } from '../../../../_Framework/MultiAgent/src/providers/AIProvider';
import type { AgentMetadata } from '../models/AgentMetadata';
import type { AgentExecutionResult } from '../models/AgentExecutionResult';

export abstract class BaseAgent extends MultiAgentBase {
  constructor(name: string, provider: AIProvider) {
    super(name, provider);
  }

  abstract getMetadata(): AgentMetadata;

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
}
