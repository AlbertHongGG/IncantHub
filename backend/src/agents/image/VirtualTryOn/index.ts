import { BaseBackendAgent } from '../../BaseBackendAgent';
import type { AgentMetadata, AgentExecutionResult } from '../../../types/agent';
import { AIProvider } from '../../../providers/AIProvider';
import { buildVirtualTryOnPayload } from './prompt';

export class VirtualTryOnAgent extends BaseBackendAgent {
  constructor(provider: AIProvider) {
    super('VirtualTryOn', provider);
  }

  protected createMetadata(): AgentMetadata {
    return {
      id: 'virtual-try-on',
      name: 'AI Virtual Try-On',
      category: 'image',
      description: 'Upload a source character, clothing, and an optional pose to generate a try-on image.',
      icon: 'image',
      coverImage: '/agents/vton-cover.jpg',
      inputSchema: {
        source_image: {
          type: 'image',
          uiType: 'image_upload',
          label: 'Source Character',
          required: true,
          maxCount: 1
        },
        clothing_images: {
          type: 'image',
          uiType: 'image_upload',
          label: 'Clothing Items',
          required: true,
          maxCount: 3
        },
        pose_image: {
          type: 'image',
          uiType: 'image_upload',
          label: 'Target Pose',
          required: false,
          maxCount: 1
        },
        prompt: {
          type: 'text',
          uiType: 'textarea',
          label: 'Additional Style/Prompt',
          placeholder: 'E.g., High fashion, street style...',
          required: false
        }
      }
    };
  }

  protected async process(inputs: Record<string, any>, options?: any): Promise<AgentExecutionResult> {
    const sourceImage = inputs['source_image'];
    const clothingImages = inputs['clothing_images'];
    const poseImage = inputs['pose_image'];
    const textPrompt = inputs['prompt'] || 'Make the character wear these clothes naturally.';

    const { systemPrompt, allImages } = buildVirtualTryOnPayload(sourceImage, clothingImages, poseImage);

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
