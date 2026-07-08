import { IPromptAgent } from './agents/core/IPromptAgent';
import { PromptAgentFactory } from './agents/PromptAgentFactory';

export interface AgentMetadata {
  id: string;
  name: string;
  description: string;
  category: string;
}

export class AgentRegistry {
  private agents: Map<string, IPromptAgent> = new Map();

  constructor() {
    this.register(PromptAgentFactory.createAgent('ArticleSummarizer'));
    this.register(PromptAgentFactory.createAgent('MarketingCopy'));
    this.register(PromptAgentFactory.createAgent('ImageDescriber'));
  }

  register(agent: IPromptAgent) {
    this.agents.set(agent.id, agent);
  }

  getAgent(id: string): IPromptAgent | undefined {
    return this.agents.get(id);
  }

  getAllMetadata(): AgentMetadata[] {
    return Array.from(this.agents.values()).map(agent => ({
      id: agent.id,
      name: agent.name,
      description: agent.description,
      category: agent.category.id
    }));
  }
}
