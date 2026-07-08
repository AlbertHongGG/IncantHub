import { BaseAgent as MultiAgentBase } from '../../../../_Framework/MultiAgent/src/agents/BaseAgent';
import { AIProvider } from '../../../../_Framework/MultiAgent/src/providers/AIProvider';
import type { AgentMetadata } from '../models/AgentMetadata';

export abstract class BaseAgent extends MultiAgentBase {
  constructor(name: string, provider: AIProvider) {
    super(name, provider);
  }

  abstract getMetadata(): AgentMetadata;
  abstract execute(inputs: Record<string, any>, options?: any): Promise<any>;
}
