import { AgentConfig } from '../models/AgentConfig';
import { AgentStorage, GroupedAgentConfigs } from '../storage/AgentStorage';

export class AgentService {
  private groupedConfigs: GroupedAgentConfigs = {};

  async init() {
    try {
      this.groupedConfigs = await AgentStorage.loadAll();
      console.log('[AgentService] Loaded Data-Driven Configurations successfully.');
    } catch (err) {
      console.error('[AgentService] Failed to load agents from storage:', err);
      throw err;
    }
  }

  getAgentConfig(id: string): AgentConfig | undefined {
    const found = this.findConfig(id);
    if (found) {
      return this.groupedConfigs[found.categoryId][found.index];
    }
    return undefined;
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
  }

  async deleteAgent(id: string): Promise<void> {
    const found = this.findConfig(id);
    if (!found) {
      throw new Error(`Agent with ID ${id} not found`);
    }
    
    this.groupedConfigs[found.categoryId].splice(found.index, 1);
    
    await AgentStorage.saveAll(this.groupedConfigs);
  }
}
