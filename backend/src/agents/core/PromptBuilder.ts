import { AgentCategory } from './AgentCategory';

export interface PromptDefinition {
  role: string;
  taskInstruction?: string;
  statusDefinitions?: string;
}

export class PromptBuilder {
  static buildSystemPrompt(category: AgentCategory, definition: PromptDefinition): string {
    const parts = [
      definition.role,
      '',
      '[INPUT_EXPLANATION]',
      category.inputExplanation,
      '[INPUT_SCHEMA]',
      category.inputSchema,
      '',
      '[OUTPUT_EXPLANATION]',
      category.outputExplanation,
      '[OUTPUT_SCHEMA]',
      category.outputSchema,
      ''
    ];

    if (definition.statusDefinitions) {
      parts.push('[STATUS_DEFINITIONS]', definition.statusDefinitions, '');
    }

    if (definition.taskInstruction) {
      parts.push('[TASK_INSTRUCTION]', definition.taskInstruction, '');
    }

    parts.push('[HARD_RULES]', category.hardRules);

    return parts.join('\n');
  }

  static buildUserPrompt(input: string): string {
    return `{\n  "input": "${input.replace(/"/g, '\\"')}"\n}`;
  }
}
