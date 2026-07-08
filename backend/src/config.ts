import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// 尋找專案根目錄下的 .env 檔案
const envPath = path.resolve(process.cwd(), '..', '.env');
if (!fs.existsSync(envPath)) {
  throw new Error(`CRITICAL ERROR: .env file is missing at ${envPath}. Please copy from .env.example and configure.`);
}

dotenv.config({ path: envPath });

const requiredEnvVars = [
  'PORT',
  'PROVIDER_GEMINIFLOW_URL',
  'AGENT_ARTICLESUMMARIZER_PROVIDER',
  'AGENT_ARTICLESUMMARIZER_MODEL',
  'AGENT_MARKETINGCOPY_PROVIDER',
  'AGENT_MARKETINGCOPY_MODEL',
  'AGENT_IMAGEDESCRIBER_PROVIDER',
  'AGENT_IMAGEDESCRIBER_MODEL'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`CRITICAL ERROR: Environment variable ${envVar} is missing. Please define it in .env.`);
  }
}

export const config = {
  server: {
    port: parseInt(process.env.PORT as string, 10),
  },
  providers: {
    geminiflowUrl: process.env.PROVIDER_GEMINIFLOW_URL as string,
  },
  agents: {
    articleSummarizer: {
      provider: process.env.AGENT_ARTICLESUMMARIZER_PROVIDER as string,
      model: process.env.AGENT_ARTICLESUMMARIZER_MODEL as string,
    },
    marketingCopy: {
      provider: process.env.AGENT_MARKETINGCOPY_PROVIDER as string,
      model: process.env.AGENT_MARKETINGCOPY_MODEL as string,
    },
    imageDescriber: {
      provider: process.env.AGENT_IMAGEDESCRIBER_PROVIDER as string,
      model: process.env.AGENT_IMAGEDESCRIBER_MODEL as string,
    }
  }
};
