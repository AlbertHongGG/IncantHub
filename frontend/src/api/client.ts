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
    options?: { signal?: AbortSignal }
  ): Promise<AgentExecutionResult> {
    const data = await this.fetchJSON<{ result: AgentExecutionResult }>(`/prompts/${id}/execute`, {
      method: 'POST',
      body: JSON.stringify(payload),
      signal: options?.signal,
    });
    return data.result;
  }

  public async *executeAgentStream(
    id: string,
    payload: Record<string, any>,
    options?: { signal?: AbortSignal }
  ): AsyncGenerator<AgentExecutionResult, void, unknown> {
    const response = await fetch(`${this.baseUrl}/prompts/${id}/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: options?.signal,
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

    if (!response.body) {
      throw new Error('ReadableStream not supported by response');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        // SSE messages are separated by \n\n
        const messages = buffer.split('\n\n');
        // Keep the last partial message in the buffer
        buffer = messages.pop() || '';

        for (const message of messages) {
          if (message.startsWith('data: ')) {
            const dataStr = message.slice(6);
            if (dataStr === '[DONE]') return; // Optional completion marker

            try {
              const data = JSON.parse(dataStr);
              if (data.error) {
                throw new Error(data.error);
              }
              console.log('[APIClient] Parsed stream chunk:', data);
              yield data as AgentExecutionResult;
            } catch (e) {
              console.error('Failed to parse stream chunk:', dataStr, e);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
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
