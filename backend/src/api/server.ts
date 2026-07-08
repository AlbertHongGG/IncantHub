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
    console.log('[Server] AgentRegistry Data-Driven engine initialized successfully.');
  } catch (e) {
    console.error("[Server] Failed to initialize AgentRegistry:", e);
    process.exit(1);
  }

  app.get('/api/prompts', (req, res) => {
    res.json(registry.getAllConfigs());
  });

  app.post('/api/prompts', async (req, res) => {
    try {
      await registry.addAgent(req.body);
      res.status(201).json({ message: 'Agent created successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put('/api/prompts/:id', async (req, res) => {
    try {
      await registry.updateAgent(req.params.id, req.body);
      res.json({ message: 'Agent updated successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete('/api/prompts/:id', async (req, res) => {
    try {
      await registry.deleteAgent(req.params.id);
      res.json({ message: 'Agent deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
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
