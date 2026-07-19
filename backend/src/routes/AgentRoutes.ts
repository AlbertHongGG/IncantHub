import { Router } from 'express';
import { AgentController } from '../controllers/AgentController';
import { AgentService } from '../services/AgentService';
import { TagService } from '../services/TagService';
import { PluginManager } from '../plugins/PluginManager';

export function createAgentRoutes(service: AgentService, tagService: TagService, pluginManager: PluginManager): Router {
  const router = Router();
  const controller = new AgentController(service, tagService, pluginManager);

  router.get('/', controller.getAllAgents);
  router.post('/:id/execute', controller.executeAgent);
  router.post('/:id/stream', controller.executeStreamAgent);
  router.post('/:id/tags', controller.addTag);
  router.delete('/:id/tags/:tag', controller.removeTag);

  return router;
}
