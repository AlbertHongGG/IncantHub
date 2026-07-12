import { BaseBackendAgent } from '../../BaseBackendAgent';
import type { AgentMetadata, AgentExecutionResult } from '../../../types/agent';
import { AIProvider } from '../../../providers/AIProvider';
import { buildKoreanIDPhotoPayload } from './prompt';

export class KoreanIDPhotoAgent extends BaseBackendAgent {
  constructor(provider: AIProvider) {
    super('KoreanIDPhoto', provider);
  }

  protected createMetadata(): AgentMetadata {
    return {
      id: 'korean-id-photo',
      name: 'Korean ID Photo',
      category: 'image',
      description: 'Transform any photo into a stunning passport photo in Korean photography style while retaining exact identity.',
      icon: 'camera',
      inputSchema: {
        source_image: {
          type: 'image',
          uiType: 'image_upload',
          label: '人物參考圖 (Reference Photo)',
          required: true,
          maxCount: 1
        },
        target_character_description: {
          type: 'text',
          uiType: 'textarea',
          label: '目標人物描述 (Target Character)',
          placeholder: '若照片中有多人，請詳細描述目標人物特徵...',
          required: false
        },
        style_prompt: {
          type: 'text',
          uiType: 'textarea',
          label: '自訂風格/服裝/髮型 (Custom Styling)',
          placeholder: '可選，輸入欲改變的服裝、是否移除眼鏡、髮型調整等...',
          required: false
        }
      }
    };
  }

  protected async process(inputs: Record<string, any>, options?: any): Promise<AgentExecutionResult> {
    const sourceImage = inputs['source_image'];
    const targetCharacterDescription = inputs['target_character_description'];
    const stylePrompt = inputs['style_prompt'];
    
    let textPrompt = stylePrompt || 'Generate a Korean style ID photo based on the reference image.';
    
    // Explicitly append a directive for a portrait aspect ratio typical for ID photos
    textPrompt += ' [IMPORTANT: Generate a high-resolution portrait image (3:4 aspect ratio) suitable for an ID photo. NO text or labels.]';

    const { systemPrompt, allImages } = buildKoreanIDPhotoPayload(
      sourceImage,
      targetCharacterDescription,
      stylePrompt
    );

    const response = await this.provider.generate({
      prompt: textPrompt,
      systemPrompt: systemPrompt,
      images: allImages,
      temperature: 0.2, // Extremely low temperature to force strict adherence to the original face
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
