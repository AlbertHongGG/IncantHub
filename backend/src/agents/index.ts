import { loadTextAgents } from './text';
import { loadImageAgents } from './image';
import { AIProvider } from '../../../../_Framework/MultiAgent/src/providers/AIProvider';
import { BaseAgent } from './BaseAgent';

export function loadAllAgents(createProvider: (agentId: string) => AIProvider): BaseAgent[] {
  return [
    ...loadTextAgents(createProvider),
    ...loadImageAgents(createProvider)
  ];
}
