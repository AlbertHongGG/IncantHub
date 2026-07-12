import { BaseBackendAgent } from './BaseBackendAgent';
import { ProviderFactory } from '../providers/ProviderFactory';

import { PoliteCommunicatorAgent } from './text/PoliteCommunicator';
import { VirtualTryOnAgent } from './image/VirtualTryOn';
import { JapaneseAnalyzerAgent } from './text/JapaneseAnalyzer';
import { CharacterRefSheetAgent } from './image/CharacterRefSheet';

export function getAllAgents(): BaseBackendAgent[] {
  // We use the ProviderFactory from the MultiAgent framework directly.
  return [
    new PoliteCommunicatorAgent(ProviderFactory.createProvider('polite_communicator')),
    new VirtualTryOnAgent(ProviderFactory.createProvider('virtual_try_on')),
    new JapaneseAnalyzerAgent(ProviderFactory.createProvider('japanese_analyzer')),
    new CharacterRefSheetAgent(ProviderFactory.createProvider('character_ref_sheet')),
  ];
}
