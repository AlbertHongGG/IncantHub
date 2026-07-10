import fs from 'fs';
import path from 'path';

interface TagsData {
  [agentId: string]: string[];
}

export class TagService {
  private dataPath: string;
  private tagsData: TagsData = {};

  constructor() {
    this.dataPath = path.join(process.cwd(), 'data', 'tags.json');
    this.ensureDataDirectory();
    this.loadData();
  }

  private ensureDataDirectory() {
    const dir = path.dirname(this.dataPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private loadData() {
    try {
      if (fs.existsSync(this.dataPath)) {
        const fileContent = fs.readFileSync(this.dataPath, 'utf-8');
        this.tagsData = JSON.parse(fileContent);
      } else {
        this.tagsData = {};
        this.saveData();
      }
    } catch (error) {
      console.error('[TagService] Failed to load tags data:', error);
      this.tagsData = {};
    }
  }

  private saveData() {
    try {
      fs.writeFileSync(this.dataPath, JSON.stringify(this.tagsData, null, 2), 'utf-8');
    } catch (error) {
      console.error('[TagService] Failed to save tags data:', error);
    }
  }

  public getTags(agentId: string): string[] {
    return this.tagsData[agentId] || [];
  }

  public addTag(agentId: string, tag: string): string[] {
    const trimmedTag = tag.trim();
    if (!trimmedTag) return this.getTags(agentId);

    if (!this.tagsData[agentId]) {
      this.tagsData[agentId] = [];
    }

    if (!this.tagsData[agentId].includes(trimmedTag)) {
      this.tagsData[agentId].push(trimmedTag);
      this.saveData();
    }

    return this.tagsData[agentId];
  }

  public removeTag(agentId: string, tag: string): string[] {
    if (!this.tagsData[agentId]) return [];

    this.tagsData[agentId] = this.tagsData[agentId].filter(t => t !== tag);
    
    // Cleanup empty arrays to keep JSON clean
    if (this.tagsData[agentId].length === 0) {
      delete this.tagsData[agentId];
    }
    
    this.saveData();
    return this.tagsData[agentId] || [];
  }
}
