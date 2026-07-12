import { BaseBackendAgent } from '../../BaseBackendAgent';
import type { AgentMetadata, AgentExecutionResult } from '../../../types/agent';
import { AIProvider } from '../../../providers/AIProvider';
import { buildCharacterRefSheetPayload } from './prompt';

export class CharacterRefSheetAgent extends BaseBackendAgent {
  constructor(provider: AIProvider) {
    super('CharacterRefSheet', provider);
  }

  getMetadata(): AgentMetadata {
    return {
      id: 'character-ref-sheet',
      name: 'Character Reference Sheet',
      category: 'image',
      description: 'Generate a standard character reference sheet from a reference image.',
      icon: 'image',
      coverImage: '/agents/ref-sheet-cover.jpg',
      inputSchema: {
        source_image: {
          type: 'image',
          uiType: 'image_upload',
          label: '人物參考圖 (Reference Image)',
          required: true,
          maxCount: 1
        },
        target_character_description: {
          type: 'text',
          uiType: 'textarea',
          label: '目標人物描述 (Target Character Description)',
          placeholder: '若參考圖中有多人，請描述目標人物的特徵...',
          required: false
        },
        style_prompt: {
          type: 'text',
          uiType: 'textarea',
          label: '服裝/動作/表情/風格描述 (Style/Action Prompt)',
          placeholder: '可選，輸入欲改變的服裝、動作、表情或風格...',
          required: false
        }
      }
    };
  }

  protected async process(inputs: Record<string, any>, options?: any): Promise<AgentExecutionResult> {
    const sourceImage = inputs['source_image'];
    const targetCharacterDescription = inputs['target_character_description'];
    const stylePrompt = inputs['style_prompt'];
    const textPrompt = stylePrompt || 'Generate the character reference sheet based on the reference image.';

    const { systemPrompt, allImages } = buildCharacterRefSheetPayload(
      sourceImage,
      targetCharacterDescription,
      stylePrompt
    );

    const response = await this.provider.generate({
      prompt: textPrompt,
      systemPrompt: systemPrompt,
      images: allImages,
      temperature: 0.5,
      sessionId: options?.sessionId
    });

    const generatedImages = response.metadata?.images || [];

    return {
      type: generatedImages.length > 0 ? 'image' : 'text',
      content: response.text,
      images: generatedImages
    };
  }
}
