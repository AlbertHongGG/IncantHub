import { BaseAgent } from '../agents/BaseAgent';
import type { AgentMetadata } from '../models/AgentMetadata';
import { loadAllAgents } from '../agents';
import { ProviderFactory } from '../providers/ProviderFactory';
import { getAgentConfig } from '../config';

export class AgentService {
  private registry: Map<string, BaseAgent> = new Map();

  async init() {
    console.log('[AgentService] Initializing pure OOP Agent Registry...');
    
    const agents = loadAllAgents((agentId) => {
      const { provider, model } = getAgentConfig(agentId);
      return ProviderFactory.createProvider(provider, model);
    });

    for (const agent of agents) {
      this.registerAgent(agent);
    }
  }

  registerAgent(agent: BaseAgent) {
    const meta = agent.getMetadata();
    this.registry.set(meta.id, agent);
    console.log(`[AgentService] Registered Agent: ${meta.name} (${meta.id})`);
  }

  getAgent(id: string): BaseAgent | undefined {
    return this.registry.get(id);
  }

  getAllMetadata(): AgentMetadata[] {
    return Array.from(this.registry.values()).map(agent => agent.getMetadata());
  }
}
