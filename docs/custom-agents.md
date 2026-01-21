# Creating Custom Agents

## Basic Custom Agent

```typescript
import { BaseAgent, AgentContext, AgentDecision } from '@sentinel/ai-agent-sdk';

class MyCustomAgent extends BaseAgent {
  config = {
    id: 'my-agent',
    name: 'My Custom Agent',
    description: 'Does something custom',
    version: '1.0.0'
  };

  async decide(context: AgentContext): Promise<AgentDecision> {
    this.validateContext(context);
    
    const { value } = context.customData;

    if (!value || typeof value !== 'number') {
      throw new Error('MyCustomAgent requires numeric value in customData');
    }

    if (value > 100) {
      return {
        action: { 
          type: 'SELL', 
          value: value * 0.5,
          reason: 'Value exceeds threshold',
          severity: 'HIGH'
        },
        reason: 'Value too high, selling half',
        confidence: 0.8
      };
    }

    return {
      action: { 
        type: 'HOLD', 
        value: 0,
        reason: 'Value within acceptable range',
        severity: 'LOW'
      },
      reason: 'Value acceptable',
      confidence: 0.9
    };
  }
}
```

## Register and Use

```typescript
const agent = new MyCustomAgent();
sdk.registerAgent('my-agent', agent);

const result = await sdk.executeAgent('my-agent', {
  contractId: 'my-contract',
  user: '0xabc...',
  customData: { value: 150 }
});

console.log('Agent decision:', result.action.type);
console.log('Reason:', result.reason);
console.log('Confidence:', result.confidence);
```

## With Custom Validation

```typescript
class ValidatedAgent extends BaseAgent {
  config = {
    id: 'validated-agent',
    name: 'Validated Agent',
    description: 'Agent with custom validation',
    version: '1.0.0'
  };

  async decide(context: AgentContext): Promise<AgentDecision> {
    this.validateContext(context);
    
    // Custom validation
    if (!context.customData.value || context.customData.value < 0) {
      throw new Error('ValidatedAgent requires positive value');
    }

    // Decision logic here...
    return {
      action: { type: 'PROCESS', severity: 'LOW' },
      reason: 'Validation passed',
      confidence: 0.95
    };
  }
}
```

## With AI Integration

```typescript
class AIAgent extends BaseAgent {
  private aiProvider: AIProvider;

  constructor(aiProvider: AIProvider) {
    super();
    this.aiProvider = aiProvider;
  }

  async decide(context: AgentContext): Promise<AgentDecision> {
    const prompt = `Analyze this context and decide what action to take: ${JSON.stringify(context)}`;
    return await this.aiProvider.generateDecision(prompt, context);
  }
}
```
