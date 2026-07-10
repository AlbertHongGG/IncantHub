import { create } from 'zustand';
import { apiClient } from '../api/client';
import type { AgentMetadata, AgentExecutionResult } from '../api/client';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content?: string;
  images?: string[];
  isGenerating?: boolean;
  timestamp: number;
}

export interface AgentSession {
  payload: Record<string, any>;
  messages: ChatMessage[];
  isExecuting: boolean;
  error: string | null;
}

interface PromptState {
  agents: AgentMetadata[];
  selectedTags: string[];
  selectedCategories: string[];
  availableTags: string[];
  selectedAgentId: string | null;
  isLoading: boolean;
  searchQuery: string;
  isServerOffline: boolean;
  sessions: Record<string, AgentSession>;

  toggleTagFilter: (tag: string) => void;
  toggleCategoryFilter: (category: string) => void;
  selectAgent: (id: string | null) => void;
  fetchAgents: () => Promise<void>;
  executeAgent: (payload: Record<string, any>) => Promise<void>;
  addTagToAgent: (agentId: string, tag: string) => Promise<void>;
  removeTagFromAgent: (agentId: string, tag: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  
  updateSessionPayload: (agentId: string, payload: Record<string, any>) => void;
  clearSessionHistory: (agentId: string) => void;
}

const createDefaultSession = (): AgentSession => ({
  payload: {},
  messages: [],
  isExecuting: false,
  error: null
});

export const usePromptStore = create<PromptState>((set, get) => ({
  agents: [],
  selectedTags: [],
  selectedCategories: [],
  availableTags: [],
  selectedAgentId: null,
  isLoading: false,
  searchQuery: '',
  isServerOffline: false,
  sessions: {},

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
  
  selectAgent: (id) => set((state) => {
    if (!id) return { selectedAgentId: null };
    
    // Initialize session if it doesn't exist
    if (!state.sessions[id]) {
      return { 
        selectedAgentId: id,
        sessions: {
          ...state.sessions,
          [id]: createDefaultSession()
        }
      };
    }
    return { selectedAgentId: id };
  }),

  setSearchQuery: (query) => set({ searchQuery: query }),
  
  updateSessionPayload: (agentId, payload) => set((state) => {
    const session = state.sessions[agentId] || createDefaultSession();
    return {
      sessions: {
        ...state.sessions,
        [agentId]: { ...session, payload }
      }
    };
  }),

  clearSessionHistory: (agentId) => set((state) => {
    const session = state.sessions[agentId];
    if (!session) return state;
    return {
      sessions: {
        ...state.sessions,
        [agentId]: { ...session, messages: [] }
      }
    };
  }),

  fetchAgents: async () => {
    set({ isLoading: true });
    try {
      const agents = await apiClient.getAgents();
      const allTags = new Set<string>();
      agents.forEach(a => a.tags?.forEach(t => allTags.add(t)));
      set({ agents, availableTags: Array.from(allTags), isLoading: false, isServerOffline: false });
    } catch (e: any) {
      console.error('[PromptStore] Fetch agents error:', e);
      set({ isLoading: false, isServerOffline: true });
    }
  },

  executeAgent: async (payload: Record<string, any>) => {
    const { selectedAgentId, sessions } = get();
    if (!selectedAgentId) return;

    const currentSession = sessions[selectedAgentId] || createDefaultSession();
    
    // 1. Add User Message
    let userContentParts = [];
    let userImages: string[] = [];
    
    Object.entries(payload).forEach(([key, val]) => {
      if (typeof val === 'string' && val.trim() !== '') {
        userContentParts.push(`**${key}**: ${val}`);
      } else if (Array.isArray(val) && val.length > 0) {
        // Assuming arrays are image base64s based on our current payload structure
        userImages = [...userImages, ...val];
      }
    });

    const userMessage: ChatMessage = {
      id: Date.now().toString() + '-user',
      role: 'user',
      content: userContentParts.join('\n\n'),
      images: userImages.length > 0 ? userImages : undefined,
      timestamp: Date.now()
    };

    // 2. Add temporary Assistant generating message
    const generatingMessageId = Date.now().toString() + '-assistant-gen';
    const generatingMessage: ChatMessage = {
      id: generatingMessageId,
      role: 'assistant',
      isGenerating: true,
      timestamp: Date.now() + 1
    };

    set((state) => ({
      sessions: {
        ...state.sessions,
        [selectedAgentId]: {
          ...currentSession,
          isExecuting: true,
          error: null,
          messages: [...currentSession.messages, userMessage, generatingMessage]
        }
      }
    }));

    try {
      const result = await apiClient.executeAgent(selectedAgentId, payload);
      
      // Update session with actual result
      set((state) => {
        const session = state.sessions[selectedAgentId];
        const newMessages = session.messages.map(msg => {
          if (msg.id === generatingMessageId) {
            return {
              ...msg,
              isGenerating: false,
              content: result.content,
              images: result.images
            };
          }
          return msg;
        });

        return {
          sessions: {
            ...state.sessions,
            [selectedAgentId]: {
              ...session,
              isExecuting: false,
              messages: newMessages
            }
          },
          isServerOffline: false
        };
      });
    } catch (e: any) {
      console.error('[PromptStore] Execute agent error:', e);
      const isConnectionRefused = e.message.includes('Failed to fetch') || e.message.includes('connection');
      
      set((state) => {
        const session = state.sessions[selectedAgentId];
        // Remove the generating message on error, add error state
        const newMessages = session.messages.filter(msg => msg.id !== generatingMessageId);
        
        return {
          sessions: {
            ...state.sessions,
            [selectedAgentId]: {
              ...session,
              isExecuting: false,
              error: e.message,
              messages: newMessages
            }
          },
          isServerOffline: isConnectionRefused ? true : state.isServerOffline
        };
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
      console.error('[PromptStore] Remove tag error:', e);
    }
  }
}));
