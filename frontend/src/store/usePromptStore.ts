import { create } from 'zustand';
import { apiClient } from '../api/client';
import type { AgentMetadata, AgentExecutionResult } from '../api/client';

interface PromptState {
  agents: AgentMetadata[];
  activeCategory: 'text' | 'image';
  selectedAgentId: string | null;
  isLoading: boolean;
  isExecuting: boolean;
  executionResult: AgentExecutionResult | null;
  error: string | null;
  searchQuery: string;
  isServerOffline: boolean;

  setCategory: (category: 'text' | 'image') => void;
  selectAgent: (id: string | null) => void;
  fetchAgents: () => Promise<void>;
  executeAgent: (payload: Record<string, any>) => Promise<void>;
  setSearchQuery: (query: string) => void;
}

export const usePromptStore = create<PromptState>((set, get) => ({
  agents: [],
  activeCategory: 'text',
  selectedAgentId: null,
  isLoading: false,
  isExecuting: false,
  executionResult: null,
  error: null,
  searchQuery: '',
  isServerOffline: false,

  setCategory: (category) => set({ activeCategory: category, selectedAgentId: null, executionResult: null, error: null }),
  selectAgent: (id) => set({ selectedAgentId: id, executionResult: null, error: null }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  fetchAgents: async () => {
    set({ isLoading: true, error: null });
    try {
      const agents = await apiClient.getAgents();
      set({ agents, isLoading: false, isServerOffline: false });
    } catch (e: any) {
      console.error('[PromptStore] Fetch agents error:', e);
      // Mark server as offline if fetch fails (typically ERR_CONNECTION_REFUSED)
      set({ error: e.message, isLoading: false, isServerOffline: true });
    }
  },

  executeAgent: async (payload: Record<string, any>) => {
    const { selectedAgentId } = get();
    if (!selectedAgentId) return;

    set({ isExecuting: true, executionResult: null, error: null });
    try {
      const result = await apiClient.executeAgent(selectedAgentId, payload);
      set({ executionResult: result, isExecuting: false, isServerOffline: false });
    } catch (e: any) {
      console.error('[PromptStore] Execute agent error:', e);
      const isConnectionRefused = e.message.includes('Failed to fetch') || e.message.includes('connection');
      set({ 
        error: e.message, 
        isExecuting: false,
        isServerOffline: isConnectionRefused ? true : get().isServerOffline
      });
    }
  }
}));
