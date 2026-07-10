import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Find the .env file in the project root
const envPath = path.resolve(__dirname, '..', '..', '..', '.env');
if (!fs.existsSync(envPath)) {
  console.warn(`[Warning] .env file not found at ${envPath}. Proceeding with process.env only.`);
} else {
  dotenv.config({ path: envPath });
}

interface ServerConfig {
  port: number;
}

interface AppConfig {
  server: ServerConfig;
  getAgentConfig: (agentId: string) => { provider: string; model: string };
}

// Validate essential global environment variables
const port = parseInt(process.env.PORT || '3001', 10);

export const config: AppConfig = {
  server: {
    port,
  },
  
  // Safe accessor for agent-specific configurations
  getAgentConfig: (agentId: string) => {
    const normalizedId = agentId.toUpperCase().replace(/-/g, '_');
    const providerEnv = `AGENT_${normalizedId}_PROVIDER`;
    const modelEnv = `AGENT_${normalizedId}_MODEL`;

    const provider = process.env[providerEnv];
    const model = process.env[modelEnv];

    if (!provider) {
      throw new Error(`CRITICAL CONFIG ERROR: Agent provider environment variable '${providerEnv}' is not defined.`);
    }

    if (!model) {
      throw new Error(`CRITICAL CONFIG ERROR: Agent model environment variable '${modelEnv}' is not defined.`);
    }

    return { provider, model };
  }
};
