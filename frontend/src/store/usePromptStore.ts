import { create } from 'zustand';
import { apiClient } from '../api/client';
import type { PromptMetadata } from '../api/client';

interface PromptState {
  prompts: PromptMetadata[];
  activeCategory: 'text' | 'image';
  selectedPromptId: string | null;
  isLoading: boolean;
  isExecuting: boolean;
  executionResult: string | null;
  error: string | null;

  setCategory: (category: 'text' | 'image') => void;
  selectPrompt: (id: string) => void;
  fetchPrompts: () => Promise<void>;
  executePrompt: (userPrompt: string, images?: string[]) => Promise<void>;
}

export const usePromptStore = create<PromptState>((set, get) => ({
  prompts: [],
  activeCategory: 'text',
  selectedPromptId: null,
  isLoading: false,
  isExecuting: false,
  executionResult: null,
  error: null,

  setCategory: (category) => set({ activeCategory: category, selectedPromptId: null, executionResult: null, error: null }),
  selectPrompt: (id) => set({ selectedPromptId: id, executionResult: null, error: null }),
  
  fetchPrompts: async () => {
    set({ isLoading: true, error: null });
    try {
      const prompts = await apiClient.getPrompts();
      set({ prompts, isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  executePrompt: async (userPrompt, images) => {
    const { selectedPromptId } = get();
    if (!selectedPromptId) return;

    set({ isExecuting: true, executionResult: null, error: null });
    try {
      const result = await apiClient.executePrompt(selectedPromptId, userPrompt, images);
      set({ executionResult: result, isExecuting: false });
    } catch (e: any) {
      set({ error: e.message, isExecuting: false });
    }
  }
}));
