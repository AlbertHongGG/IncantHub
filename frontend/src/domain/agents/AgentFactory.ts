import type { AgentMetadata } from '../models/Agent';
import { BaseFrontendAgent } from './BaseFrontendAgent';
import { UniversalFrontendAgent } from './UniversalFrontendAgent';

export class AgentFactory {
  static createAgent(metadata: AgentMetadata): BaseFrontendAgent {
    // We now have a 100% Schema-Driven UI.
    // The UniversalFrontendAgent perfectly handles any agent based on its schema.
    return new UniversalFrontendAgent(metadata);
  }
}
