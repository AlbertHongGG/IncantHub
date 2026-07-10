export interface FieldSchema {
  type: 'text' | 'image';
  label: string;
  required: boolean;
  maxCount?: number;
}

export interface InputSchema {
  [fieldName: string]: FieldSchema;
}

export interface AgentMetadata {
  id: string;
  name: string;
  category: string;
  description: string;
  icon?: string;
  inputSchema: InputSchema;
}

export interface AgentExecutionResult {
  type: 'text' | 'image' | 'mixed';
  content: string;
  images?: string[];
  metadata?: Record<string, any>;
}
