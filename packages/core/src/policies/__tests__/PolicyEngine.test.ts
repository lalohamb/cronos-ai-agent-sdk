import { PolicyEngine } from '../PolicyEngine';
import { Policy } from '../types';
import { AgentContext, AgentDecision } from '../../agents/types';

const mockPolicy: Policy = {
  id: 'test-policy',
  name: 'Test Policy',
  description: 'Test policy for unit tests',
  validate: (decision: AgentDecision) => decision.confidence > 0.5,
  enforce: (decision: AgentDecision) => ({
    ...decision,
    confidence: Math.min(decision.confidence, 0.9)
  })
};

describe('PolicyEngine', () => {
  let engine: PolicyEngine;

  beforeEach(() => {
    engine = new PolicyEngine();
  });

  it('should add policy', () => {
    engine.addPolicy(mockPolicy);
    expect(engine.listPolicies()).toHaveLength(1);
  });

  it('should remove policy', () => {
    engine.addPolicy(mockPolicy);
    engine.removePolicy('test-policy');
    expect(engine.listPolicies()).toHaveLength(0);
  });

  it('should validate decision', () => {
    engine.addPolicy(mockPolicy);

    const validDecision: AgentDecision = {
      action: { type: 'ALLOW' },
      reason: 'test',
      confidence: 0.8
    };

    const invalidDecision: AgentDecision = {
      action: { type: 'BLOCK' },
      reason: 'test',
      confidence: 0.3
    };

    const context: AgentContext = {
      contractId: 'test',
      user: '0x123',
      timestamp: Date.now(),
      customData: {}
    };

    expect(engine.validate(validDecision)).toBe(true);
    expect(engine.validate(invalidDecision)).toBe(false);
  });

  it('should enforce policy', () => {
    engine.addPolicy(mockPolicy);

    const decision: AgentDecision = {
      action: { type: 'ALLOW' },
      reason: 'test',
      confidence: 0.95
    };

    const context: AgentContext = {
      contractId: 'test',
      user: '0x123',
      timestamp: Date.now(),
      customData: {}
    };

    const enforced = engine.enforce(decision);
    expect(enforced.confidence).toBe(0.9);
  });
});
