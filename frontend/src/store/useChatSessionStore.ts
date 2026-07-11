import { create } from 'zustand';
import { apiClient } from '../api/client';
import type { ChatMessage, MessagePart } from '../domain/models/Message';

import { BaseFrontendAgent } from '../domain/agents/BaseFrontendAgent';
import { generateId } from '../utils/id';

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
  executeAgent: (agent: BaseFrontendAgent, payload: Record<string, any>) => Promise<void>;
  
  // Helper to ensure session exists
  _initializeSessionIfNeeded: (agentId: string) => void;
}

const createDefaultSession = (): AgentSession => ({
  payload: {},
  messages: [],
  isExecuting: false,
  error: null
});


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

  executeAgent: async (agent: BaseFrontendAgent, payload: Record<string, any>) => {
    const agentId = agent.metadata.id;
    const { _initializeSessionIfNeeded } = get();
    _initializeSessionIfNeeded(agentId);
    
    const currentSession = get().sessions[agentId];
    
    // 1. Delegate User Message creation to the Domain Agent!
    const userParts = agent.formatUserMessageParts(payload);
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

    const abortController = new AbortController();

    try {
      const stream = apiClient.executeAgentStream(agentId, payload, { signal: abortController.signal });

      let isFirstChunk = true;
      let finalResultPayload: any = null;

      for await (const chunk of stream) {
        // We capture the last chunk's raw payload to format it if needed, or we just rely on chunks.
        // Actually, chunk is of type AgentExecutionResult.
        // For 'text' agents, we usually want to append.
        finalResultPayload = chunk;
        
        set((state) => {
          const session = state.sessions[agentId];
          const newMessages = session.messages.map(msg => {
            if (msg.id === generatingMessageId) {
              
              if (isFirstChunk) {
                return {
                  ...msg,
                  isGenerating: true, // Still generating
                  parts: agent.formatAssistantMessageParts(chunk)
                };
              } else {
                // If streaming, we just append to text
                const formattedParts = agent.formatAssistantMessageParts(chunk);
                const currentParts = [...msg.parts];
                
                if (formattedParts.length === 0) {
                  return msg;
                }
                
                // Extremely simple merge: assuming the agent returns 1 part (text)
                if (currentParts[0]?.type === 'text' && formattedParts[0]?.type === 'text') {
                  currentParts[0] = {
                    ...currentParts[0],
                    text: currentParts[0].text + (formattedParts[0].text || '')
                  };
                } else {
                  // Fallback: replace parts entirely (e.g. for images)
                  return {
                    ...msg,
                    parts: formattedParts
                  };
                }

                return {
                  ...msg,
                  parts: currentParts
                };
              }
            }
            return msg;
          });

          return {
            sessions: {
              ...state.sessions,
              [agentId]: {
                ...session,
                messages: newMessages
              }
            }
          };
        });
        
        isFirstChunk = false;
      }

      // Stream completed
      set((state) => {
        const session = state.sessions[agentId];
        const newMessages = session.messages.map(msg => {
          if (msg.id === generatingMessageId) {
            return {
              ...msg,
              isGenerating: false
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
