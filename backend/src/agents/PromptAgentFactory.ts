import { IPromptAgent } from './core/IPromptAgent';
import { ArticleSummarizerAgent } from './text/ArticleSummarizerAgent';
import { MarketingCopyAgent } from './text/MarketingCopyAgent';
import { ImageDescriberAgent } from './image/ImageDescriberAgent';

export class PromptAgentFactory {
  static createAgent(agentId: string): IPromptAgent {
    switch (agentId) {
      case 'ArticleSummarizer':
        return new ArticleSummarizerAgent();
      case 'MarketingCopy':
        return new MarketingCopyAgent();
      case 'ImageDescriber':
        return new ImageDescriberAgent();
      default:
        throw new Error(`Unknown agent ID: ${agentId}`);
    }
  }
}
