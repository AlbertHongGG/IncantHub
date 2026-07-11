import { create } from 'zustand';
import { apiClient } from '../api/client';
import type { AgentMetadata } from '../domain/models/Agent';

interface AgentState {
  agents: AgentMetadata[];
  selectedTags: string[];
  selectedCategories: string[];
  availableTags: string[];
  selectedAgentId: string | null;
  isLoading: boolean;
  searchQuery: string;
  isServerOffline: boolean;

  toggleTagFilter: (tag: string) => void;
  toggleCategoryFilter: (category: string) => void;
  selectAgent: (id: string | null) => void;
  fetchAgents: () => Promise<void>;
  addTagToAgent: (agentId: string, tag: string) => Promise<void>;
  removeTagFromAgent: (agentId: string, tag: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  agents: [],
  selectedTags: [],
  selectedCategories: [],
  availableTags: [],
  selectedAgentId: null,
  isLoading: false,
  searchQuery: '',
  isServerOffline: false,

  toggleTagFilter: (tag) => set((state) => {
    const isSelected = state.selectedTags.includes(tag);
    if (isSelected) {
      return { selectedTags: state.selectedTags.filter(t => t !== tag), selectedAgentId: null };
    } else {
      return { selectedTags: [...state.selectedTags, tag], selectedAgentId: null };
    }
  }),
  
  toggleCategoryFilter: (category) => set((state) => {
    const isSelected = state.selectedCategories.includes(category);
    if (isSelected) {
      return { selectedCategories: state.selectedCategories.filter(c => c !== category), selectedAgentId: null };
    } else {
      return { selectedCategories: [...state.selectedCategories, category], selectedAgentId: null };
    }
  }),
  
  selectAgent: (id) => set({ selectedAgentId: id }),

  setSearchQuery: (query) => set({ searchQuery: query }),
  
  fetchAgents: async () => {
    set({ isLoading: true });
    try {
      const agents = await apiClient.getAgents();
      const allTags = new Set<string>();
      agents.forEach(a => a.tags?.forEach(t => allTags.add(t)));
      set({ agents, availableTags: Array.from(allTags), isLoading: false, isServerOffline: false });
    } catch (e: any) {
      console.error('[AgentStore] Fetch agents error:', e);
      set({ isLoading: false, isServerOffline: true });
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
      console.error('[AgentStore] Add tag error:', e);
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
        const newSelectedTags = state.selectedTags.filter(t => allTags.has(t));
        return { agents: updatedAgents, availableTags: Array.from(allTags), selectedTags: newSelectedTags };
      });
    } catch (e: any) {
      console.error('[AgentStore] Remove tag error:', e);
    }
  }
}));
