import { AgentCategory } from './AgentCategory';

export interface PromptExecutionOptions {
  sessionId?: string;
  temperature?: number;
  images?: string[];
}

export interface IPromptAgent {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: AgentCategory;
  
  executePrompt(input: string, options?: PromptExecutionOptions): Promise<any>;
}
