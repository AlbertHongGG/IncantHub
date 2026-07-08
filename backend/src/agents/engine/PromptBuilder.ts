import { AgentCategory } from '../models/AgentCategory';
import { AgentConfig } from '../models/AgentConfig';

export interface IPromptBuilder {
  buildSystemPrompt(category: AgentCategory, config: AgentConfig): string;
  buildUserPrompt(input: string): string;
}

export class DefaultPromptBuilder implements IPromptBuilder {
  buildSystemPrompt(category: AgentCategory, config: AgentConfig): string {
    const parts = [
      `[ROLE]\n${config.role}`,
    ];

    if (config.taskInstruction) {
      parts.push(`[TASK_INSTRUCTION]\n${config.taskInstruction}`);
    }

    parts.push(
      `[INPUT_FORMAT]\n${category.inputExplanation}\n${category.inputSchema}`,
      `[OUTPUT_FORMAT]\n${category.outputExplanation}\n${category.outputSchema}`,
      `[RULES]\n${category.hardRules}`
    );

    return parts.join('\n\n');
  }

  buildUserPrompt(input: string): string {
    return JSON.stringify({ input });
  }
}
