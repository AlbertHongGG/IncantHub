import { FallbackForm } from './FallbackForm';
import { VirtualTryOnForm } from './VirtualTryOnForm';

export const AgentFormRegistry: Record<string, React.ElementType> = {
  // Map agent ID or Category to a specific custom form.
  // For demonstration, assuming the virtual try on agent has an ID or category matching this key.
  // You can adjust the keys based on how your backend identifies agents.
  'virtual-try-on': VirtualTryOnForm,
};

export function getAgentForm(agentId: string, category: string): React.ElementType {
  // Match by specific ID first, then by category, then fallback
  if (AgentFormRegistry[agentId]) {
    return AgentFormRegistry[agentId];
  }
  if (AgentFormRegistry[category]) {
    return AgentFormRegistry[category];
  }
  return FallbackForm;
}
