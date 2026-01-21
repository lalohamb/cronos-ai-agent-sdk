import { PolicyEngine } from '../../policies/PolicyEngine';
import { PolicyPack } from '../types';
import { AgentDecision, AgentContext } from '../../agents/types';

describe('PolicyPack Enforcement', () => {
  let policyEngine: PolicyEngine;

  beforeEach(() => {
    policyEngine = new PolicyEngine();
  });

  describe('Global clamp rule', () => {
    it('should clamp maxWithdrawal to max value', () => {
      const pack: PolicyPack = {
        packVersion: '2025.12.17.1',
        issuedAt: Date.now(),
        rulesets: [
          {
            id: 'global-clamp',
            scope: 'global',
            priority: 100,
            enabled: true,
            rules: [
              { type: 'clamp', field: 'action.value', max: 100 }
            ]
          }
        ]
      };

      policyEngine.setPolicyPack(pack);

      const decision: AgentDecision = {
        action: { type: 'withdraw', value: 250 },
        reason: 'Test withdrawal',
        confidence: 0.9
      };

      const context: AgentContext = {
        contractId: 'test-contract',
        user: '0x123',
        customData: {}
      };

      const enforced = policyEngine.enforce(decision, context);
      expect(enforced.action.value).toBe(100);
    });

    it('should clamp to min value', () => {
      const pack: PolicyPack = {
        packVersion: '2025.12.17.1',
        issuedAt: Date.now(),
        rulesets: [
          {
            id: 'global-clamp-min',
            scope: 'global',
            priority: 100,
            enabled: true,
            rules: [
              { type: 'clamp', field: 'confidence', min: 0.5 }
            ]
          }
        ]
      };

      policyEngine.setPolicyPack(pack);

      const decision: AgentDecision = {
        action: { type: 'test' },
        reason: 'Test',
        confidence: 0.2
      };

      const context: AgentContext = {
        contractId: 'test-contract',
        user: '0x123',
        customData: {}
      };

      const enforced = policyEngine.enforce(decision, context);
      expect(enforced.confidence).toBe(0.5);
    });
  });

  describe('Agent-scoped denyIf rule', () => {
    it('should throw error when condition matches', () => {
      const pack: PolicyPack = {
        packVersion: '2025.12.17.1',
        issuedAt: Date.now(),
        rulesets: [
          {
            id: 'agent-deny',
            scope: 'agent',
            agentId: 'risk-monitor',
            priority: 100,
            enabled: true,
            rules: [
              { type: 'denyIf', field: 'metadata.riskScore', op: '>', value: 80 }
            ]
          }
        ]
      };

      policyEngine.setPolicyPack(pack);

      const decision: AgentDecision = {
        action: { type: 'test' },
        reason: 'Test',
        confidence: 0.9,
        metadata: { riskScore: 90 }
      };

      const context: AgentContext = {
        contractId: 'test-contract',
        user: '0x123',
        customData: { agentId: 'risk-monitor' }
      };

      expect(() => policyEngine.enforce(decision, context)).toThrow('Policy violation');
    });

    it('should not apply agent-scoped rule to different agent', () => {
      const pack: PolicyPack = {
        packVersion: '2025.12.17.1',
        issuedAt: Date.now(),
        rulesets: [
          {
            id: 'agent-deny',
            scope: 'agent',
            agentId: 'risk-monitor',
            priority: 100,
            enabled: true,
            rules: [
              { type: 'denyIf', field: 'metadata.riskScore', op: '>', value: 80 }
            ]
          }
        ]
      };

      policyEngine.setPolicyPack(pack);

      const decision: AgentDecision = {
        action: { type: 'test' },
        reason: 'Test',
        confidence: 0.9,
        metadata: { riskScore: 90 }
      };

      const context: AgentContext = {
        contractId: 'test-contract',
        user: '0x123',
        customData: { agentId: 'other-agent' }
      };

      expect(() => policyEngine.enforce(decision, context)).not.toThrow();
    });
  });

  describe('Priority ordering', () => {
    it('should apply higher priority rules last', () => {
      const pack: PolicyPack = {
        packVersion: '2025.12.17.1',
        issuedAt: Date.now(),
        rulesets: [
          {
            id: 'low-priority',
            scope: 'global',
            priority: 50,
            enabled: true,
            rules: [
              { type: 'clamp', field: 'action.value', max: 200 }
            ]
          },
          {
            id: 'high-priority',
            scope: 'global',
            priority: 100,
            enabled: true,
            rules: [
              { type: 'clamp', field: 'action.value', max: 100 }
            ]
          }
        ]
      };

      policyEngine.setPolicyPack(pack);

      const decision: AgentDecision = {
        action: { type: 'withdraw', value: 300 },
        reason: 'Test',
        confidence: 0.9
      };

      const context: AgentContext = {
        contractId: 'test-contract',
        user: '0x123',
        customData: {}
      };

      const enforced = policyEngine.enforce(decision, context);
      // High priority (100) applies last, so max should be 100
      expect(enforced.action.value).toBe(100);
    });
  });

  describe('requireTag rule', () => {
    it('should throw error when required tag is missing', () => {
      const pack: PolicyPack = {
        packVersion: '2025.12.17.1',
        issuedAt: Date.now(),
        rulesets: [
          {
            id: 'require-tag',
            scope: 'global',
            priority: 100,
            enabled: true,
            rules: [
              { type: 'requireTag', tag: 'approved' }
            ]
          }
        ]
      };

      policyEngine.setPolicyPack(pack);

      const decision: AgentDecision = {
        action: { type: 'test' },
        reason: 'Test',
        confidence: 0.9,
        metadata: { tags: ['pending'] }
      };

      const context: AgentContext = {
        contractId: 'test-contract',
        user: '0x123',
        customData: {}
      };

      expect(() => policyEngine.enforce(decision, context)).toThrow("Required tag 'approved' missing");
    });

    it('should pass when required tag is present', () => {
      const pack: PolicyPack = {
        packVersion: '2025.12.17.1',
        issuedAt: Date.now(),
        rulesets: [
          {
            id: 'require-tag',
            scope: 'global',
            priority: 100,
            enabled: true,
            rules: [
              { type: 'requireTag', tag: 'approved' }
            ]
          }
        ]
      };

      policyEngine.setPolicyPack(pack);

      const decision: AgentDecision = {
        action: { type: 'test' },
        reason: 'Test',
        confidence: 0.9,
        metadata: { tags: ['approved', 'verified'] }
      };

      const context: AgentContext = {
        contractId: 'test-contract',
        user: '0x123',
        customData: {}
      };

      expect(() => policyEngine.enforce(decision, context)).not.toThrow();
    });
  });

  describe('Contract-scoped rules', () => {
    it('should apply contract-scoped rule to matching contract', () => {
      const pack: PolicyPack = {
        packVersion: '2025.12.17.1',
        issuedAt: Date.now(),
        rulesets: [
          {
            id: 'contract-clamp',
            scope: 'contract',
            contractId: 'vault-contract',
            priority: 100,
            enabled: true,
            rules: [
              { type: 'clamp', field: 'action.value', max: 50 }
            ]
          }
        ]
      };

      policyEngine.setPolicyPack(pack);

      const decision: AgentDecision = {
        action: { type: 'withdraw', value: 100 },
        reason: 'Test',
        confidence: 0.9
      };

      const context: AgentContext = {
        contractId: 'vault-contract',
        user: '0x123',
        customData: {}
      };

      const enforced = policyEngine.enforce(decision, context);
      expect(enforced.action.value).toBe(50);
    });
  });

  describe('Disabled rulesets', () => {
    it('should not apply disabled rulesets', () => {
      const pack: PolicyPack = {
        packVersion: '2025.12.17.1',
        issuedAt: Date.now(),
        rulesets: [
          {
            id: 'disabled-clamp',
            scope: 'global',
            priority: 100,
            enabled: false,
            rules: [
              { type: 'clamp', field: 'action.value', max: 100 }
            ]
          }
        ]
      };

      policyEngine.setPolicyPack(pack);

      const decision: AgentDecision = {
        action: { type: 'withdraw', value: 250 },
        reason: 'Test',
        confidence: 0.9
      };

      const context: AgentContext = {
        contractId: 'test-contract',
        user: '0x123',
        customData: {}
      };

      const enforced = policyEngine.enforce(decision, context);
      expect(enforced.action.value).toBe(250);
    });
  });

  describe('Backward compatibility', () => {
    it('should work without policy pack', () => {
      const decision: AgentDecision = {
        action: { type: 'test', value: 100 },
        reason: 'Test',
        confidence: 0.9
      };

      const context: AgentContext = {
        contractId: 'test-contract',
        user: '0x123',
        customData: {}
      };

      const enforced = policyEngine.enforce(decision, context);
      expect(enforced).toEqual(decision);
    });
  });
});