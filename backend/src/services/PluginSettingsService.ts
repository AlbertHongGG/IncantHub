import fs from 'fs';
import path from 'path';

export interface PluginSetting {
  id: string;
  isEnabled: boolean;
}

export class PluginSettingsService {
  private readonly dataPath: string;

  constructor(dataPath?: string) {
    this.dataPath = dataPath || path.resolve(__dirname, '../../data/plugin-settings.json');
    this.initFile();
  }

  private initFile() {
    const dir = path.dirname(this.dataPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.dataPath)) {
      fs.writeFileSync(this.dataPath, JSON.stringify({}, null, 2), 'utf-8');
    }
  }

  private readData(): Record<string, PluginSetting> {
    try {
      const content = fs.readFileSync(this.dataPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error('Error reading plugin-settings.json:', error);
      return {};
    }
  }

  private writeData(data: Record<string, PluginSetting>) {
    try {
      fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error writing plugin-settings.json:', error);
    }
  }

  public getSettings(): Record<string, PluginSetting> {
    return this.readData();
  }

  public getPluginSetting(id: string): PluginSetting {
    const data = this.readData();
    return data[id] || { id, isEnabled: false };
  }

  public updatePluginStatus(id: string, isEnabled: boolean): PluginSetting {
    const data = this.readData();
    data[id] = { id, isEnabled };
    this.writeData(data);
    return data[id];
  }
}
