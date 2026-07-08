import { AIProvider } from '../AIProvider';
import { GenerateRequest, GenerateResponse, GenerateStreamChunk } from '../../types';
import { GeminiFlowClient } from './sdk/client';

export class GeminiFlowProvider implements AIProvider {
  public readonly name = 'geminiflow';
  private client: GeminiFlowClient;

  constructor(
    private model: string,
    baseUrl: string = 'http://127.0.0.1:8000'
  ) {
    this.client = new GeminiFlowClient(baseUrl);
  }

  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    try {
      const response = await this.client.chat(
        request.prompt,
        request.systemPrompt,
        this.model,
        'zh-TW',
        request.images,
        request.sessionId,
        false
      );

      return {
        text: response.text,
        metadata: {
          provider: this.name,
          model: this.model,
          images: response.images,
        }
      };
    } catch (error) {
      console.error('GeminiFlow Provider Error:', error);
      throw error;
    }
  }

  async *generateStream(request: GenerateRequest): AsyncGenerator<GenerateStreamChunk, void, unknown> {
    const stream = this.client.stream(
      request.prompt,
      request.systemPrompt,
      this.model,
      'zh-TW',
      request.images,
      request.sessionId,
      false
    );

    for await (const chunk of stream) {
      yield {
        text: chunk.text,
        metadata: {
          provider: this.name,
          model: this.model,
          images: chunk.images,
        }
      };
    }
  }
}
