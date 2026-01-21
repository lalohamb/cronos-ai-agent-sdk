import { BaseAgent } from './BaseAgent';
import { AgentContext, AgentDecision } from './types';

export class AgentRegistry {
  private agents: Map<string, BaseAgent> = new Map();

  register(agent: BaseAgent): void;
  register(id: string, agent: BaseAgent): void;
  register(agentOrId: BaseAgent | string, agent?: BaseAgent): void {
    if (typeof agentOrId === 'string') {
      const id = agentOrId;
      if (!agent) throw new Error('Agent is required when providing ID');
      if (this.agents.has(id)) {
        throw new Error(`Agent with id '${id}' already registered`);
      }
      this.agents.set(id, agent);
    } else {
      const agentInstance = agentOrId;
      const id = agentInstance.getId();
      if (this.agents.has(id)) {
        throw new Error(`Agent with id '${id}' already registered`);
      }
      this.agents.set(id, agentInstance);
    }
  }

  unregister(id: string): boolean {
    return this.agents.delete(id);
  }

  get(id: string): BaseAgent {
    const agent = this.agents.get(id);
    if (!agent) {
      throw new Error(`Agent '${id}' not found`);
    }
    return agent;
  }

  has(id: string): boolean {
    return this.agents.has(id);
  }

  list(): BaseAgent[] {
    return Array.from(this.agents.values());
  }

  async execute(agentId: string, context: AgentContext): Promise<AgentDecision> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent '${agentId}' not found`);
    }

    return await agent.decide(context);
  }

  clear(): void {
    this.agents.clear();
  }
}