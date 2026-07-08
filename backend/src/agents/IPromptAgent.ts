export type PromptCategory = 'text' | 'image';

export interface IPromptMetadata {
  id: string;
  title: string;
  description: string;
  category: PromptCategory;
  tags?: string[];
  icon?: string;
}

export interface PromptExecutionOptions {
  userPrompt: string;
  images?: string[];
}

export interface IPromptAgent {
  readonly metadata: IPromptMetadata;
  executePrompt(options: PromptExecutionOptions): Promise<string>;
}
