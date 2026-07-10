import { Request, Response } from 'express';
import { AgentService } from '../services/AgentService';
import { TagService } from '../services/TagService';

export class AgentController {
  constructor(private service: AgentService, private tagService: TagService) {}

  getAllAgents = (req: Request, res: Response) => {
    res.json(this.service.getAllMetadata());
  };

  executeAgent = async (req: Request, res: Response) => {
    const id = req.params.id as string;
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
      console.error(`[AgentController] Error executing agent ${id}:`, error);
      res.status(500).json({ error: error.message });
    }
  };

  addTag = (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { tag } = req.body;

    if (!tag) {
      res.status(400).json({ error: 'Tag is required' });
      return;
    }

    try {
      const updatedTags = this.tagService.addTag(id, tag);
      res.json({ tags: updatedTags });
    } catch (error: any) {
      console.error(`[AgentController] Error adding tag to agent ${id}:`, error);
      res.status(500).json({ error: error.message });
    }
  };

  removeTag = (req: Request, res: Response) => {
    const id = req.params.id as string;
    const tag = req.params.tag as string;

    if (!tag) {
      res.status(400).json({ error: 'Tag is required' });
      return;
    }

    try {
      const updatedTags = this.tagService.removeTag(id, tag);
      res.json({ tags: updatedTags });
    } catch (error: any) {
      console.error(`[AgentController] Error removing tag from agent ${id}:`, error);
      res.status(500).json({ error: error.message });
    }
  };
}
