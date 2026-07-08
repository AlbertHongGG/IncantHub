import fs from 'fs/promises';
import path from 'path';
import { AgentConfig } from '../models/AgentConfig';

export type GroupedAgentConfigs = Record<string, AgentConfig[]>;

const DEFAULT_SKELETON: GroupedAgentConfigs = {
  text: [],
  image: []
};

export class AgentStorage {
  private static readonly FILE_PATH = path.resolve(__dirname, '..', '..', '..', 'data', 'agents.json');

  static async loadAll(): Promise<GroupedAgentConfigs> {
    try {
      await fs.mkdir(path.dirname(this.FILE_PATH), { recursive: true });
      const data = await fs.readFile(this.FILE_PATH, 'utf-8');
      return JSON.parse(data) as GroupedAgentConfigs;
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        // 當找不到檔案時，寫入基礎分類骨架 (Skeleton)
        await this.saveAll(DEFAULT_SKELETON);
        return DEFAULT_SKELETON;
      }
      throw err;
    }
  }

  static async saveAll(groupedAgents: GroupedAgentConfigs): Promise<void> {
    await fs.mkdir(path.dirname(this.FILE_PATH), { recursive: true });
    
    const sortedGroupedAgents: GroupedAgentConfigs = {};
    const sortedKeys = Object.keys(groupedAgents).sort();
    
    for (const key of sortedKeys) {
      sortedGroupedAgents[key] = [...groupedAgents[key]].sort((a, b) => a.id.localeCompare(b.id));
    }
    
    await fs.writeFile(this.FILE_PATH, JSON.stringify(sortedGroupedAgents, null, 2), 'utf-8');
  }
}
