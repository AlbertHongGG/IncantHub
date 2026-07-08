import { Request, Response } from 'express';
import { AgentService } from '../agents/services/AgentService';
import { AgentRunner } from '../agents/engine/AgentRunner';

export class AgentController {
  private runner: AgentRunner;

  constructor(private service: AgentService) {
    this.runner = new AgentRunner();
  }

  getAllConfigs = (req: Request, res: Response) => {
    res.json(this.service.getAllConfigs());
  };

  createAgent = async (req: Request, res: Response) => {
    try {
      await this.service.addAgent(req.body);
      res.status(201).json({ message: 'Agent created successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  updateAgent = async (req: Request, res: Response) => {
    try {
      await this.service.updateAgent(req.params.id, req.body);
      res.json({ message: 'Agent updated successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  deleteAgent = async (req: Request, res: Response) => {
    try {
      await this.service.deleteAgent(req.params.id);
      res.json({ message: 'Agent deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  executeAgent = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userPrompt, images, sessionId } = req.body;
    
    const config = this.service.getAgentConfig(id);
    if (!config) {
      res.status(404).json({ error: 'Prompt Agent not found' });
      return;
    }
    
    try {
      const result = await this.runner.execute(config, userPrompt, { images, sessionId });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
