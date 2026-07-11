import type { AgentMetadata } from '../models/Agent';
import { BaseFrontendAgent } from './BaseFrontendAgent';
import { VirtualTryOnFrontendAgent } from './VirtualTryOnFrontendAgent';
import { PoliteCommunicatorFrontendAgent } from './PoliteCommunicatorFrontendAgent';
import { FallbackFrontendAgent } from './FallbackFrontendAgent';

export class AgentFactory {
  static createAgent(metadata: AgentMetadata): BaseFrontendAgent {
    const nameStr = metadata.name.toLowerCase();
    
    if (nameStr.includes('try on')) {
      return new VirtualTryOnFrontendAgent(metadata);
    }
    
    if (nameStr.includes('polite') || nameStr.includes('communicator')) {
      return new PoliteCommunicatorFrontendAgent(metadata);
    }
    
    return new FallbackFrontendAgent(metadata);
  }
}
