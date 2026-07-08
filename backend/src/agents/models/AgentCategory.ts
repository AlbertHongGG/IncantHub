export interface AgentCategory {
  readonly id: string;
  readonly name: string;
  readonly inputExplanation: string;
  readonly inputSchema: string;
  readonly outputExplanation: string;
  readonly outputSchema: string;
  readonly hardRules: string;
}
