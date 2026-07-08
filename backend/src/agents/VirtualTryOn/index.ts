import { BaseAgent } from '../BaseAgent';
import type { AgentMetadata } from '../../models/AgentMetadata';
import { AIProvider } from '../../../../../_Framework/MultiAgent/src/providers/AIProvider';
import { buildSystemPrompt, buildImageArray } from './prompt';

export class VirtualTryOnAgent extends BaseAgent {
  constructor(provider: AIProvider) {
    super('VirtualTryOn', provider);
  }

  getMetadata(): AgentMetadata {
    return {
      id: 'virtual-try-on',
      name: 'AI Virtual Try-On',
      category: 'image',
      description: 'Upload a source character, clothing, and an optional pose to generate a try-on image.',
      icon: 'image',
      inputSchema: {
        source_image: {
          type: 'image',
          label: 'Source Character',
          required: true,
          maxCount: 1
        },
        clothing_images: {
          type: 'image',
          label: 'Clothing Items',
          required: true,
          maxCount: 3
        },
        pose_image: {
          type: 'image',
          label: 'Target Pose',
          required: false,
          maxCount: 1
        },
        prompt: {
          type: 'text',
          label: 'Additional Style/Prompt',
          required: false
        }
      }
    };
  }

  async execute(inputs: Record<string, any>, options?: any): Promise<any> {
    const sourceImage = inputs['source_image'];
    const clothingImages = inputs['clothing_images'] || [];
    const poseImage = inputs['pose_image'];
    const textPrompt = inputs['prompt'] || 'Make the character wear these clothes naturally.';

    if (!sourceImage || sourceImage.length === 0) {
      throw new Error('source_image is required');
    }
    if (!clothingImages || clothingImages.length === 0) {
      throw new Error('clothing_images are required');
    }

    const hasPose = poseImage && poseImage.length > 0;
    const systemPrompt = buildSystemPrompt(hasPose);
    const allImages = buildImageArray(sourceImage, clothingImages, poseImage);

    const response = await this.provider.generate({
      prompt: textPrompt,
      systemPrompt: systemPrompt,
      images: allImages,
      temperature: 0.5,
      sessionId: options?.sessionId
    });

    return response.text;
  }
}
