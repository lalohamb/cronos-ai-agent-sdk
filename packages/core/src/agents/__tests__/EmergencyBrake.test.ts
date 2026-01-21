import { EmergencyBrake } from '../builtin/EmergencyBrake';
import { AgentContext } from '../types';

describe('EmergencyBrake', () => {
  let agent: EmergencyBrake;

  beforeEach(() => {
    agent = new EmergencyBrake();
  });

  it('should pause when threshold breached', async () => {
    const context: AgentContext = {
      contractId: 'test',
      user: '0x123',
      timestamp: Date.now(),
      customData: {
        metric: 100,
        criticalThreshold: 90
      }
    };

    const decision = await agent.decide(context);
    expect(decision.action.type).toBe('PAUSE');
    expect(decision.confidence).toBe(1.0);
  });

  it('should resume when safe', async () => {
    const context: AgentContext = {
      contractId: 'test',
      user: '0x123',
      timestamp: Date.now(),
      customData: {
        metric: 50,
        criticalThreshold: 90
      }
    };

    const decision = await agent.decide(context);
    expect(decision.action.type).toBe('RESUME');
  });
});
