import { IPromptAgent } from './IPromptAgent';
import { ArticleSummarizerAgent } from './ArticleSummarizerAgent';
import { MarketingCopyAgent } from './MarketingCopyAgent';
import { ImageDescriberAgent } from './ImageDescriberAgent';

export class PromptAgentFactory {
  static createAgent(agentId: string): IPromptAgent {
    switch (agentId) {
      case 'article-summarizer':
        return new ArticleSummarizerAgent();
      case 'marketing-copy':
        return new MarketingCopyAgent();
      case 'image-describer':
        return new ImageDescriberAgent();
      default:
        throw new Error(`Factory Error: Unknown agent id '${agentId}'`);
    }
  }
}
