import { GenerateRequest, GenerateResponse, GenerateStreamChunk } from '../types/provider';

export interface AIProvider {
  readonly name: string;
  generate(request: GenerateRequest): Promise<GenerateResponse>;
  generateStream?(request: GenerateRequest): AsyncGenerator<GenerateStreamChunk, void, unknown>;
}
