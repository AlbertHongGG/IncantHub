export interface AgentExecutionResult {
  type: 'text' | 'image' | 'mixed';
  content: string;
  images?: string[];
  metadata?: Record<string, any>;
}
