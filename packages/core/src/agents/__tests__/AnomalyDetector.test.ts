import { AnomalyDetector } from '../builtin/AnomalyDetector';
import { AgentContext } from '../types';

describe('AnomalyDetector', () => {
  let agent: AnomalyDetector;

  beforeEach(() => {
    agent = new AnomalyDetector();
  });

  it('should detect high severity anomaly', async () => {
    const context: AgentContext = {
      contractId: 'test',
      user: '0x123',
      timestamp: Date.now(),
      customData: {
        currentValue: 100,
        historicalAverage: 50,
        standardDeviation: 10
      }
    };

    const decision = await agent.decide(context);
    expect(decision.action.type).toBe('ANOMALY_DETECTED');
    expect(decision.action.severity).toBe('HIGH');
  });

  it('should detect medium severity anomaly', async () => {
    const context: AgentContext = {
      contractId: 'test',
      user: '0x123',
      timestamp: Date.now(),
      customData: {
        currentValue: 75,
        historicalAverage: 50,
        standardDeviation: 10
      }
    };

    const decision = await agent.decide(context);
    expect(decision.action.type).toBe('ANOMALY_DETECTED');
    expect(decision.action.severity).toBe('MEDIUM');
  });

  it('should report normal behavior', async () => {
    const context: AgentContext = {
      contractId: 'test',
      user: '0x123',
      timestamp: Date.now(),
      customData: {
        currentValue: 55,
        historicalAverage: 50,
        standardDeviation: 10
      }
    };

    const decision = await agent.decide(context);
    expect(decision.action.type).toBe('NORMAL');
  });
});
