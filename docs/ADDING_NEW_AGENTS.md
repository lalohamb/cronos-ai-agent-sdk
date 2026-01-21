# Adding New Agents to Cronos AI Agent SDK

This guide provides step-by-step instructions for creating and integrating new AI agents into the Cronos AI Agent SDK.

## Overview

The SDK supports two types of agents:
- **Built-in Agents** - Part of the core SDK package
- **Custom Agents** - User-created agents for specific use cases

## Step-by-Step Guide: Adding a Built-in Agent

### Step 1: Create the Agent Class

Create a new file in `packages/core/src/agents/`:

```typescript
// packages/core/src/agents/MyCustomAgent.ts
import { BaseAgent } from './BaseAgent';
import { AgentContext, AgentDecision } from './types';

export interface MyCustomAgentConfig {
  threshold: number;
  maxAmount: bigint;
  enabledFeatures: string[];
}

export class MyCustomAgent extends BaseAgent {
  config = {
    id: 'my-custom-agent',
    name: 'My Custom Agent',
    description: 'Description of what this agent does',
    version: '1.0.0'
  };

  private agentConfig: MyCustomAgentConfig;

  constructor(config: MyCustomAgentConfig) {
    super();
    this.agentConfig = config;
  }

  async decide(context: AgentContext): Promise<AgentDecision> {
    // Implement your agent logic here
    const { customData } = context;
    
    // Example logic
    if (customData.amount > this.agentConfig.maxAmount) {
      return {
        action: {
          type: 'BLOCK',
          reason: 'Amount exceeds maximum limit',
          severity: 'HIGH'
        },
        reason: `Amount ${customData.amount} exceeds limit ${this.agentConfig.maxAmount}`,
        confidence: 0.95,
        metadata: {
          threshold: this.agentConfig.threshold,
          amount: customData.amount
        }
      };
    }

    return {
      action: { type: 'ALLOW' },
      reason: 'All checks passed',
      confidence: 0.8
    };
  }
}
```

### Step 2: Add Agent to Built-in Index

Add your agent to `packages/core/src/agents/builtin/index.ts`:

```typescript
// packages/core/src/agents/builtin/index.ts
export { RiskMonitor } from './RiskMonitor';
export { LiquidityOptimizer } from './LiquidityOptimizer';
export { EmergencyBrake } from './EmergencyBrake';
export { ThresholdGuard } from './ThresholdGuard';
export { AnomalyDetector } from './AnomalyDetector';
export { MyCustomAgent } from '../MyCustomAgent'; // Add this line
```

### Step 3: Export from Core Package

Add the export to `packages/core/src/index.ts`:

```typescript
// packages/core/src/index.ts
export { BaseAgent } from './agents/BaseAgent';
export { AgentRegistry } from './agents/AgentRegistry';
export { GeniusActComplianceAgent } from './agents/GeniusActComplianceAgent';
export { MyCustomAgent } from './agents/MyCustomAgent'; // Add this line
export type { AgentContext, AgentDecision, AgentConfig } from './agents/types';
```

### Step 4: Create Tests

Create test file `packages/core/src/agents/__tests__/MyCustomAgent.test.ts`:

```typescript
import { MyCustomAgent } from '../MyCustomAgent';
import { AgentContext } from '../types';

describe('MyCustomAgent', () => {
  let agent: MyCustomAgent;

  beforeEach(() => {
    agent = new MyCustomAgent({
      threshold: 100,
      maxAmount: 1000n,
      enabledFeatures: ['feature1', 'feature2']
    });
  });

  test('should allow transactions under limit', async () => {
    const context: AgentContext = {
      contractId: 'test-contract',
      user: '0x123...',
      customData: { amount: 500n }
    };

    const decision = await agent.decide(context);
    
    expect(decision.action.type).toBe('ALLOW');
    expect(decision.confidence).toBeGreaterThan(0);
  });

  test('should block transactions over limit', async () => {
    const context: AgentContext = {
      contractId: 'test-contract',
      user: '0x123...',
      customData: { amount: 2000n }
    };

    const decision = await agent.decide(context);
    
    expect(decision.action.type).toBe('BLOCK');
    expect(decision.action.severity).toBe('HIGH');
  });
});
```

### Step 5: Build the Core Package

```bash
cd packages/core
npm run build
```

### Step 6: Create Example Usage

Create example in `packages/examples/my-custom-agent/`:

```typescript
// packages/examples/my-custom-agent/index.ts
import { SentinelAgentSDK, MyCustomAgent } from '@sentinel/ai-agent-sdk';
import { ethers } from 'ethers';

async function main() {
  console.log('🚀 My Custom Agent Demo\n');

  const sdk = new SentinelAgentSDK({
    network: 'cronos-testnet',
    rpcUrl: 'https://evm-t3.cronos.org'
  });

  // Configure and register the agent
  const customAgent = new MyCustomAgent({
    threshold: 100,
    maxAmount: ethers.parseEther('10'),
    enabledFeatures: ['feature1', 'feature2']
  });

  sdk.registerAgent('my-custom-agent', customAgent);

  // Test scenarios
  const result = await sdk.executeAgent('my-custom-agent', {
    contractId: 'test-contract',
    user: '0x1234567890123456789012345678901234567890',
    customData: {
      amount: ethers.parseEther('5')
    }
  });

  console.log('Agent Decision:', result);
}

main().catch(console.error);
```

### Step 7: Add Documentation

Create `docs/agents/MY_CUSTOM_AGENT.md`:

```markdown
# MyCustomAgent

## Overview
Description of what the agent does and when to use it.

## Configuration
- `threshold`: Number - Threshold value for decisions
- `maxAmount`: bigint - Maximum allowed amount
- `enabledFeatures`: string[] - List of enabled features

## Usage
\`\`\`typescript
const agent = new MyCustomAgent({
  threshold: 100,
  maxAmount: ethers.parseEther('10'),
  enabledFeatures: ['feature1']
});

sdk.registerAgent('my-custom-agent', agent);
\`\`\`

## Decision Logic
Explain how the agent makes decisions.

## Examples
Provide usage examples and scenarios.
```

## Step-by-Step Guide: Adding a Custom Agent (User-Created)

### Step 1: Create Agent Class

Users create their own agent by extending BaseAgent:

```typescript
// MyUserAgent.ts
import { BaseAgent, AgentContext, AgentDecision } from '@sentinel/ai-agent-sdk';

export class MyUserAgent extends BaseAgent {
  config = {
    id: 'my-user-agent',
    name: 'My User Agent',
    description: 'Custom agent for specific business logic',
    version: '1.0.0'
  };

  async decide(context: AgentContext): Promise<AgentDecision> {
    // Custom business logic
    return {
      action: { type: 'ALLOW' },
      reason: 'Custom logic passed',
      confidence: 0.9
    };
  }
}
```

### Step 2: Register and Use

```typescript
import { SentinelAgentSDK } from '@sentinel/ai-agent-sdk';
import { MyUserAgent } from './MyUserAgent';

const sdk = new SentinelAgentSDK({
  network: 'cronos-testnet',
  rpcUrl: 'https://evm-t3.cronos.org'
});

// Register custom agent
sdk.registerAgent('my-user-agent', new MyUserAgent());

// Use the agent
const result = await sdk.executeAgent('my-user-agent', {
  contractId: 'my-contract',
  user: '0x123...',
  customData: { /* custom data */ }
});
```

## Agent Development Best Practices

### 1. Agent Structure

```typescript
export class WellStructuredAgent extends BaseAgent {
  // Required: Agent metadata
  config = {
    id: 'unique-agent-id',
    name: 'Human Readable Name',
    description: 'Clear description of purpose',
    version: '1.0.0'
  };

  // Optional: Agent configuration
  private agentConfig: AgentConfig;

  constructor(config: AgentConfig) {
    super();
    this.agentConfig = config;
  }

  // Required: Decision logic
  async decide(context: AgentContext): Promise<AgentDecision> {
    // Implementation
  }

  // Optional: Helper methods
  private validateInput(data: any): boolean {
    // Validation logic
  }
}
```

### 2. Decision Types

Use appropriate action types:

```typescript
// Allow operation
return {
  action: { type: 'ALLOW' },
  reason: 'All checks passed',
  confidence: 0.9
};

// Block operation
return {
  action: { 
    type: 'BLOCK', 
    reason: 'Risk detected',
    severity: 'HIGH' 
  },
  reason: 'Detailed explanation',
  confidence: 0.95
};

// Limit operation
return {
  action: { 
    type: 'LIMIT', 
    value: '1000',
    reason: 'Applying safety limit'
  },
  reason: 'Amount limited for safety',
  confidence: 0.8
};
```

### 3. Error Handling

```typescript
async decide(context: AgentContext): Promise<AgentDecision> {
  try {
    // Validate input
    if (!context.customData) {
      throw new Error('Custom data required');
    }

    // Agent logic
    const result = await this.processLogic(context);
    
    return result;
  } catch (error) {
    // Return safe default
    return {
      action: { 
        type: 'BLOCK', 
        reason: `Agent error: ${error.message}`,
        severity: 'CRITICAL'
      },
      reason: 'Agent encountered an error',
      confidence: 1.0
    };
  }
}
```

### 4. Testing

```typescript
describe('MyAgent', () => {
  let agent: MyAgent;

  beforeEach(() => {
    agent = new MyAgent(mockConfig);
  });

  test('handles valid input', async () => {
    const context = createMockContext();
    const decision = await agent.decide(context);
    
    expect(decision.action.type).toBeDefined();
    expect(decision.confidence).toBeGreaterThan(0);
  });

  test('handles invalid input', async () => {
    const context = createInvalidContext();
    const decision = await agent.decide(context);
    
    expect(decision.action.type).toBe('BLOCK');
  });
});
```

## File Structure for New Agents

```
packages/core/src/agents/
├── builtin/
│   ├── index.ts              # Export built-in agents
│   ├── RiskMonitor.ts
│   └── MyCustomAgent.ts      # New built-in agent
├── __tests__/
│   ├── MyCustomAgent.test.ts # Tests for new agent
│   └── ...
├── BaseAgent.ts
├── AgentRegistry.ts
├── MyCustomAgent.ts          # New agent implementation
└── types.ts

packages/examples/
├── my-custom-agent/          # Example usage
│   ├── index.ts
│   ├── package.json
│   └── tsconfig.json
└── ...

docs/agents/
├── MY_CUSTOM_AGENT.md        # Agent documentation
└── ...
```

## Checklist for Adding New Agents

### Built-in Agents
- [ ] Create agent class extending BaseAgent
- [ ] Add to builtin/index.ts exports
- [ ] Add to core/src/index.ts exports
- [ ] Write comprehensive tests
- [ ] Build core package (`npm run build`)
- [ ] Create example usage
- [ ] Write documentation
- [ ] Update main README if significant

### Custom Agents (User Guide)
- [ ] Provide BaseAgent import example
- [ ] Show registration pattern
- [ ] Document decision types
- [ ] Provide testing examples
- [ ] Include error handling patterns

## Common Patterns

### 1. Configuration-Based Agent

```typescript
export class ConfigurableAgent extends BaseAgent {
  constructor(private config: AgentConfig) {
    super();
  }

  async decide(context: AgentContext): Promise<AgentDecision> {
    // Use this.config for decisions
  }
}
```

### 2. Stateful Agent

```typescript
export class StatefulAgent extends BaseAgent {
  private state: Map<string, any> = new Map();

  async decide(context: AgentContext): Promise<AgentDecision> {
    const userState = this.state.get(context.user);
    // Make decisions based on state
  }
}
```

### 3. AI-Powered Agent

```typescript
export class AIAgent extends BaseAgent {
  async decide(context: AgentContext): Promise<AgentDecision> {
    const aiProvider = this.sdk?.getAIProvider();
    if (aiProvider) {
      const aiDecision = await aiProvider.analyze(context);
      // Use AI insights for decision
    }
    
    // Fallback to rule-based logic
  }
}
```

This guide provides everything needed to add new agents to the Cronos AI Agent SDK, whether as built-in agents or custom user agents.