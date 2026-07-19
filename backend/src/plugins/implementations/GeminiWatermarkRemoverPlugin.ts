import { BasePlugin, PluginConfig } from '../BasePlugin';
import type { AgentExecutionResult, AgentMetadata } from '../../types/agent';
import { removeWatermarkFromBuffer } from '@pilio/gemini-watermark-remover/node';
import sharp from 'sharp';

export class GeminiWatermarkRemoverPlugin extends BasePlugin {
  public readonly id = 'gemini-watermark-remover';
  public readonly name = 'Gemini Watermark Remover';
  public readonly description = 'Removes the Gemini AI watermark from generated images using an advanced neural network and restoration pipeline.';
  
  public readonly supportedAgentCategories = ['image'];

  public async process(
    result: AgentExecutionResult,
    agentMeta: AgentMetadata,
    pluginConfig: PluginConfig
  ): Promise<AgentExecutionResult> {
    if (!result.images || result.images.length === 0) {
      return result;
    }

    const processedImages: string[] = [];

    for (const image of result.images) {
      try {
        let buffer: Buffer;

        if (image.startsWith('http://') || image.startsWith('https://')) {
          const response = await fetch(image);
          const arrayBuffer = await response.arrayBuffer();
          buffer = Buffer.from(arrayBuffer);
        } else if (image.startsWith('data:image/')) {
          const base64Data = image.split(',')[1];
          buffer = Buffer.from(base64Data, 'base64');
        } else {
          // Unsupported image format or local path, just keep original
          processedImages.push(image);
          continue;
        }

        const mimeType = 'image/jpeg'; // or 'image/png' depending on the content

        // Apply watermark remover
        const removalResult = await removeWatermarkFromBuffer(buffer, {
          mimeType,
          decodeImageData: async (buf) => {
            const { data, info } = await sharp(buf)
              .ensureAlpha()
              .raw()
              .toBuffer({ resolveWithObject: true });
            
            return {
              width: info.width,
              height: info.height,
              data: new Uint8ClampedArray(data.buffer, data.byteOffset, data.byteLength)
            };
          },
          encodeImageData: async (imgData) => {
            return sharp(Buffer.from(imgData.data.buffer, imgData.data.byteOffset, imgData.data.byteLength), {
              raw: {
                width: imgData.width,
                height: imgData.height,
                channels: 4
              }
            })
            .jpeg({ quality: 95 })
            .toBuffer();
          }
        });

        // Convert back to base64
        const processedBase64 = `data:${mimeType};base64,${removalResult.buffer.toString('base64')}`;
        processedImages.push(processedBase64);

      } catch (error) {
        console.error(`[GeminiWatermarkRemoverPlugin] Failed to process image:`, error);
        // Fallback to original image on error
        processedImages.push(image);
      }
    }

    return {
      ...result,
      images: processedImages
    };
  }
}
