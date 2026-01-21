# Built-in Agents - Overview

## ⚠️ Critical Understanding: What Agents Actually Do

**Agents Make Recommendations, They Don't Execute Transactions**

All agents in the Cronos AI Agent SDK follow the same fundamental principle:

```
1. Agent analyzes data → Returns decision object
2. Your code receives → Interprets the decision  
3. You decide → Whether to act on it
4. You execute → The actual on-chain/off-chain action
```

## 🎯 The Five Built-in Agents

| Agent | Purpose | Actions | Use Case |
|-------|---------|---------|----------|
| **RiskMonitor** | Monitors risk metrics and recommends protective actions | ALLOW, LIMIT, BLOCK | Vault protection, collateral monitoring |
| **LiquidityOptimizer** | Optimizes liquidity allocation | ADD, REMOVE, HOLD | DEX pools, AMM optimization |
| **EmergencyBrake** | Triggers emergency stops | PAUSE, RESUME | Circuit breakers, emergency stops |
| **ThresholdGuard** | Enforces min/max limits | APPROVE, REJECT | Transaction limits, caps |
| **AnomalyDetector** | Detects unusual patterns | NORMAL, ANOMALY_DETECTED | Fraud detection, monitoring |

## 📋 What Agents Do vs. Don't Do

| What Agents Do | What Agents DON'T Do |
|----------------|---------------------|
| ✅ Analyze data | ❌ Execute transactions |
| ✅ Return recommendations | ❌ Access your wallet |
| ✅ Provide confidence scores | ❌ Pause contracts directly |
| ✅ Explain reasoning | ❌ Make final decisions |

## 🔑 Key Concepts

### 1. Agents are Advisory, Not Executive
- ✅ Agents **analyze** data
- ✅ Agents **recommend** actions
- ❌ Agents **DO NOT** execute transactions
- ❌ Agents **DO NOT** have wallet access

### 2. You Control Execution
```typescript
const decision = await sdk.executeAgent('emergency-brake', context);

// The decision is just data:
{
  action: { type: 'PAUSE', reason: '...', severity: 'CRITICAL' },
  reason: 'Metric 95 exceeded critical threshold 90',
  confidence: 1.0
}

// YOU decide what to do with it
```

### 3. Separation of Concerns
```
┌─────────────────┐
│  Agent Layer    │ ← Makes intelligent decisions
│  (AI/Rules)     │
└────────┬────────┘
         │ Returns decision object
         ▼
┌─────────────────┐
│  Your Code      │ ← Interprets decision
│  (Business      │
│   Logic)        │
└────────┬────────┘
         │ Executes action
         ▼
┌─────────────────┐
│  Blockchain     │ ← Actual state change
│  (Smart         │
│   Contract)     │
└─────────────────┘
```

## 💡 Why This Design?

### Security
- Agents can't accidentally drain funds
- Agents can't execute unauthorized transactions
- You maintain full control

### Flexibility
- Same agent decision can trigger different actions
- You can add human approval steps
- You can test without on-chain risk

### Compliance
- You can audit decisions before execution
- You can add compliance checks
- You can implement multi-sig requirements

## 🚀 Quick Start - Using All Agents

```typescript
import { 
  SentinelAgentSDK, 
  RiskMonitor, 
  LiquidityOptimizer, 
  EmergencyBrake, 
  ThresholdGuard, 
  AnomalyDetector 
} from '@sentinel/ai-agent-sdk';

const sdk = new SentinelAgentSDK({
  network: 'cronos-testnet',
  rpcUrl: 'https://evm-t3.cronos.org'
});

// Register all agents
sdk.registerAgent('risk-monitor', new RiskMonitor());
sdk.registerAgent('liquidity-optimizer', new LiquidityOptimizer());
sdk.registerAgent('emergency-brake', new EmergencyBrake());
sdk.registerAgent('threshold-guard', new ThresholdGuard());
sdk.registerAgent('anomaly-detector', new AnomalyDetector());
```

## 📚 Individual Agent Documentation

- [RiskMonitor](./RISK_MONITOR.md) - Risk management and collateral monitoring
- [LiquidityOptimizer](./LIQUIDITY_OPTIMIZER.md) - DEX pool optimization
- [EmergencyBrake](./EMERGENCY_BRAKE.md) - Circuit breaker and emergency stops
- [ThresholdGuard](./THRESHOLD_GUARD.md) - Transaction limit enforcement
- [AnomalyDetector](./ANOMALY_DETECTOR.md) - Fraud and anomaly detection

## 🧪 Testing

Run the standalone test to see all agents in action:

```bash
cd packages/examples/standalone-test
npm install
npm test
```

## 📝 Summary

**The agent says "I recommend X" → Your code decides "Should I do X?" → Your transaction executes "Do X"**

This is a **feature, not a limitation** - it keeps you in control while giving you intelligent automation! 🎯

