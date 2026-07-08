export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  categoryId: string; // e.g. 'text' | 'image'
  role: string;
  taskInstruction: string;
  provider: string; // e.g. 'geminiflow', 'ollama', 'vertexai'
  model: string;    // e.g. 'gemini-1.5-flash'
}
