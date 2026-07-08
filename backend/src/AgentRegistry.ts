import { IPromptAgent, IPromptMetadata } from './agents/IPromptAgent';
import { PromptAgentFactory } from './agents/PromptAgentFactory';

export class AgentRegistry {
  private agents: Map<string, IPromptAgent> = new Map();

  constructor() {
    this.register(PromptAgentFactory.createAgent('article-summarizer'));
    this.register(PromptAgentFactory.createAgent('marketing-copy'));
    this.register(PromptAgentFactory.createAgent('image-describer'));
  }

  register(agent: IPromptAgent) {
    this.agents.set(agent.metadata.id, agent);
  }

  getAgent(id: string): IPromptAgent | undefined {
    return this.agents.get(id);
  }

  getAllMetadata(): IPromptMetadata[] {
    return Array.from(this.agents.values()).map(agent => agent.metadata);
  }
}
