import { AIProvider } from '../../providers/AIProvider';

export interface Agent {
  readonly name: string;
  execute(...args: any[]): Promise<any>;
}

export abstract class BaseAgent implements Agent {
  public readonly name: string;
  protected provider: AIProvider;

  constructor(name: string, provider: AIProvider) {
    this.name = name;
    this.provider = provider;
  }

  abstract execute(...args: any[]): Promise<any>;
}
