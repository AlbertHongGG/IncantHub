import { BasePlugin } from './BasePlugin';
import { GeminiWatermarkRemoverPlugin } from './implementations/GeminiWatermarkRemoverPlugin';

export function getAllPlugins(): BasePlugin[] {
  return [
    new GeminiWatermarkRemoverPlugin(),
  ];
}
