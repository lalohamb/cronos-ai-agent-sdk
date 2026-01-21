import { BaseAgent } from '../BaseAgent';
import { AgentContext, AgentDecision } from '../types';

class TestAgent extends BaseAgent {
  config = {
    id: 'test-agent',
    name: 'Test Agent',
    description: 'Test',
    version: '1.0.0'
  };

  async decide(context: AgentContext): Promise<AgentDecision> {
    return {
      action: { type: 'ALLOW' },
      reason: 'Test decision',
      confidence: 0.9
    };
  }

  validate(context: AgentContext): boolean {
    return true;
  }
}

describe('BaseAgent', () => {
  let agent: TestAgent;

  beforeEach(() => {
    agent = new TestAgent();
  });

  it('should have config', () => {
    expect(agent.config.id).toBe('test-agent');
    expect(agent.config.name).toBe('Test Agent');
  });

  it('should make decision', async () => {
    const context: AgentContext = {
      contractId: 'test',
      user: '0x123',
      timestamp: Date.now(),
      customData: { value: 100 }
    };

    const decision = await agent.decide(context);
    expect(decision.action.type).toBe('ALLOW');
    expect(decision.confidence).toBe(0.9);
  });

  it('should validate by default', () => {
    const context: AgentContext = {
      contractId: 'test',
      user: '0x123',
      timestamp: Date.now(),
      customData: { value: 100 }
    };

    expect(agent.validate(context)).toBe(true);
  });
});
