import { create } from 'zustand';
import { apiClient } from '../api/client';
import type { ChatMessage, MessagePart } from '../domain/models/Message';

export interface AgentSession {
  payload: Record<string, any>;
  messages: ChatMessage[];
  isExecuting: boolean;
  error: string | null;
}

interface ChatSessionState {
  sessions: Record<string, AgentSession>;
  
  updateSessionPayload: (agentId: string, payload: Record<string, any>) => void;
  clearSessionHistory: (agentId: string) => void;
  executeAgent: (agentId: string, payload: Record<string, any>) => Promise<void>;
  
  // Helper to ensure session exists
  _initializeSessionIfNeeded: (agentId: string) => void;
}

const createDefaultSession = (): AgentSession => ({
  payload: {},
  messages: [],
  isExecuting: false,
  error: null
});

const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useChatSessionStore = create<ChatSessionState>((set, get) => ({
  sessions: {},

  _initializeSessionIfNeeded: (agentId: string) => {
    const { sessions } = get();
    if (!sessions[agentId]) {
      set({
        sessions: {
          ...sessions,
          [agentId]: createDefaultSession()
        }
      });
    }
  },

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

  executeAgent: async (agentId: string, payload: Record<string, any>) => {
    const { _initializeSessionIfNeeded } = get();
    _initializeSessionIfNeeded(agentId);
    
    // Refresh session ref after potential initialization
    const currentSession = get().sessions[agentId];
    
    // 1. Process User Input into Message Parts
    const userParts: MessagePart[] = [];
    let textContent = '';
    const allInputImages: string[] = [];
    
    Object.entries(payload).forEach(([key, val]) => {
      if (typeof val === 'string' && val.trim() !== '') {
        textContent += (textContent ? '\n\n' : '') + `**${key}**: ${val}`;
      } else if (Array.isArray(val) && val.length > 0) {
        // Collect all images from all fields into a single gallery
        allInputImages.push(...val);
      }
    });

    if (textContent) {
      userParts.push({
        id: generateId('part-txt'),
        type: 'text',
        text: textContent
      });
    }

    if (allInputImages.length > 0) {
      userParts.push({
        id: generateId('part-gallery'),
        type: 'gallery',
        urls: allInputImages
      });
    }

    const userMessage: ChatMessage = {
      id: generateId('msg-user'),
      role: 'user',
      parts: userParts,
      timestamp: Date.now()
    };

    // 2. Add temporary Assistant generating message
    const generatingMessageId = generateId('msg-assistant-gen');
    const generatingMessage: ChatMessage = {
      id: generatingMessageId,
      role: 'assistant',
      parts: [{ id: generateId('part-loading'), type: 'loading' }],
      isGenerating: true,
      timestamp: Date.now() + 1
    };

    set((state) => ({
      sessions: {
        ...state.sessions,
        [agentId]: {
          ...currentSession,
          isExecuting: true,
          error: null,
          messages: [...currentSession.messages, userMessage, generatingMessage]
        }
      }
    }));

    try {
      const result = await apiClient.executeAgent(agentId, payload);
      
      // Update session with actual result
      set((state) => {
        const session = state.sessions[agentId];
        const newMessages = session.messages.map(msg => {
          if (msg.id === generatingMessageId) {
            const resultParts: MessagePart[] = [];
            
            if (result.images && result.images.length > 0) {
              // Assistant output images also go into a gallery if there are multiple, 
              // or just a single image block
              if (result.images.length > 1) {
                resultParts.push({
                  id: generateId('res-gallery'),
                  type: 'gallery',
                  urls: result.images
                });
              } else {
                resultParts.push({
                  id: generateId('res-img'),
                  type: 'image',
                  url: result.images[0]
                });
              }
            }
            
            if (result.content) {
              resultParts.push({
                id: generateId('res-txt'),
                type: 'text',
                text: result.content
              });
            }

            return {
              ...msg,
              isGenerating: false,
              parts: resultParts
            };
          }
          return msg;
        });

        return {
          sessions: {
            ...state.sessions,
            [agentId]: {
              ...session,
              isExecuting: false,
              messages: newMessages
            }
          }
        };
      });
    } catch (e: any) {
      console.error('[ChatSessionStore] Execute agent error:', e);
      
      set((state) => {
        const session = state.sessions[agentId];
        // Replace loading part with error part, or add error message
        const newMessages = session.messages.filter(msg => msg.id !== generatingMessageId);
        
        return {
          sessions: {
            ...state.sessions,
            [agentId]: {
              ...session,
              isExecuting: false,
              error: e.message,
              messages: newMessages
            }
          }
        };
      });
    }
  }
}));
