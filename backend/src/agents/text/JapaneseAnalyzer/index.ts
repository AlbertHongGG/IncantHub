import { BaseBackendAgent } from '../../BaseBackendAgent';
import type { AgentMetadata, AgentExecutionResult } from '../../../types/agent';
import { AIProvider } from '../../../../../../_Framework/MultiAgent/src/providers/AIProvider';
import { buildJapaneseAnalyzerPayload } from './prompt';

export class JapaneseAnalyzerAgent extends BaseBackendAgent {
  constructor(provider: AIProvider) {
    super('JapaneseAnalyzer', provider);
  }

  getMetadata(): AgentMetadata {
    return {
      id: 'japanese-analyzer',
      name: '日文語法結構解析器',
      category: 'text',
      description: '徹底拆解日文句子結構，深入分析詞性、文法轉換與語意組裝，幫助您活用日語。',
      icon: 'file-text',
      coverImage: 'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=600&q=80', // Japan related placeholder
      inputSchema: {
        input_text: {
          type: 'text',
          uiType: 'textarea',
          label: '日文內容',
          placeholder: '請輸入一句日文句子、一個日文單字，或一段日文文章...',
          required: true
        }
      },
      tags: ['Language', 'Japanese', 'Education', 'Analysis']
    };
  }

  protected async process(inputs: Record<string, any>, options?: any): Promise<AgentExecutionResult> {
    const rawInput = inputs['input_text'];
    if (!rawInput) {
      throw new Error('Input text is required');
    }

    const { systemPrompt, prompt } = buildJapaneseAnalyzerPayload(rawInput);

    const response = await this.provider.generate({
      prompt: prompt,
      systemPrompt: systemPrompt,
      temperature: 0.3, // Lower temperature for more analytical and structured output
      sessionId: options?.sessionId
    });

    return {
      type: 'text',
      content: response.text,
      metadata: {
        analyzed_length: rawInput.length
      }
    };
  }
}
