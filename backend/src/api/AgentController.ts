import { Request, Response } from 'express';
import { AgentService } from '../services/AgentService';

export class AgentController {
  constructor(private service: AgentService) {}

  getAllAgents = (req: Request, res: Response) => {
    res.json(this.service.getAllMetadata());
  };

  executeAgent = async (req: Request, res: Response) => {
    const { id } = req.params;
    const inputs = req.body;
    
    const agent = this.service.getAgent(id);
    if (!agent) {
      res.status(404).json({ error: 'Agent not found' });
      return;
    }
    
    try {
      const result = await agent.execute(inputs);
      res.json({ result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
