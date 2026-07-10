import { Router } from 'express';
import { AgentController } from '../controllers/AgentController';
import { AgentService } from '../services/AgentService';
import { TagService } from '../services/TagService';

export function createAgentRoutes(service: AgentService, tagService: TagService): Router {
  const router = Router();
  const controller = new AgentController(service, tagService);

  router.get('/', controller.getAllAgents);
  router.post('/:id/execute', controller.executeAgent);
  router.post('/:id/tags', controller.addTag);
  router.delete('/:id/tags/:tag', controller.removeTag);

  return router;
}
