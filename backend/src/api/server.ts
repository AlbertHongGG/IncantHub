import express from 'express';
import cors from 'cors';
import { config } from '../config'; 
import { AgentService } from '../agents/services/AgentService';
import { createAgentRoutes } from './AgentRoutes';

const app = express();
app.use(cors());
app.use(express.json());

const service = new AgentService();

async function startServer() {
  try {
    await service.init();
    console.log('[Server] Stateless Agent Engine initialized successfully.');
  } catch (e) {
    console.error("[Server] Failed to initialize AgentService:", e);
    process.exit(1);
  }

  // Mount API Routes
  app.use('/api/prompts', createAgentRoutes(service));

  app.listen(config.server.port, () => {
    console.log(`[Server] IncantHub Backend running on port ${config.server.port}`);
  });
}

startServer();
