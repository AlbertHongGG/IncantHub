import express from 'express';
import cors from 'cors';
import { createAgentRoutes } from './routes/AgentRoutes';
import { AgentService } from './services/AgentService';

export async function createApp() {
  const app = express();

  // Global Middlewares
  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  // Initialize Core Services
  const agentService = new AgentService();
  await agentService.init();

  // Mount Routes
  app.use('/api/prompts', createAgentRoutes(agentService));

  return app;
}
