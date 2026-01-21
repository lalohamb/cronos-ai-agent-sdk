# OpenAI Provider - GPT-4 Integration

AI-powered decision making for agents using GPT-4. This integration is **optional** and provides intelligent analysis while maintaining fallback safety.

## Configuration

### SDK Level Configuration

Configure OpenAI in the main SDK constructor:

```typescript
import { SentinelAgentSDK } from '@sentinel/ai-agent-sdk';

const sdk = new SentinelAgentSDK({
  network: 'cronos-testnet',
  rpcUrl: 'https://evm-t3.cronos.org',
  privateKey: process.env.AGENT_PRIVATE_KEY,
  
  // OpenAI Configuration (optional)
  aiProvider: 'openai',
  aiApiKey: process.env.OPENAI_API_KEY,
  aiModel: 'gpt-4', // defaults to 'gpt-4'
  // temperature: 0.3 // optional, defaults to 0.3
});
```

### Environment Variables

Set your OpenAI API key:

```bash
export OPENAI_API_KEY="sk-your-openai-api-key"
export AGENT_PRIVATE_KEY="your-wallet-private-key"
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `aiProvider` | `'openai'` | `undefined` | Enables OpenAI integration |
| `aiApiKey` | `string` | `undefined` | OpenAI API key |
| `aiModel` | `string` | `'gpt-4'` | GPT model to use |
| `temperature` | `number` | `0.3` | Response randomness (0-1) |

## How It Works

### 1. AI Provider Interface

The `OpenAIProvider` implements the `AIProvider` interface:

```typescript
interface AIProvider {
  generateDecision(prompt: string, context: AgentContext): Promise<AgentDecision>;
  isConfigured(): boolean;
}
```

### 2. Smart Prompting System

Uses blockchain-specific system prompts:

```typescript
const systemPrompt = `You are an AI agent for blockchain smart contract automation. 
Analyze the given context and provide a decision in JSON format with:
- action: {type: string, value?: string, reason?: string, severity?: 'LOW'|'MEDIUM'|'HIGH'|'CRITICAL'}
- reason: string
- confidence: number (0-1)`;
```

### 3. Fallback Safety

If AI fails, returns safe default:

```typescript
return {
  action: { type: 'HOLD', reason: 'AI analysis failed' },
  reason: `AI provider error: ${error.message}`,
  confidence: 0.1
};
```

## Usage in Custom Agents

### Basic AI Integration

```typescript
import { BaseAgent, AgentContext, AgentDecision } from '@sentinel/ai-agent-sdk';

export class SmartRiskAgent extends BaseAgent {
  async execute(context: AgentContext): Promise<AgentDecision> {
    const aiProvider = this.getAIProvider();
    
    if (aiProvider?.isConfigured()) {
      // Use AI for complex analysis
      return await aiProvider.generateDecision(
        'Analyze transaction risk based on user history and market conditions',
        context
      );
    }
    
    // Fallback to rule-based logic
    return this.ruleBasedDecision(context);
  }
  
  private ruleBasedDecision(context: AgentContext): AgentDecision {
    // Traditional rule-based logic
    const balance = context.customData?.balance || 0;
    const threshold = context.customData?.threshold || 0;
    
    if (balance > threshold) {
      return {
        action: { type: 'BLOCK', reason: 'Balance exceeds threshold' },
        reason: 'Risk threshold exceeded',
        confidence: 0.9
      };
    }
    
    return {
      action: { type: 'ALLOW' },
      reason: 'Within safe limits',
      confidence: 0.8
    };
  }
}
```

### Hybrid Decision Making

```typescript
export class HybridAgent extends BaseAgent {
  async execute(context: AgentContext): Promise<AgentDecision> {
    // Get rule-based decision first
    const ruleDecision = this.ruleBasedDecision(context);
    
    const aiProvider = this.getAIProvider();
    if (aiProvider?.isConfigured() && ruleDecision.confidence < 0.7) {
      // Use AI for uncertain cases
      const prompt = `Rule-based analysis suggests: ${ruleDecision.action.type}. 
                     Confidence: ${ruleDecision.confidence}. 
                     Please provide final decision.`;
      
      return await aiProvider.generateDecision(prompt, context);
    }
    
    return ruleDecision;
  }
}
```

## AI Decision Format

The AI returns structured decisions:

```typescript
interface AgentDecision {
  action: {
    type: 'ALLOW' | 'BLOCK' | 'HOLD' | 'MODIFY';
    value?: string;
    reason?: string;
    severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  };
  reason: string;
  confidence: number; // 0-1
  metadata?: Record<string, any>;
}
```

## Example: AI-Powered Risk Monitor

```typescript
sdk.onContractEvent('vault', 'Deposited', async (event) => {
  const result = await sdk.executeAgent('smart-risk-monitor', {
    contractId: 'vault',
    user: event.args.user,
    customData: {
      balance: event.args.newBalance,
      previousBalance: event.args.oldBalance,
      depositAmount: event.args.amount,
      userHistory: await getUserTransactionHistory(event.args.user),
      marketConditions: await getMarketData()
    }
  });
  
  if (result.action.type === 'BLOCK') {
    console.warn('🤖 AI blocked transaction:', result.reason);
    console.log('Confidence:', result.confidence);
  }
});
```

## Key Features

- **Optional Integration**: Works without AI configuration
- **Graceful Fallbacks**: Never breaks if AI fails
- **Type Safe**: Returns structured `AgentDecision` objects
- **Context Aware**: Receives full blockchain context
- **Configurable**: Temperature, model, and token limits
- **Error Resilient**: Handles API failures gracefully
- **Cost Efficient**: Only calls AI when needed

## Best Practices

1. **Always provide fallbacks** - Don't rely solely on AI
2. **Use AI for complex decisions** - Simple rules don't need AI
3. **Monitor API costs** - Track OpenAI usage
4. **Set appropriate confidence thresholds** - Use AI when rule confidence is low
5. **Validate AI responses** - Ensure decisions make sense
6. **Handle rate limits** - Implement retry logic for production

## Troubleshooting

### AI Provider Not Working

```typescript
const aiProvider = sdk.getAIProvider();
if (!aiProvider?.isConfigured()) {
  console.log('AI provider not configured - check API key');
}
```

### Common Issues

- **Missing API Key**: Set `OPENAI_API_KEY` environment variable
- **Invalid Model**: Ensure model name is correct (e.g., 'gpt-4')
- **Rate Limits**: Implement exponential backoff
- **Network Issues**: AI failures return safe defaults automatically