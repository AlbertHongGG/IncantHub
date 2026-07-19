import { BasePlugin } from './BasePlugin';
import { PluginSettingsService } from '../services/PluginSettingsService';
import type { AgentExecutionResult, AgentMetadata } from '../types/agent';

export class PluginManager {
  private plugins: Map<string, BasePlugin> = new Map();

  constructor(private settingsService: PluginSettingsService) {}

  public registerPlugin(plugin: BasePlugin) {
    if (this.plugins.has(plugin.id)) {
      console.warn(`[PluginManager] Plugin with id ${plugin.id} is already registered. Overwriting.`);
    }
    this.plugins.set(plugin.id, plugin);
    console.log(`[PluginManager] Registered plugin: ${plugin.name} (${plugin.id})`);
  }

  public getPlugins(): BasePlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Applies enabled and supported plugins to the execution result sequentially.
   */
  public async applyPlugins(result: AgentExecutionResult, agentMeta: AgentMetadata): Promise<AgentExecutionResult> {
    let currentResult = result;

    for (const plugin of this.getPlugins()) {
      const setting = this.settingsService.getPluginSetting(plugin.id);
      
      // Check if plugin is enabled and supports the agent
      if (setting.isEnabled && plugin.supports(agentMeta)) {
        try {
          console.log(`[PluginManager] Applying plugin ${plugin.id} to result from agent ${agentMeta.id}`);
          currentResult = await plugin.process(currentResult, agentMeta, { ...setting });
        } catch (error) {
          console.error(`[PluginManager] Error applying plugin ${plugin.id}:`, error);
          // Depending on requirements, we can either fail the whole process or just skip the failing plugin.
          // For now, we skip and keep the previous result.
        }
      }
    }

    return currentResult;
  }
}
