# Policy and Policy Pack Guide

## Overview

The Cronos AI Agent SDK provides a powerful policy system that allows you to enforce rules and constraints on agent decisions. The system supports both individual policies and policy packs for centralized governance.

## Core Concepts

### Policy
A single rule that validates or modifies agent decisions.

### Policy Pack
A collection of rulesets that can be applied globally, per-agent, or per-contract. Policy packs enable centralized governance and can be signed for security.

### Policy Engine
The central component that manages and enforces policies and policy packs.

## Basic Policy Implementation

### 1. Create a Simple Policy

```typescript
import { Policy, AgentDecision } from '@sentinel/ai-agent-sdk';

class MaxWithdrawalPolicy implements Policy {
  id = 'max-withdrawal';
  name = 'Maximum Withdrawal Limit';
  description = 'Prevents withdrawals above specified limit';

  constructor(private maxAmount: number) {}

  validate(decision: AgentDecision): boolean {
    if (decision.action.type === 'withdraw') {
      return decision.action.value <= this.maxAmount;
    }
    return true;
  }

  enforce(decision: AgentDecision): AgentDecision {
    if (decision.action.type === 'withdraw' && decision.action.value > this.maxAmount) {
      return {
        ...decision,
        action: {
          ...decision.action,
          value: this.maxAmount
        }
      };
    }
    return decision;
  }
}
```

### 2. Register Policy with SDK

```typescript
import { SentinelAgentSDK } from '@sentinel/ai-agent-sdk';

const sdk = new SentinelAgentSDK({
  network: 'cronos-testnet',
  rpcUrl: 'https://evm-t3.cronos.org',
  privateKey: process.env.AGENT_PRIVATE_KEY
});

// Add policy to engine
const maxWithdrawalPolicy = new MaxWithdrawalPolicy(1000);
sdk.policyEngine.addPolicy(maxWithdrawalPolicy);
```

## Policy Pack Implementation

### 1. Create a Policy Pack

```typescript
import { PolicyPack } from '@sentinel/ai-agent-sdk';

const policyPack: PolicyPack = {
  packVersion: '2025.12.17.1',
  issuedAt: Date.now(),
  issuer: 'cronos-governance',
  rulesets: [
    {
      id: 'global-limits',
      scope: 'global',
      priority: 100,
      enabled: true,
      rules: [
        {
          type: 'clamp',
          field: 'action.value',
          max: 10000
        },
        {
          type: 'denyIf',
          field: 'confidence',
          op: '<',
          value: 0.5
        }
      ],
      reason: 'Global safety limits'
    },
    {
      id: 'risk-agent-rules',
      scope: 'agent',
      agentId: 'risk-monitor',
      priority: 200,
      enabled: true,
      rules: [
        {
          type: 'requireTag',
          tag: 'risk-approved'
        },
        {
          type: 'clamp',
          field: 'metadata.riskScore',
          max: 80
        }
      ],
      reason: 'Risk monitoring constraints'
    },
    {
      id: 'vault-contract-rules',
      scope: 'contract',
      contractId: 'vault-001',
      priority: 150,
      enabled: true,
      rules: [
        {
          type: 'clamp',
          field: 'action.value',
          max: 5000
        }
      ],
      reason: 'Vault-specific limits'
    }
  ]
};
```

### 2. Apply Policy Pack

```typescript
// Set policy pack on the engine
sdk.policyEngine.setPolicyPack(policyPack);

// Verify policy pack is applied
const currentPack = sdk.policyEngine.getPolicyPack();
console.log('Active policy pack version:', currentPack?.packVersion);
```

## Rule Types

### 1. Clamp Rules
Enforce minimum and maximum values on numeric fields.

```typescript
{
  type: 'clamp',
  field: 'action.value',
  min: 10,      // Optional minimum
  max: 1000     // Optional maximum
}
```

### 2. DenyIf Rules
Block decisions when conditions are met.

```typescript
{
  type: 'denyIf',
  field: 'metadata.riskScore',
  op: '>',      // Operators: '>', '>=', '<', '<=', '==', '!='
  value: 90
}
```

### 3. RequireTag Rules
Ensure specific tags are present in decision metadata.

```typescript
{
  type: 'requireTag',
  tag: 'compliance-approved'
}
```

## Scoping Rules

### Global Scope
Applied to all agent decisions.

```typescript
{
  id: 'global-rules',
  scope: 'global',
  priority: 100,
  enabled: true,
  rules: [/* rules */]
}
```

### Agent Scope
Applied only to specific agents.

```typescript
{
  id: 'agent-specific',
  scope: 'agent',
  agentId: 'risk-monitor',
  priority: 200,
  enabled: true,
  rules: [/* rules */]
}
```

### Contract Scope
Applied only to specific contracts.

```typescript
{
  id: 'contract-specific',
  scope: 'contract',
  contractId: 'vault-001',
  priority: 150,
  enabled: true,
  rules: [/* rules */]
}
```

## Priority System

Rules are applied in priority order (highest first):
- Higher priority = 200
- Medium priority = 150  
- Lower priority = 100

```typescript
// High priority rule overrides lower priority
const pack: PolicyPack = {
  packVersion: '1.0.0',
  issuedAt: Date.now(),
  rulesets: [
    {
      id: 'low-priority',
      scope: 'global',
      priority: 100,
      enabled: true,
      rules: [{ type: 'clamp', field: 'action.value', max: 1000 }]
    },
    {
      id: 'high-priority',
      scope: 'global', 
      priority: 200,
      enabled: true,
      rules: [{ type: 'clamp', field: 'action.value', max: 500 }]
    }
  ]
};
// Result: max value will be 500 (high priority wins)
```

## Usage Examples

### Example 1: Risk Management Policy Pack

```typescript
const riskManagementPack: PolicyPack = {
  packVersion: '2025.01.01.1',
  issuedAt: Date.now(),
  issuer: 'risk-management-team',
  rulesets: [
    {
      id: 'global-risk-limits',
      scope: 'global',
      priority: 100,
      enabled: true,
      rules: [
        { type: 'denyIf', field: 'confidence', op: '<', value: 0.7 },
        { type: 'clamp', field: 'action.value', max: 50000 }
      ]
    },
    {
      id: 'high-risk-agent-constraints',
      scope: 'agent',
      agentId: 'emergency-brake',
      priority: 200,
      enabled: true,
      rules: [
        { type: 'requireTag', tag: 'emergency-approved' },
        { type: 'denyIf', field: 'metadata.volatility', op: '>', value: 0.8 }
      ]
    }
  ]
};

sdk.policyEngine.setPolicyPack(riskManagementPack);
```

### Example 2: Compliance Policy Pack

```typescript
const compliancePack: PolicyPack = {
  packVersion: '2025.01.01.1',
  issuedAt: Date.now(),
  issuer: 'compliance-team',
  rulesets: [
    {
      id: 'kyc-requirements',
      scope: 'global',
      priority: 300,
      enabled: true,
      rules: [
        { type: 'requireTag', tag: 'kyc-verified' },
        { type: 'denyIf', field: 'metadata.jurisdiction', op: '==', value: 'restricted' }
      ]
    },
    {
      id: 'transaction-limits',
      scope: 'contract',
      contractId: 'regulated-vault',
      priority: 250,
      enabled: true,
      rules: [
        { type: 'clamp', field: 'action.value', max: 10000 },
        { type: 'requireTag', tag: 'compliance-approved' }
      ]
    }
  ]
};

sdk.policyEngine.setPolicyPack(compliancePack);
```

### Example 3: Dynamic Policy Management

```typescript
// Enable/disable rulesets dynamically
function updatePolicyPack(enabled: boolean) {
  const currentPack = sdk.policyEngine.getPolicyPack();
  if (currentPack) {
    // Update ruleset status
    currentPack.rulesets.forEach(ruleset => {
      if (ruleset.id === 'emergency-rules') {
        ruleset.enabled = enabled;
      }
    });
    
    // Reapply updated pack
    sdk.policyEngine.setPolicyPack(currentPack);
  }
}

// Emergency mode - enable strict rules
updatePolicyPack(true);
```

## Testing Policies

### Unit Testing Individual Policies

```typescript
import { MaxWithdrawalPolicy } from './policies/MaxWithdrawalPolicy';

describe('MaxWithdrawalPolicy', () => {
  it('should enforce maximum withdrawal limit', () => {
    const policy = new MaxWithdrawalPolicy(1000);
    
    const decision = {
      action: { type: 'withdraw', value: 1500 },
      reason: 'User withdrawal',
      confidence: 0.9
    };
    
    const enforced = policy.enforce(decision);
    expect(enforced.action.value).toBe(1000);
  });
});
```

### Integration Testing with Policy Packs

```typescript
import { PolicyEngine } from '@sentinel/ai-agent-sdk';

describe('Policy Pack Integration', () => {
  it('should apply multiple rules correctly', () => {
    const engine = new PolicyEngine();
    engine.setPolicyPack(testPolicyPack);
    
    const decision = {
      action: { type: 'withdraw', value: 2000 },
      reason: 'Test',
      confidence: 0.3
    };
    
    const context = {
      contractId: 'test-vault',
      user: '0x123',
      customData: {}
    };
    
    expect(() => engine.enforce(decision, context))
      .toThrow('Policy violation: confidence < 0.5');
  });
});
```

## Best Practices

### 1. Policy Design
- Keep policies simple and focused
- Use descriptive IDs and names
- Include clear error messages
- Test edge cases thoroughly

### 2. Policy Pack Management
- Version your policy packs consistently
- Use semantic versioning (YYYY.MM.DD.patch)
- Document rule changes and reasons
- Test policy packs before deployment

### 3. Priority Management
- Reserve high priorities (300+) for critical rules
- Use medium priorities (200-299) for important constraints
- Use low priorities (100-199) for general guidelines
- Document priority rationale

### 4. Performance Considerations
- Minimize complex field lookups
- Cache policy packs when possible
- Monitor policy enforcement performance
- Use efficient rule ordering

## Security Considerations

### Policy Pack Signing
```typescript
const signedPack: PolicyPack = {
  packVersion: '2025.01.01.1',
  issuedAt: Date.now(),
  issuer: 'trusted-authority',
  signature: 'base64-encoded-signature',
  publicKeyId: 'key-id-123',
  rulesets: [/* rules */]
};
```

### Validation
- Always validate policy pack signatures
- Verify issuer authority
- Check pack expiration dates
- Audit policy changes

This guide provides the foundation for implementing robust policy management in your Cronos AI Agent SDK applications.