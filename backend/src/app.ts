import express from 'express';
import cors from 'cors';
import { createAgentRoutes } from './routes/AgentRoutes';
import { createPluginRoutes } from './routes/pluginRoutes';
import { AgentService } from './services/AgentService';
import { TagService } from './services/TagService';
import { PluginSettingsService } from './services/PluginSettingsService';
import { PluginManager } from './plugins/PluginManager';

export async function createApp() {
  const app = express();

  // Global Middlewares
  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  // Initialize Core Services
  const tagService = new TagService();
  const agentService = new AgentService(tagService);
  const pluginSettingsService = new PluginSettingsService();
  const pluginManager = new PluginManager(pluginSettingsService);
  await agentService.init();
  await pluginManager.init();

  // Mount Routes
  app.use('/api/prompts', createAgentRoutes(agentService, tagService, pluginManager));
  app.use('/api/plugins', createPluginRoutes(pluginManager, pluginSettingsService));

  return app;
}
