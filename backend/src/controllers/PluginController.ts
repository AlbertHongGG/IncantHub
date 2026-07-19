import { Request, Response } from 'express';
import { PluginManager } from '../plugins/PluginManager';
import { PluginSettingsService } from '../services/PluginSettingsService';

export class PluginController {
  constructor(
    private pluginManager: PluginManager,
    private settingsService: PluginSettingsService
  ) {}

  getAllPlugins = (req: Request, res: Response) => {
    const plugins = this.pluginManager.getPlugins();
    const settings = this.settingsService.getSettings();

    const result = plugins.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      isEnabled: settings[p.id]?.isEnabled ?? false
    }));

    res.json({ plugins: result });
  };

  updatePluginStatus = (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { isEnabled } = req.body;

    if (typeof isEnabled !== 'boolean') {
      res.status(400).json({ error: 'isEnabled must be a boolean' });
      return;
    }

    try {
      const updatedSetting = this.settingsService.updatePluginStatus(id, isEnabled);
      res.json({ setting: updatedSetting });
    } catch (error: any) {
      console.error(`[PluginController] Error updating plugin ${id}:`, error);
      res.status(500).json({ error: error.message });
    }
  };
}
