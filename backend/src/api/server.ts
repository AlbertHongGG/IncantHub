import express from 'express';
import cors from 'cors';
import { config } from '../config'; 
import { AgentRegistry } from '../AgentRegistry';

const app = express();
app.use(cors());
app.use(express.json());

let registry: AgentRegistry;
try {
  registry = new AgentRegistry();
} catch (e) {
  console.error("Failed to initialize AgentRegistry. Check your configuration and providers:", e);
  process.exit(1);
}

app.get('/api/prompts', (req, res) => {
  res.json(registry.getAllMetadata());
});

app.post('/api/prompts/:id/execute', async (req, res) => {
  const { id } = req.params;
  const { userPrompt, images } = req.body;
  
  const agent = registry.getAgent(id);
  if (!agent) {
    return res.status(404).json({ error: 'Prompt Agent not found' });
  }
  
  try {
    const result = await agent.executePrompt({ userPrompt, images });
    res.json({ result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(config.server.port, () => {
  console.log(`IncantHub Backend running on port ${config.server.port}`);
});
