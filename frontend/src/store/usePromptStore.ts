import { create } from 'zustand';
import { apiClient } from '../api/client';
import type { AgentMetadata, AgentExecutionResult } from '../api/client';

interface PromptState {
  agents: AgentMetadata[];
  selectedTags: string[];
  selectedCategories: string[];
  availableTags: string[];
  selectedAgentId: string | null;
  isLoading: boolean;
  isExecuting: boolean;
  executionResult: AgentExecutionResult | null;
  error: string | null;
  searchQuery: string;
  isServerOffline: boolean;

  toggleTagFilter: (tag: string) => void;
  toggleCategoryFilter: (category: string) => void;
  selectAgent: (id: string | null) => void;
  fetchAgents: () => Promise<void>;
  executeAgent: (payload: Record<string, any>) => Promise<void>;
  addTagToAgent: (agentId: string, tag: string) => Promise<void>;
  removeTagFromAgent: (agentId: string, tag: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
}

export const usePromptStore = create<PromptState>((set, get) => ({
  agents: [],
  selectedTags: [],
  selectedCategories: [],
  availableTags: [],
  selectedAgentId: null,
  isLoading: false,
  isExecuting: false,
  executionResult: null,
  error: null,
  searchQuery: '',
  isServerOffline: false,

  toggleTagFilter: (tag) => set((state) => {
    const isSelected = state.selectedTags.includes(tag);
    if (isSelected) {
      return { selectedTags: state.selectedTags.filter(t => t !== tag), selectedAgentId: null, executionResult: null, error: null };
    } else {
      return { selectedTags: [...state.selectedTags, tag], selectedAgentId: null, executionResult: null, error: null };
    }
  }),
  toggleCategoryFilter: (category) => set((state) => {
    const isSelected = state.selectedCategories.includes(category);
    if (isSelected) {
      return { selectedCategories: state.selectedCategories.filter(c => c !== category), selectedAgentId: null, executionResult: null, error: null };
    } else {
      return { selectedCategories: [...state.selectedCategories, category], selectedAgentId: null, executionResult: null, error: null };
    }
  }),
  selectAgent: (id) => set({ selectedAgentId: id, executionResult: null, error: null }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  fetchAgents: async () => {
    set({ isLoading: true, error: null });
    try {
      const agents = await apiClient.getAgents();
      const allTags = new Set<string>();
      agents.forEach(a => a.tags?.forEach(t => allTags.add(t)));
      set({ agents, availableTags: Array.from(allTags), isLoading: false, isServerOffline: false });
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
  },

  addTagToAgent: async (agentId: string, tag: string) => {
    try {
      const updatedTags = await apiClient.addTag(agentId, tag);
      set((state) => {
        const updatedAgents = state.agents.map(a => 
          a.id === agentId ? { ...a, tags: updatedTags } : a
        );
        const allTags = new Set<string>();
        updatedAgents.forEach(a => a.tags?.forEach(t => allTags.add(t)));
        return { agents: updatedAgents, availableTags: Array.from(allTags) };
      });
    } catch (e: any) {
      console.error('[PromptStore] Add tag error:', e);
      set({ error: 'Failed to add tag: ' + e.message });
    }
  },

  removeTagFromAgent: async (agentId: string, tag: string) => {
    try {
      const updatedTags = await apiClient.removeTag(agentId, tag);
      set((state) => {
        const updatedAgents = state.agents.map(a => 
          a.id === agentId ? { ...a, tags: updatedTags } : a
        );
        const allTags = new Set<string>();
        updatedAgents.forEach(a => a.tags?.forEach(t => allTags.add(t)));
        // Also clean up selectedTags if a tag is removed and no longer exists anywhere
        const newSelectedTags = state.selectedTags.filter(t => allTags.has(t));
        return { agents: updatedAgents, availableTags: Array.from(allTags), selectedTags: newSelectedTags };
      });
    } catch (e: any) {
      console.error('[PromptStore] Remove tag error:', e);
      set({ error: 'Failed to remove tag: ' + e.message });
    }
  }
}));
