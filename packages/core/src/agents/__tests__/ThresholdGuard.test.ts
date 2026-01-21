import { ThresholdGuard } from '../builtin/ThresholdGuard';
import { AgentContext } from '../types';

describe('ThresholdGuard', () => {
  let agent: ThresholdGuard;

  beforeEach(() => {
    agent = new ThresholdGuard();
  });

  it('should reject below minimum', async () => {
    const context: AgentContext = {
      contractId: 'test',
      user: '0x123',
      timestamp: Date.now(),
      customData: {
        value: '5',
        minThreshold: '10',
        maxThreshold: '100'
      }
    };

    const decision = await agent.decide(context);
    expect(decision.action.type).toBe('REJECT');
  });

  it('should cap at maximum', async () => {
    const context: AgentContext = {
      contractId: 'test',
      user: '0x123',
      timestamp: Date.now(),
      customData: {
        value: '150',
        minThreshold: '10',
        maxThreshold: '100'
      }
    };

    const decision = await agent.decide(context);
    expect(decision.action.type).toBe('APPROVE');
    expect(decision.action.value).toBe('100');
  });

  it('should approve within range', async () => {
    const context: AgentContext = {
      contractId: 'test',
      user: '0x123',
      timestamp: Date.now(),
      customData: {
        value: '50',
        minThreshold: '10',
        maxThreshold: '100'
      }
    };

    const decision = await agent.decide(context);
    expect(decision.action.type).toBe('APPROVE');
    expect(decision.action.value).toBeUndefined();
  });
});
