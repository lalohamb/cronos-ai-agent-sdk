# Getting Started

## Installation

```bash
npm install @sentinel/ai-agent-sdk
```

## Basic Setup

```typescript
import { SentinelAgentSDK } from '@sentinel/ai-agent-sdk';

const sdk = new SentinelAgentSDK({
  network: 'cronos-testnet',
  rpcUrl: 'https://evm-t3.cronos.org',
  privateKey: process.env.AGENT_PRIVATE_KEY, // Optional - only needed for transactions
  logLevel: 'INFO' // Optional - DEBUG, INFO, WARN, ERROR
});
```

## Register a Contract

```typescript
await sdk.registerContract('my-contract', {
  address: '0x123...',
  abi: contractABI,
  network: 'cronos-testnet'
});
```

## Use Built-in Agents

```typescript
import { RiskMonitor } from '@sentinel/ai-agent-sdk';
import { ethers } from 'ethers';

sdk.registerAgent('risk-monitor', new RiskMonitor());

const result = await sdk.executeAgent('risk-monitor', {
  contractId: 'my-contract',
  user: '0xabc...',
  customData: {
    balance: ethers.parseEther('100'),
    threshold: ethers.parseEther('10')
  }
});

console.log('Decision:', result.action.type); // ALLOW, LIMIT, or BLOCK
console.log('Reason:', result.reason);
console.log('Confidence:', result.confidence);
```

## Available Built-in Agents

- **RiskMonitor** - Monitors risk metrics and recommends protective actions
- **LiquidityOptimizer** - Optimizes liquidity allocation
- **EmergencyBrake** - Triggers emergency stops when critical thresholds are breached
- **ThresholdGuard** - Enforces threshold limits on operations
- **AnomalyDetector** - Detects unusual patterns in contract behavior

```typescript
import { 
  RiskMonitor, 
  LiquidityOptimizer, 
  EmergencyBrake,
  ThresholdGuard,
  AnomalyDetector
} from '@sentinel/ai-agent-sdk';

// Register multiple agents
sdk.registerAgent('risk-monitor', new RiskMonitor());
sdk.registerAgent('liquidity-optimizer', new LiquidityOptimizer());
sdk.registerAgent('emergency-brake', new EmergencyBrake());
sdk.registerAgent('threshold-guard', new ThresholdGuard());
sdk.registerAgent('anomaly-detector', new AnomalyDetector());
```

## Listen to Events

```typescript
// Listen for contract events and trigger agents automatically
sdk.onContractEvent('my-contract', 'Transfer', async (event) => {
  console.log('Transfer detected:', event.args);
  
  const decision = await sdk.executeAgent('risk-monitor', {
    contractId: 'my-contract',
    user: event.args.to,
    customData: {
      balance: event.args.value,
      threshold: ethers.parseEther('10')
    }
  });
  
  // Act on the decision
  if (decision.action.type === 'BLOCK') {
    console.warn('⚠️ Risk detected - blocking user');
    // Implement your blocking logic here
  }
});

// Start the SDK to begin monitoring
await sdk.start();
console.log('SDK started - monitoring events...');
```

## Advanced Configuration

```typescript
// With AI integration
const sdk = new SentinelAgentSDK({
  network: 'cronos-testnet',
  rpcUrl: 'https://evm-t3.cronos.org',
  privateKey: process.env.AGENT_PRIVATE_KEY,
  aiProvider: 'openai',
  aiApiKey: process.env.OPENAI_API_KEY,
  aiModel: 'gpt-4',
  audit: {
    enabled: true
  }
});

// With policies
sdk.addPolicy({
  id: 'min-confidence',
  name: 'Minimum Confidence Policy',
  description: 'Ensures all decisions have minimum confidence',
  validate: (decision) => decision.confidence >= 0.7,
  enforce: (decision) => ({
    ...decision,
    confidence: Math.max(decision.confidence, 0.7)
  })
});
```

## Next Steps

- [Create Custom Agents](./custom-agents.md)
- [API Reference](./api-reference.md)
- [Examples](../packages/examples)
