import { RiskMonitor } from '../builtin/RiskMonitor';
import { AgentContext } from '../types';

describe('RiskMonitor', () => {
  let agent: RiskMonitor;

  beforeEach(() => {
    agent = new RiskMonitor();
  });

  it('should block when critically low', async () => {
    const context: AgentContext = {
      contractId: 'test',
      user: '0x123',
      timestamp: Date.now(),
      customData: {
        balance: '1',
        threshold: '10'
      }
    };

    const decision = await agent.decide(context);
    expect(decision.action.type).toBe('BLOCK');
    expect(decision.confidence).toBeGreaterThan(0.9);
  });

  it('should limit when below threshold', async () => {
    const context: AgentContext = {
      contractId: 'test',
      user: '0x123',
      timestamp: Date.now(),
      customData: {
        balance: '8',
        threshold: '10'
      }
    };

    const decision = await agent.decide(context);
    expect(decision.action.type).toBe('LIMIT');
    expect(decision.action.value).toBe('2');
  });

  it('should allow when above threshold', async () => {
    const context: AgentContext = {
      contractId: 'test',
      user: '0x123',
      timestamp: Date.now(),
      customData: {
        balance: '20',
        threshold: '10'
      }
    };

    const decision = await agent.decide(context);
    expect(decision.action.type).toBe('ALLOW');
    expect(decision.action.value).toBeUndefined();
  });
});
