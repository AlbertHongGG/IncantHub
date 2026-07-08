import { PoliteCommunicatorAgent } from './PoliteCommunicator';
import { AIProvider } from '../../../../../_Framework/MultiAgent/src/providers/AIProvider';
import { BaseAgent } from '../BaseAgent';

export function loadTextAgents(createProvider: (agentId: string) => AIProvider): BaseAgent[] {
  return [
    new PoliteCommunicatorAgent(createProvider('polite-communicator'))
  ];
}
