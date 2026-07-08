import express from 'express';
import cors from 'cors';
import { config } from '../config'; 
import { AgentRegistry } from '../AgentRegistry';

const app = express();
app.use(cors());
app.use(express.json());

const registry = new AgentRegistry();

async function startServer() {
  try {
    await registry.init();
    console.log('[Server] AgentRegistry Auto-Discovery completed successfully.');
  } catch (e) {
    console.error("[Server] Failed to initialize AgentRegistry. Check your configuration and providers:", e);
    process.exit(1);
  }

  app.get('/api/prompts', (req, res) => {
    res.json(registry.getAllMetadata());
  });

  app.post('/api/prompts/:id/execute', async (req, res) => {
    const { id } = req.params;
    const { userPrompt, images, sessionId } = req.body;
    
    const agent = registry.getAgent(id);
    if (!agent) {
      return res.status(404).json({ error: 'Prompt Agent not found' });
    }
    
    try {
      const result = await agent.executePrompt(userPrompt, { images, sessionId });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.listen(config.server.port, () => {
    console.log(`[Server] IncantHub Backend running on port ${config.server.port}`);
  });
}

startServer();
