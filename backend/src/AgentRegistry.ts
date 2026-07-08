import fs from 'fs/promises';
import path from 'path';
import { pathToFileURL } from 'url';
import { IPromptAgent } from './agents/core/IPromptAgent';

export interface AgentMetadata {
  id: string;
  name: string;
  description: string;
  category: string;
}

export class AgentRegistry {
  private agents: Map<string, IPromptAgent> = new Map();

  async init() {
    const agentsDir = path.resolve(__dirname, 'agents');
    const excludeDirs = ['core', 'categories'];

    try {
      const categories = await fs.readdir(agentsDir, { withFileTypes: true });

      for (const categoryEntry of categories) {
        if (!categoryEntry.isDirectory() || excludeDirs.includes(categoryEntry.name)) {
          continue;
        }

        const categoryPath = path.join(agentsDir, categoryEntry.name);
        const agentDirs = await fs.readdir(categoryPath, { withFileTypes: true });

        for (const agentDir of agentDirs) {
          if (!agentDir.isDirectory()) continue;

          const indexPath = path.join(categoryPath, agentDir.name, 'index.ts');
          
          try {
            await fs.access(indexPath);
            
            const module = await import(pathToFileURL(indexPath).href);
            
            for (const key in module) {
              const ExportedClass = module[key];
              
              if (typeof ExportedClass === 'function' && ExportedClass.prototype && 'executePrompt' in ExportedClass.prototype) {
                const agentInstance = new ExportedClass() as IPromptAgent;
                this.register(agentInstance);
                console.log(`[AgentRegistry] Successfully loaded agent: ${agentInstance.id} (${agentInstance.name})`);
              }
            }
          } catch (err: any) {
            if (err.code !== 'ENOENT') {
              console.error(`[AgentRegistry] Failed to load agent at ${indexPath}:`, err.message);
              throw err; 
            }
          }
        }
      }
    } catch (err) {
      console.error('[AgentRegistry] Failed to scan agents directory:', err);
      throw err;
    }
  }

  register(agent: IPromptAgent) {
    if (this.agents.has(agent.id)) {
      throw new Error(`[AgentRegistry] Duplicate agent ID detected: ${agent.id}`);
    }
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
