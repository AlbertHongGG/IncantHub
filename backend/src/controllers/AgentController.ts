import { Request, Response } from 'express';
import { AgentService } from '../services/AgentService';
import { TagService } from '../services/TagService';

import { PluginManager } from '../plugins/PluginManager';

export class AgentController {
  constructor(private service: AgentService, private tagService: TagService, private pluginManager: PluginManager) {}

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
      const processedResult = await this.pluginManager.applyPlugins(result, agent.getMetadata());
      res.json({ result: processedResult });
    } catch (error: any) {
      console.error(`[AgentController] Error executing agent ${id}:`, error);
      res.status(500).json({ error: error.message });
    }
  };

  executeStreamAgent = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const inputs = req.body;
    
    const agent = this.service.getAgent(id);
    if (!agent) {
      res.status(404).json({ error: 'Agent not found' });
      return;
    }
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    // Important: flush headers so the connection is established immediately
    res.flushHeaders();

    try {
      const stream = agent.executeStream(inputs);
      for await (const chunk of stream) {
        console.log(`[AgentController] Streaming chunk for ${id}:`, chunk);
        const processedChunk = await this.pluginManager.applyPlugins(chunk, agent.getMetadata());
        res.write(`data: ${JSON.stringify(processedChunk)}\n\n`);
      }
      res.end();
    } catch (error: any) {
      console.error(`[AgentController] Error streaming agent ${id}:`, error);
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
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
