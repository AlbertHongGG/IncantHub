import type { AgentExecutionResult, AgentMetadata } from '../types/agent';

export interface PluginConfig {
  isEnabled: boolean;
  [key: string]: any;
}

export abstract class BasePlugin {
  public abstract readonly id: string;
  public abstract readonly name: string;
  public abstract readonly description: string;
  
  /**
   * The agent categories that this plugin supports.
   * Empty array means it supports all categories.
   */
  public abstract readonly supportedAgentCategories: string[];

  /**
   * Determine if the plugin should process the given agent result.
   */
  public supports(agentMeta: AgentMetadata): boolean {
    if (this.supportedAgentCategories.length === 0) return true;
    return this.supportedAgentCategories.includes(agentMeta.category);
  }

  /**
   * Process the execution result.
   */
  public abstract process(
    result: AgentExecutionResult,
    agentMeta: AgentMetadata,
    pluginConfig: PluginConfig
  ): Promise<AgentExecutionResult>;
}
