import { IPromptMetadata } from '../IPromptAgent';

export const AgentMetadata: IPromptMetadata = {
  id: 'marketing-copy',
  title: '創意行銷文案',
  description: '為產品生成具有吸引力的行銷文案。',
  category: 'text',
  icon: 'pen-tool'
};

export const SystemPrompt = '你是一個資深行銷文案專家，請生成有創意的行銷文案。';
