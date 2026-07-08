import { IPromptMetadata } from '../IPromptAgent';

export const AgentMetadata: IPromptMetadata = {
  id: 'image-describer',
  title: '圖片描述與分析',
  description: '根據上傳的圖片生成詳細的描述文字與風格分析。',
  category: 'image',
  icon: 'image'
};

export const SystemPrompt = '請詳細描述這張圖片中的內容，並分析其視覺風格。';
