import * as fs from 'fs/promises';
import * as path from 'path';

export class IncantLogger {
  private logDir: string;

  constructor(private agentName: string) {
    // Project root is IncantHub
    this.logDir = path.resolve(__dirname, '..', '..', '..', '.runtime', 'logs', agentName);
  }

  private async ensureLogDir() {
    try {
      await fs.access(this.logDir);
    } catch {
      await fs.mkdir(this.logDir, { recursive: true });
    }
  }

  async writeExecutionLog(request: any, response: any, metadata: any = {}) {
    try {
      await this.ensureLogDir();
      const now = new Date();
      
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const timestamp = `${year}${month}${day}_${hours}${minutes}${seconds}`;
      
      const randomId = Math.random().toString(36).substring(2, 8);
      const fileName = `${timestamp}_${randomId}.json`;
      const filePath = path.join(this.logDir, fileName);

      const logEntry = {
        agentName: this.agentName,
        timestamp: now.toISOString(),
        request,
        response,
        metadata
      };

      await fs.writeFile(filePath, JSON.stringify(logEntry, null, 2), 'utf-8');
    } catch (err) {
      console.error(`[IncantLogger] Failed to write log for ${this.agentName}:`, err);
    }
  }

  info(message: string, ...args: any[]) {
    console.log(`[${this.agentName}] INFO: ${message}`, ...args);
  }

  error(message: string, ...args: any[]) {
    console.error(`[${this.agentName}] ERROR: ${message}`, ...args);
  }
}
