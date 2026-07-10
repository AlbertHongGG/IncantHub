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

export class APIError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

class IncantHubAPIClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3001/api') {
    this.baseUrl = baseUrl;
  }

  private async fetchJSON<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = 'An unknown error occurred';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        errorMessage = response.statusText;
      }
      throw new APIError(response.status, errorMessage);
    }

    return response.json();
  }

  public async getAgents(): Promise<AgentMetadata[]> {
    return this.fetchJSON<AgentMetadata[]>('/prompts');
  }

  public async executeAgent(id: string, payload: Record<string, any>): Promise<AgentExecutionResult> {
    const data = await this.fetchJSON<{ result: AgentExecutionResult }>(`/prompts/${id}/execute`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return data.result;
  }
}

// Singleton instance
export const apiClient = new IncantHubAPIClient();
