import { AgentConfig } from './agents/core/AgentConfig';
import { AgentStorage } from './agents/storage/AgentStorage';
import { DynamicPromptAgent } from './agents/core/DynamicPromptAgent';
import { IPromptAgent } from './agents/core/IPromptAgent';

export class AgentRegistry {
  private agents: Map<string, IPromptAgent> = new Map();
  private configs: AgentConfig[] = [];

  async init() {
    try {
      this.configs = await AgentStorage.loadAll();
      this.agents.clear();
      
      for (const config of this.configs) {
        try {
          const agentInstance = new DynamicPromptAgent(config);
          this.agents.set(config.id, agentInstance);
          console.log(`[AgentRegistry] Loaded Data-Driven Agent: ${config.id}`);
        } catch (err: any) {
          console.error(`[AgentRegistry] Failed to initialize agent ${config.id}:`, err.message);
        }
      }
    } catch (err) {
      console.error('[AgentRegistry] Failed to load agents from storage:', err);
      throw err;
    }
  }

  getAgent(id: string): IPromptAgent | undefined {
    return this.agents.get(id);
  }

  getAllConfigs(): AgentConfig[] {
    return this.configs;
  }

  async addAgent(config: AgentConfig): Promise<void> {
    if (this.configs.some(c => c.id === config.id)) {
      throw new Error(`Agent with ID ${config.id} already exists`);
    }
    this.configs.push(config);
    await AgentStorage.saveAll(this.configs);
    
    const agentInstance = new DynamicPromptAgent(config);
    this.agents.set(config.id, agentInstance);
  }

  async updateAgent(id: string, config: AgentConfig): Promise<void> {
    const index = this.configs.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Agent with ID ${id} not found`);
    }
    
    this.configs[index] = { ...config, id }; 
    await AgentStorage.saveAll(this.configs);
    
    const agentInstance = new DynamicPromptAgent(this.configs[index]);
    this.agents.set(id, agentInstance);
  }

  async deleteAgent(id: string): Promise<void> {
    const index = this.configs.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Agent with ID ${id} not found`);
    }
    this.configs.splice(index, 1);
    await AgentStorage.saveAll(this.configs);
    this.agents.delete(id);
  }
}
