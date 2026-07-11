import type { AgentMetadata, AgentExecutionResult } from '../domain/models/Agent';

export class APIError extends Error {
  public statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
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

  public async executeAgent(
    id: string, 
    payload: Record<string, any>, 
    options?: { signal?: AbortSignal; onProgress?: (data: any) => void }
  ): Promise<AgentExecutionResult> {
    // In the future, this is where we'd implement SSE or Polling if onProgress is provided.
    // For now, we just pass the signal to fetchJSON to allow cancellation of long-running requests.
    const data = await this.fetchJSON<{ result: AgentExecutionResult }>(`/prompts/${id}/execute`, {
      method: 'POST',
      body: JSON.stringify(payload),
      signal: options?.signal,
    });
    return data.result;
  }

  public async addTag(agentId: string, tag: string): Promise<string[]> {
    const data = await this.fetchJSON<{ tags: string[] }>(`/prompts/${agentId}/tags`, {
      method: 'POST',
      body: JSON.stringify({ tag }),
    });
    return data.tags;
  }

  public async removeTag(agentId: string, tag: string): Promise<string[]> {
    const data = await this.fetchJSON<{ tags: string[] }>(`/prompts/${agentId}/tags/${encodeURIComponent(tag)}`, {
      method: 'DELETE',
    });
    return data.tags;
  }
}

// Singleton instance
export const apiClient = new IncantHubAPIClient();
