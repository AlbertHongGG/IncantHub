import { BaseAgent } from '../agents/BaseAgent';
import type { AgentMetadata } from '../models/AgentMetadata';
import { PoliteCommunicatorAgent } from '../agents/PoliteCommunicator';
import { VirtualTryOnAgent } from '../agents/VirtualTryOn';
import { ProviderFactory } from '../providers/ProviderFactory';

export class AgentService {
  private registry: Map<string, BaseAgent> = new Map();

  async init() {
    console.log('[AgentService] Initializing pure OOP Agent Registry...');
    const provider = ProviderFactory.createProvider('geminiflow', 'gemini-1.5-flash');
    this.registerAgent(new PoliteCommunicatorAgent(provider));
    this.registerAgent(new VirtualTryOnAgent(provider));
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
