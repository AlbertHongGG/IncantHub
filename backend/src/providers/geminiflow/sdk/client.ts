import { GeminiFlowChatPayload, GeminiFlowChatResponse, GeminiFlowStreamData } from './types';

export class GeminiFlowClient {
  private baseUrl: string;

  constructor(baseUrl: string = "http://127.0.0.1:8000") {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async health(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/health`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }
    return response.json();
  }

  async chat(
    prompt: string,
    systemPrompt?: string,
    model: string = "gemini-3-pro",
    language: string = "zh-TW",
    images?: string[],
    sessionId?: string,
    saveImages: boolean = true
  ): Promise<GeminiFlowChatResponse> {
    const payload: GeminiFlowChatPayload = {
      prompt,
      model,
      language,
      save_images: saveImages,
    };
    if (systemPrompt) payload.system_prompt = systemPrompt;
    if (images && images.length > 0) payload.images = images;
    if (sessionId) payload.session_id = sessionId;

    const response = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    return response.json();
  }

  async *stream(
    prompt: string,
    systemPrompt?: string,
    model: string = "gemini-3-pro",
    language: string = "zh-TW",
    images?: string[],
    sessionId?: string,
    saveImages: boolean = true
  ): AsyncGenerator<GeminiFlowStreamData, void, unknown> {
    throw new Error('Streaming not implemented in local provider yet.');
  }
}
