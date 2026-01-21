import { AgentRegistry } from '../AgentRegistry';
import { BaseAgent } from '../BaseAgent';
import { AgentContext, AgentDecision } from '../types';

class MockAgent extends BaseAgent {
  config = {
    id: 'mock-agent',
    name: 'Mock',
    description: 'Mock',
    version: '1.0.0'
  };

  async decide(context: AgentContext): Promise<AgentDecision> {
    return {
      action: { type: 'test' },
      reason: 'Mock decision',
      confidence: 0.8
    };
  }
}

describe('AgentRegistry', () => {
  let registry: AgentRegistry;

  beforeEach(() => {
    registry = new AgentRegistry();
  });

  it('should register agent', () => {
    const agent = new MockAgent();
    registry.register(agent);
    expect(registry.has('mock-agent')).toBe(true);
  });

  it('should throw on duplicate registration', () => {
    const agent = new MockAgent();
    registry.register(agent);
    expect(() => registry.register(agent)).toThrow('already registered');
  });

  it('should get agent', () => {
    const agent = new MockAgent();
    registry.register(agent);
    const retrieved = registry.get('mock-agent');
    expect(retrieved).toBe(agent);
  });

  it('should throw on missing agent', () => {
    expect(() => registry.get('missing')).toThrow('not found');
  });

  it('should execute agent', async () => {
    const agent = new MockAgent();
    registry.register(agent);

    const context: AgentContext = {
      contractId: 'test',
      user: '0x123',
      timestamp: Date.now(),
      customData: {}
    };

    const decision = await registry.execute('mock-agent', context);
    expect(decision.action.type).toBe('test');
    expect(decision.confidence).toBe(0.8);
  });

  it('should list agents', () => {
    const agent = new MockAgent();
    registry.register(agent);
    const list = registry.list();
    expect(list).toHaveLength(1);
    expect(list[0]).toBe(agent);
  });
});
