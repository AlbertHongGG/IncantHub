import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// 尋找專案根目錄下的 .env 檔案
const envPath = path.resolve(process.cwd(), '..', '.env');
if (!fs.existsSync(envPath)) {
  throw new Error(`CRITICAL ERROR: .env file is missing at ${envPath}. Please copy from .env.example and configure.`);
}

dotenv.config({ path: envPath });

// 只驗證全域伺服器所需的參數，具體 Agent 的參數將在其實例化時由 ProviderFactory 進行校驗
const requiredEnvVars = [
  'PORT'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`CRITICAL ERROR: Environment variable ${envVar} is missing. Please define it in .env.`);
  }
}

export const config = {
  server: {
    port: parseInt(process.env.PORT as string, 10),
  }
};
