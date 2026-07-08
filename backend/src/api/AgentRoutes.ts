import { Router } from 'express';
import { AgentController } from './AgentController';
import { AgentService } from '../agents/services/AgentService';

export function createAgentRoutes(service: AgentService): Router {
  const router = Router();
  const controller = new AgentController(service);

  router.get('/', controller.getAllConfigs);
  router.post('/', controller.createAgent);
  router.put('/:id', controller.updateAgent);
  router.delete('/:id', controller.deleteAgent);
  router.post('/:id/execute', controller.executeAgent);

  return router;
}
