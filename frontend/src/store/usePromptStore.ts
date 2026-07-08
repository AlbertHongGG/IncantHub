import { create } from 'zustand';
import { apiClient } from '../api/client';
import type { AgentMetadata } from '../api/client';

interface PromptState {
  agents: AgentMetadata[];
  activeCategory: 'text' | 'image';
  selectedAgentId: string | null;
  isLoading: boolean;
  isExecuting: boolean;
  executionResult: string | null;
  error: string | null;

  setCategory: (category: 'text' | 'image') => void;
  selectAgent: (id: string) => void;
  fetchAgents: () => Promise<void>;
  executeAgent: (payload: Record<string, any>) => Promise<void>;
}

export const usePromptStore = create<PromptState>((set, get) => ({
  agents: [],
  activeCategory: 'text',
  selectedAgentId: null,
  isLoading: false,
  isExecuting: false,
  executionResult: null,
  error: null,

  setCategory: (category) => set({ activeCategory: category, selectedAgentId: null, executionResult: null, error: null }),
  selectAgent: (id) => set({ selectedAgentId: id, executionResult: null, error: null }),
  
  fetchAgents: async () => {
    set({ isLoading: true, error: null });
    try {
      const agents = await apiClient.getAgents();
      set({ agents, isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  executeAgent: async (payload: Record<string, any>) => {
    const { selectedAgentId } = get();
    if (!selectedAgentId) return;

    set({ isExecuting: true, executionResult: null, error: null });
    try {
      const result = await apiClient.executeAgent(selectedAgentId, payload);
      set({ executionResult: result, isExecuting: false });
    } catch (e: any) {
      set({ error: e.message, isExecuting: false });
    }
  }
}));
