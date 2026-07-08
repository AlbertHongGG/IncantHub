import { VirtualTryOnAgent } from './VirtualTryOn';
import { AIProvider } from '../../../../../_Framework/MultiAgent/src/providers/AIProvider';
import { BaseAgent } from '../BaseAgent';

export function loadImageAgents(createProvider: (agentId: string) => AIProvider): BaseAgent[] {
  return [
    new VirtualTryOnAgent(createProvider('virtual-try-on'))
  ];
}
