# Built-in Agents Documentation

Welcome to the Cronos AI Agent SDK built-in agents documentation! This directory contains comprehensive guides for all **5 production-ready agents**.

> **Note:** The SDK also includes 1 example custom agent ([GeniusActComplianceAgent](../../packages/core/src/agents/GeniusActComplianceAgent.ts)) and a framework for building unlimited custom agents. See [Custom Agent Types](../../CUSTOM_AGENT_TYPES.md) for 10 detailed patterns.

## 🎯 What Are Agents?

**Agents are decision-makers, not executors.** They analyze data and return recommendations - your code decides whether to act on them.

For a complete understanding of agents vs. SDK components, see:
- **[Agents vs Components](../AGENTS_VS_COMPONENTS.md)** - Complete distinction guide
- **[SDK Components Guide](../SDK_COMPONENTS_GUIDE.md)** - All 8 infrastructure systems

## 📚 Documentation Index

### Getting Started
- **[Agents Overview](./AGENTS_OVERVIEW.md)** - Start here! Understand what agents do and don't do
- **[Agents Comparison](./AGENTS_COMPARISON.md)** - Compare all agents and learn when to use each

### Individual Agent Guides

#### 1. RiskMonitor
**[Full Documentation →](./RISK_MONITOR.md)**

Monitors balance/collateral ratios and prevents risky operations.

- **Actions:** ALLOW, LIMIT, BLOCK
- **Use Case:** Vault protection, collateral monitoring
- **Confidence:** 85-95%

```typescript
sdk.registerAgent('risk-monitor', new RiskMonitor());
const decision = await sdk.executeAgent('risk-monitor', {
  contractId: 'vault',
  user: userAddress,
  customData: { balance: BigInt(5e18), threshold: BigInt(10e18) }
});
// → { action: { type: 'LIMIT' }, confidence: 0.85 }
```

---

#### 2. LiquidityOptimizer
**[Full Documentation →](./LIQUIDITY_OPTIMIZER.md)**

Optimizes liquidity allocation in DEX pools and AMMs.

- **Actions:** ADD, REMOVE, HOLD
- **Use Case:** DEX pools, AMM optimization
- **Confidence:** 80-85%

```typescript
sdk.registerAgent('liquidity-optimizer', new LiquidityOptimizer());
const decision = await sdk.executeAgent('liquidity-optimizer', {
  contractId: 'dex-pool',
  user: poolAddress,
  customData: { currentPrice: BigInt(100e18), liquidity: BigInt(1000e18), targetRatio: 0.8 }
});
// → { action: { type: 'REMOVE', value: '200...' }, confidence: 0.85 }
```

---

#### 3. EmergencyBrake
**[Full Documentation →](./EMERGENCY_BRAKE.md)**

Triggers emergency stops when critical thresholds are breached.

- **Actions:** PAUSE, RESUME
- **Use Case:** Circuit breakers, emergency stops
- **Confidence:** 95-100%

```typescript
sdk.registerAgent('emergency-brake', new EmergencyBrake());
const decision = await sdk.executeAgent('emergency-brake', {
  contractId: 'protocol',
  user: 'system',
  customData: { metric: 95, criticalThreshold: 90 }
});
// → { action: { type: 'PAUSE' }, confidence: 1.0 }
```

---

#### 4. ThresholdGuard
**[Full Documentation →](./THRESHOLD_GUARD.md)**

Enforces minimum and maximum limits on operations.

- **Actions:** APPROVE, REJECT
- **Use Case:** Transaction limits, min/max enforcement
- **Confidence:** 90-100%

```typescript
sdk.registerAgent('threshold-guard', new ThresholdGuard());
const decision = await sdk.executeAgent('threshold-guard', {
  contractId: 'vault',
  user: userAddress,
  customData: { value: BigInt(50e18), minThreshold: BigInt(1e18), maxThreshold: BigInt(100e18) }
});
// → { action: { type: 'APPROVE' }, confidence: 1.0 }
```

---

#### 5. AnomalyDetector
**[Full Documentation →](./ANOMALY_DETECTOR.md)**

Detects unusual patterns using statistical analysis (Z-scores).

- **Actions:** NORMAL, ANOMALY_DETECTED (LOW/MEDIUM/HIGH)
- **Use Case:** Fraud detection, pattern analysis
- **Confidence:** 70-95%

```typescript
sdk.registerAgent('anomaly-detector', new AnomalyDetector());
const decision = await sdk.executeAgent('anomaly-detector', {
  contractId: 'nft-marketplace',
  user: buyerAddress,
  customData: { currentValue: 100, historicalAverage: 50, standardDeviation: 10 }
});
// → { action: { type: 'ANOMALY_DETECTED', severity: 'HIGH' }, confidence: 0.95 }
```

---

## ⚠️ Critical Understanding

**Agents are advisory, not executive:**

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

**What agents do:**
- ✅ Analyze data
- ✅ Return recommendations
- ✅ Provide confidence scores
- ✅ Explain reasoning

**What agents DON'T do:**
- ❌ Execute transactions
- ❌ Access your wallet
- ❌ Pause contracts directly
- ❌ Make final decisions

## 🚀 Quick Start

### Install the SDK

```bash
npm install @sentinel/ai-agent-sdk
```

### Register and Use All Agents

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

// Use any agent
const decision = await sdk.executeAgent('risk-monitor', {
  contractId: 'my-vault',
  user: '0xabc...',
  customData: { balance: BigInt(5e18), threshold: BigInt(10e18) }
});

// Interpret the decision
if (decision.action.type === 'BLOCK') {
  // YOU decide what to do
  await vault.pauseUser(userAddress);
}
```

## 🧪 Testing

Run the standalone test to see all agents in action:

```bash
cd packages/examples/standalone-test
npm install
npm test
```

Expected output:
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

## 📖 Additional Resources

- [Main SDK Documentation](../../AGENTS_SDK.md)
- [Custom Agent Development](../../CUSTOM_AGENT_TYPES.md)
- [User Stories & Examples](../../USER_STORIES.md)
- [Setup Guide](../../SETUP_GUIDE.md)

## 🤝 Contributing

Found an issue or want to improve the documentation? Please open an issue or PR!

## 📝 License

MIT License - see LICENSE file for details

