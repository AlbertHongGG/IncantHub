import { Router } from 'express';
import { PluginController } from '../controllers/PluginController';
import { PluginManager } from '../plugins/PluginManager';
import { PluginSettingsService } from '../services/PluginSettingsService';

export function createPluginRoutes(pluginManager: PluginManager, settingsService: PluginSettingsService): Router {
  const router = Router();
  const controller = new PluginController(pluginManager, settingsService);

  router.get('/', controller.getAllPlugins);
  router.put('/:id/status', controller.updatePluginStatus);

  return router;
}
