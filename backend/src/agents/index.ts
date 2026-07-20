import { BaseBackendAgent } from './BaseBackendAgent';
import { ProviderFactory } from '../providers/ProviderFactory';

import { PoliteCommunicatorAgent } from './text/PoliteCommunicator';
import { VirtualTryOnAgent } from './image/VirtualTryOn';
import { JapaneseAnalyzerAgent } from './text/JapaneseAnalyzer';
import { CharacterRefSheetAgent } from './image/CharacterRefSheet';
import { KoreanIDPhotoAgent } from './image/KoreanIDPhoto';

export function getAllAgents(): BaseBackendAgent[] {
  return [
    new PoliteCommunicatorAgent(ProviderFactory.createProvider('polite_communicator')),
    new VirtualTryOnAgent(ProviderFactory.createProvider('virtual_try_on')),
    new JapaneseAnalyzerAgent(ProviderFactory.createProvider('japanese_analyzer')),
    new CharacterRefSheetAgent(ProviderFactory.createProvider('character_ref_sheet')),
    new KoreanIDPhotoAgent(ProviderFactory.createProvider('korean_id_photo')),
  ];
}
