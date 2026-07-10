import { BaseBackendAgent } from '../agents/BaseBackendAgent';
import type { AgentMetadata } from '../types/agent';
import { getAllAgents } from '../agents';

export class AgentService {
  private registry: Map<string, BaseBackendAgent> = new Map();

  async init() {
    console.log('[AgentService] Initializing clean OOP Agent Registry...');
    
    try {
      const agents = getAllAgents();
      for (const agent of agents) {
        this.registerAgent(agent);
      }
      console.log(`[AgentService] Successfully loaded ${this.registry.size} agents.`);
    } catch (error) {
      console.error('[AgentService] Failed to initialize agents. Check your environment configurations.', error);
      throw error;
    }
  }

  registerAgent(agent: BaseBackendAgent) {
    const meta = agent.getMetadata();
    this.registry.set(meta.id, agent);
    console.log(`[AgentService] Registered Agent: ${meta.name} (${meta.id})`);
  }

  getAgent(id: string): BaseBackendAgent | undefined {
    return this.registry.get(id);
  }

  getAllMetadata(): AgentMetadata[] {
    return Array.from(this.registry.values()).map(agent => agent.getMetadata());
  }
}
