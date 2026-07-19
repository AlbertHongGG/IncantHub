import { create } from 'zustand';
import { PluginInfo, fetchPlugins, updatePluginStatus } from '../api/pluginApi';

interface PluginState {
  plugins: PluginInfo[];
  isLoading: boolean;
  error: string | null;
  loadPlugins: () => Promise<void>;
  togglePlugin: (id: string, isEnabled: boolean) => Promise<void>;
}

export const usePluginStore = create<PluginState>((set, get) => ({
  plugins: [],
  isLoading: false,
  error: null,

  loadPlugins: async () => {
    set({ isLoading: true, error: null });
    try {
      const plugins = await fetchPlugins();
      set({ plugins, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  togglePlugin: async (id: string, isEnabled: boolean) => {
    // Optimistic update
    const previousPlugins = get().plugins;
    set({
      plugins: previousPlugins.map(p => 
        p.id === id ? { ...p, isEnabled } : p
      )
    });

    try {
      await updatePluginStatus(id, isEnabled);
    } catch (error: any) {
      // Revert on error
      set({ plugins: previousPlugins, error: error.message });
    }
  }
}));
