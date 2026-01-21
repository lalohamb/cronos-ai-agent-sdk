# Cronos AI Agent SDK - Quick Reference

## 🎯 What's What?

### Agents (Decision-Makers)
**5 Built-in + Unlimited Custom**

| Agent | Actions | Use Case |
|-------|---------|----------|
| RiskMonitor | ALLOW, LIMIT, BLOCK | Collateral monitoring |
| LiquidityOptimizer | ADD, REMOVE, HOLD | DEX pool optimization |
| EmergencyBrake | PAUSE, RESUME | Circuit breakers |
| ThresholdGuard | APPROVE, REJECT | Transaction limits |
| AnomalyDetector | NORMAL, ANOMALY_DETECTED | Fraud detection |

### Components (Infrastructure)
**8 Core Systems**

| Component | Purpose |
|-----------|---------|
| Policy System | Governance & compliance |
| Control Plane | Centralized management |
| Payment System (x402) | Monetization & billing |
| Contract System | Blockchain integration |
| Event System | Real-time monitoring |
| API Server | REST API endpoints |
| AI Integration | OpenAI support |
| Audit System | Decision tracking |

---

## 🚀 Quick Start

### Install
```bash
npm install @sentinel/ai-agent-sdk
```

### Basic Setup
```typescript
import { SentinelAgentSDK, RiskMonitor } from '@sentinel/ai-agent-sdk';

const sdk = new SentinelAgentSDK({
  network: 'cronos-testnet',
  rpcUrl: 'https://evm-t3.cronos.org'
});

// Register agent
sdk.registerAgent('risk', new RiskMonitor());

// Register contract
await sdk.registerContract('vault', {
  address: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
  abi: vaultABI,
  network: 'cronos-testnet'
});

// Execute agent
const decision = await sdk.executeAgent('risk', {
  contractId: 'vault',
  user: '0x123',
  customData: { balance: BigInt(5e18), threshold: BigInt(10e18) }
});

console.log(decision);
// { action: { type: 'LIMIT' }, reason: '...', confidence: 0.85 }
```

---

## 📋 Common Patterns

### 1. Event-Driven Agent Execution
```typescript
sdk.onContractEvent('vault', 'Deposited', async (event) => {
  const decision = await sdk.executeAgent('risk', {
    contractId: 'vault',
    user: event.args.user,
    customData: { balance: event.args.amount }
  });
  
  if (decision.action.type === 'BLOCK') {
    await vault.pauseUser(event.args.user);
  }
});

await sdk.start();
```

### 2. Policy Enforcement
```typescript
sdk.policyEngine.addPolicy({
  id: 'max-withdrawal',
  validate: (decision) => decision.action.value <= 1000,
  enforce: (decision) => ({
    ...decision,
    action: { ...decision.action, value: Math.min(decision.action.value, 1000) }
  })
});
```

### 3. Payment Integration
```typescript
const sdk = new SentinelAgentSDK({
  network: 'cronos-mainnet',
  payments: {
    enabled: true,
    providers: [new CronosProvider({ apiKey: 'your-key' })],
    defaultProvider: 'cronos'
  }
});

// Automatic 402 handling
const result = await sdk.executeAgent('risk', context);
```

### 4. Custom Agent
```typescript
import { BaseAgent } from '@sentinel/ai-agent-sdk';

class MyAgent extends BaseAgent {
  config = {
    id: 'my-agent',
    name: 'My Agent',
    description: 'Custom logic',
    version: '1.0.0'
  };

  async decide(context) {
    return {
      action: { type: 'ALLOW' },
      reason: 'Custom logic passed',
      confidence: 0.9
    };
  }
}

sdk.registerAgent('my-agent', new MyAgent());
```

### 5. Multi-Agent Validation
```typescript
async function validateTransaction(context) {
  // Check thresholds
  const threshold = await sdk.executeAgent('threshold-guard', context);
  if (threshold.action.type === 'REJECT') return false;
  
  // Check risk
  const risk = await sdk.executeAgent('risk-monitor', context);
  if (risk.action.type === 'BLOCK') return false;
  
  // Check anomalies
  const anomaly = await sdk.executeAgent('anomaly-detector', context);
  if (anomaly.action.type === 'ANOMALY_DETECTED') return false;
  
  return true;
}
```

---

## 🔑 Key Concepts

### Agent Decision Flow
```
1. Agent analyzes data → Returns AgentDecision
2. Your code receives decision → Interprets recommendation
3. You decide what to do → Execute or ignore
4. Your transaction executes → Actual state change
```

### What Agents Do vs. Don't Do

| Agents DO | Agents DON'T |
|-----------|--------------|
| ✅ Analyze data | ❌ Execute transactions |
| ✅ Return recommendations | ❌ Access your wallet |
| ✅ Provide confidence scores | ❌ Pause contracts directly |
| ✅ Explain reasoning | ❌ Make final decisions |

### Component Responsibilities

| Component | Responsibility |
|-----------|----------------|
| Policy System | Validate/modify decisions |
| Control Plane | Distribute policies, collect audits |
| Payment System | Process payments, track usage |
| Contract System | Manage blockchain connections |
| Event System | Monitor events, trigger agents |
| API Server | Expose REST endpoints |
| AI Integration | Provide AI-powered analysis |
| Audit System | Track decisions cryptographically |

---

## 📊 Decision Types by Agent

### RiskMonitor
```typescript
{ action: { type: 'ALLOW' }, confidence: 0.9 }
{ action: { type: 'LIMIT', value: '2500...' }, confidence: 0.85 }
{ action: { type: 'BLOCK' }, confidence: 0.95 }
```

### LiquidityOptimizer
```typescript
{ action: { type: 'HOLD' }, confidence: 0.8 }
{ action: { type: 'ADD', value: '1000...' }, confidence: 0.85 }
{ action: { type: 'REMOVE', value: '500...' }, confidence: 0.85 }
```

### EmergencyBrake
```typescript
{ action: { type: 'RESUME' }, confidence: 0.95 }
{ action: { type: 'PAUSE', severity: 'CRITICAL' }, confidence: 1.0 }
```

### ThresholdGuard
```typescript
{ action: { type: 'APPROVE' }, confidence: 1.0 }
{ action: { type: 'APPROVE', value: '100...' }, confidence: 0.9 } // Capped
{ action: { type: 'REJECT', severity: 'HIGH' }, confidence: 1.0 }
```

### AnomalyDetector
```typescript
{ action: { type: 'NORMAL' }, confidence: 0.9 }
{ action: { type: 'ANOMALY_DETECTED', severity: 'LOW' }, confidence: 0.7 }
{ action: { type: 'ANOMALY_DETECTED', severity: 'MEDIUM' }, confidence: 0.85 }
{ action: { type: 'ANOMALY_DETECTED', severity: 'HIGH' }, confidence: 0.95 }
```

---

## 🛠️ Configuration Options

### SDK Config
```typescript
interface SDKConfig {
  network: string;                    // 'cronos-testnet' | 'cronos-mainnet'
  rpcUrl: string;                     // RPC endpoint
  privateKey?: string;                // Optional wallet key
  aiProvider?: 'openai';              // Optional AI
  aiApiKey?: string;                  // OpenAI key
  aiModel?: string;                   // 'gpt-4' | 'gpt-3.5-turbo'
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  controlPlane?: ControlPlaneClient;  // Centralized management
  runtime?: {                         // Runtime identification
    appName?: string;
    env?: string;
    version?: string;
  };
  audit?: {                           // Decision auditing
    enabled: boolean;
    redact?: (context) => context;
  };
  policyPack?: {                      // Policy pack config
    enabled?: boolean;
    strict?: boolean;
    verifier?: PolicyPackVerifier;
    refreshMs?: number;
  };
  payments?: PaymentConfig;           // Payment system
}
```

### Payment Config
```typescript
interface PaymentConfig {
  enabled: boolean;
  providers: PaymentProvider[];
  defaultProvider?: string;
  retryConfig?: {
    maxAttempts: number;
    baseDelay: number;
    maxDelay: number;
  };
}
```

---

## 📚 Documentation Links

### Getting Started
- [README](../README.md) - Main documentation
- [Setup Guide](../SETUP_GUIDE.md) - Installation and setup
- [Architecture Guide](../ARCHITECTURE_GUIDE.md) - System architecture

### Agents
- [Agents vs Components](./AGENTS_VS_COMPONENTS.md) - Understanding the distinction
- [Built-in Agents](./agents/README.md) - All 5 agents documented
- [Custom Agent Types](../CUSTOM_AGENT_TYPES.md) - 10 custom agent patterns

### Components
- [SDK Components Guide](./SDK_COMPONENTS_GUIDE.md) - All 8 components
- [Policy Guide](../PolicyGuide.md) - Policy system
- [X402 Payment System](../X402_README.md) - Payment component

### Examples
- [User Stories](../USER_STORIES.md) - Real-world examples
- [Examples Directory](../packages/examples/) - Working code

---

## 🧪 Testing

### Run Tests
```bash
# All tests
npm test

# Specific agent
npm test -- RiskMonitor

# Standalone test
cd packages/examples/standalone-test
npm install
npm test
```

### Expected Output
```
🚀 Testing Cronos AI Agent SDK

1️⃣ Testing RiskMonitor...
   Result: LIMIT - Balance below threshold
   Confidence: 85%

2️⃣ Testing LiquidityOptimizer...
   Result: REMOVE - Excess liquidity detected
   Confidence: 85%

3️⃣ Testing EmergencyBrake...
   Result: PAUSE - Critical threshold breached
   Confidence: 100%

4️⃣ Testing ThresholdGuard...
   Result: REJECT - Below minimum threshold
   Confidence: 100%

5️⃣ Testing AnomalyDetector...
   Result: ANOMALY_DETECTED (HIGH) - 5.00 standard deviations
   Confidence: 95%

✅ All agents tested successfully!
```

---

## 💡 Tips & Best Practices

### 1. Always Handle Decisions
```typescript
const decision = await sdk.executeAgent('risk', context);

// ✅ Good - Handle all cases
if (decision.action.type === 'BLOCK') {
  await vault.pauseUser(user);
} else if (decision.action.type === 'LIMIT') {
  await vault.setLimit(user, decision.action.value);
} else {
  await vault.allow(user);
}

// ❌ Bad - Ignoring decision
const decision = await sdk.executeAgent('risk', context);
// ... no action taken
```

### 2. Use Confidence Levels
```typescript
if (decision.confidence > 0.95) {
  // Auto-execute high confidence
  await executeAction(decision);
} else if (decision.confidence > 0.8) {
  // Execute with notification
  await executeAction(decision);
  await notifyAdmin(decision);
} else {
  // Require human approval
  await requestApproval(decision);
}
```

### 3. Combine Multiple Agents
```typescript
// Sequential validation (AND logic)
const checks = [
  await sdk.executeAgent('threshold-guard', context),
  await sdk.executeAgent('risk-monitor', context),
  await sdk.executeAgent('anomaly-detector', context)
];

const allPassed = checks.every(check => 
  check.action.type === 'ALLOW' || 
  check.action.type === 'APPROVE' || 
  check.action.type === 'NORMAL'
);
```

### 4. Log All Decisions
```typescript
const decision = await sdk.executeAgent('risk', context);

await auditLog.create({
  agent: 'risk-monitor',
  decision: decision,
  context: context,
  executed: true,
  timestamp: Date.now()
});
```

### 5. Test Before Production
```typescript
if (process.env.NODE_ENV === 'production') {
  await executeAction(decision);
} else {
  console.log('Would execute:', decision);
}
```

---

## 🎉 Summary

**Agents:** 5 built-in + unlimited custom decision-makers  
**Components:** 8 core infrastructure systems  
**Test Coverage:** 80%+ across the SDK  
**Status:** Production-ready ✅

**Get Started:** `npm install @sentinel/ai-agent-sdk`

