export interface PromptMetadata {
  id: string;
  title: string;
  description: string;
  category: 'text' | 'image';
  tags?: string[];
  icon?: string;
}

export const API_URL = 'http://localhost:3001/api';

export const apiClient = {
  getPrompts: async (): Promise<PromptMetadata[]> => {
    const res = await fetch(`${API_URL}/prompts`);
    if (!res.ok) throw new Error('Failed to fetch prompts');
    const data = await res.json();
    
    const prompts: PromptMetadata[] = [];
    for (const categoryId in data) {
      for (const config of data[categoryId]) {
        prompts.push({
          id: config.id,
          title: config.name,
          description: config.description,
          category: config.categoryId as 'text' | 'image',
        });
      }
    }
    return prompts;
  },
  executePrompt: async (id: string, userPrompt: string, images?: string[]): Promise<string> => {
    const res = await fetch(`${API_URL}/prompts/${id}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userPrompt, images })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Execution failed');
    }
    const data = await res.json();
    return data.result;
  }
};
