import { AgentConfig } from './agents/core/AgentConfig';
import { AgentStorage, GroupedAgentConfigs } from './agents/storage/AgentStorage';
import { DynamicPromptAgent } from './agents/core/DynamicPromptAgent';
import { IPromptAgent } from './agents/core/IPromptAgent';

export class AgentRegistry {
  private agents: Map<string, IPromptAgent> = new Map();
  private groupedConfigs: GroupedAgentConfigs = {};

  async init() {
    try {
      this.groupedConfigs = await AgentStorage.loadAll();
      this.agents.clear();
      
      for (const categoryId in this.groupedConfigs) {
        for (const config of this.groupedConfigs[categoryId]) {
          try {
            const agentInstance = new DynamicPromptAgent(config);
            this.agents.set(config.id, agentInstance);
            console.log(`[AgentRegistry] Loaded Data-Driven Agent: ${config.id}`);
          } catch (err: any) {
            console.error(`[AgentRegistry] Failed to initialize agent ${config.id}:`, err.message);
          }
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

  getAllConfigs(): GroupedAgentConfigs {
    return this.groupedConfigs;
  }

  private findConfig(id: string): { categoryId: string, index: number } | null {
    for (const categoryId in this.groupedConfigs) {
      const index = this.groupedConfigs[categoryId].findIndex(c => c.id === id);
      if (index !== -1) {
        return { categoryId, index };
      }
    }
    return null;
  }

  async addAgent(config: AgentConfig): Promise<void> {
    if (this.findConfig(config.id)) {
      throw new Error(`Agent with ID ${config.id} already exists`);
    }
    
    if (!this.groupedConfigs[config.categoryId]) {
      this.groupedConfigs[config.categoryId] = [];
    }
    
    this.groupedConfigs[config.categoryId].push(config);
    await AgentStorage.saveAll(this.groupedConfigs);
    
    const agentInstance = new DynamicPromptAgent(config);
    this.agents.set(config.id, agentInstance);
  }

  async updateAgent(id: string, config: AgentConfig): Promise<void> {
    const found = this.findConfig(id);
    if (!found) {
      throw new Error(`Agent with ID ${id} not found`);
    }
    
    if (found.categoryId !== config.categoryId) {
      this.groupedConfigs[found.categoryId].splice(found.index, 1);
      if (!this.groupedConfigs[config.categoryId]) {
        this.groupedConfigs[config.categoryId] = [];
      }
      this.groupedConfigs[config.categoryId].push({ ...config, id });
    } else {
      this.groupedConfigs[found.categoryId][found.index] = { ...config, id };
    }
    
    await AgentStorage.saveAll(this.groupedConfigs);
    
    const agentInstance = new DynamicPromptAgent({ ...config, id });
    this.agents.set(id, agentInstance);
  }

  async deleteAgent(id: string): Promise<void> {
    const found = this.findConfig(id);
    if (!found) {
      throw new Error(`Agent with ID ${id} not found`);
    }
    
    this.groupedConfigs[found.categoryId].splice(found.index, 1);
    
    if (this.groupedConfigs[found.categoryId].length === 0) {
      delete this.groupedConfigs[found.categoryId];
    }
    
    await AgentStorage.saveAll(this.groupedConfigs);
    this.agents.delete(id);
  }
}
