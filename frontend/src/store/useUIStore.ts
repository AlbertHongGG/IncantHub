import { create } from 'zustand';

interface UIState {
  isPluginModalOpen: boolean;
  openPluginModal: () => void;
  closePluginModal: () => void;
  togglePluginModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isPluginModalOpen: false,
  openPluginModal: () => set({ isPluginModalOpen: true }),
  closePluginModal: () => set({ isPluginModalOpen: false }),
  togglePluginModal: () => set((state) => ({ isPluginModalOpen: !state.isPluginModalOpen })),
}));
