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

export const API_URL = 'http://localhost:3001/api';

export const apiClient = {
  getAgents: async (): Promise<AgentMetadata[]> => {
    const res = await fetch(`${API_URL}/prompts`);
    if (!res.ok) throw new Error('Failed to fetch agents');
    return res.json();
  },
  executeAgent: async (id: string, payload: Record<string, any>): Promise<AgentExecutionResult> => {
    const res = await fetch(`${API_URL}/prompts/${id}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Execution failed');
    }
    const data = await res.json();
    return data.result;
  }
};
