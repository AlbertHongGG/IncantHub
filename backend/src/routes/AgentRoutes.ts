import { Router } from 'express';
import { AgentController } from '../controllers/AgentController';
import { AgentService } from '../services/AgentService';

export function createAgentRoutes(service: AgentService): Router {
  const router = Router();
  const controller = new AgentController(service);

  router.get('/', controller.getAllAgents);
  router.post('/:id/execute', controller.executeAgent);

  return router;
}
