import { IPromptMetadata } from '../IPromptAgent';

export const AgentMetadata: IPromptMetadata = {
  id: 'article-summarizer',
  title: '文章總結助手',
  description: '快速為長篇幅文章生成重點摘要。',
  category: 'text',
  icon: 'file-text'
};

export const SystemPrompt = '你是一個專業的文章總結助手，請用繁體中文列出重點。';
