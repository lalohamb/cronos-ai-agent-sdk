import { AgentConfig, AgentContext, AgentDecision } from './types';

export abstract class BaseAgent {
  abstract config: AgentConfig;

  abstract decide(context: AgentContext): Promise<AgentDecision>;

  getId(): string {
    return this.config.id;
  }

  getName(): string {
    return this.config.name;
  }

  getVersion(): string {
    return this.config.version;
  }

  protected validateContext(context: AgentContext): void {
    if (!context.contractId) {
      throw new Error('Contract ID is required');
    }
    if (!context.user) {
      throw new Error('User address is required');
    }
  }
}