import { createApp } from './app';
import { config } from './config';

async function startServer() {
  try {
    const app = await createApp();
    
    app.listen(config.server.port, () => {
      console.log(`[Server] IncantHub Backend running on port ${config.server.port}`);
    });
  } catch (error) {
    console.error('[Server] Fatal Error during startup:', error);
    process.exit(1);
  }
}

startServer();
