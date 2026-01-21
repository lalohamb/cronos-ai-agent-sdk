# How the Cronos AI Agent SDK Works - Simple Explanation

## 🎯 The Big Picture

Think of this SDK as **adding a smart assistant to your smart contracts**. The assistant:
1. **Watches** your contracts for events
2. **Analyzes** what's happening
3. **Recommends** what to do
4. **Helps you** take action

---

## 🔄 The Basic Flow

```
Smart Contract → Event → Agent → Decision → Your App
```

### Example:
1. User deposits money in your vault (**Smart Contract**)
2. Vault emits "Deposited" event (**Event**)
3. RiskMonitor agent analyzes the deposit (**Agent**)
4. Agent says "BLOCK - balance too low" (**Decision**)
5. Your app pauses the user's account (**Your App**)

---

## 🧠 How Agents Work

### Step 1: Agent Gets Context
```typescript
const context = {
  contractId: 'my-vault',
  user: '0x123...',
  customData: {
    balance: 5,      // User has 5 tokens
    threshold: 10    // Minimum safe amount is 10 tokens
  }
};
```

### Step 2: Agent Analyzes
```typescript
// RiskMonitor thinks:
if (balance < threshold * 0.5) {
  return "BLOCK - critically low";
}
if (balance < threshold) {
  return "LIMIT - below threshold";
}
return "ALLOW - safe";
```

### Step 3: Agent Returns Decision
```typescript
{
  action: { type: 'LIMIT', value: 2.5 },
  reason: 'Balance below threshold - reducing limits',
  confidence: 0.85
}
```

---

## 🏗️ The Architecture

```
Your App
    ↓
SentinelAgentSDK (Main Controller)
    ↓
┌─────────────┬─────────────┬─────────────┐
│   Agents    │  Contracts  │   Events    │
│             │             │             │
│ RiskMonitor │   Vault     │ Deposited   │
│ Liquidity   │   DEX       │ PriceUpdate │
│ Emergency   │   NFT       │ Sale        │
└─────────────┴─────────────┴─────────────┘
    ↓
Cronos Blockchain
```

### Components Explained:

**1. SentinelAgentSDK** - The main controller
- Manages everything
- Connects agents to contracts
- Handles events

**2. Agents** - The decision makers
- Each agent has one job (risk, liquidity, etc.)
- Takes context, returns decision
- Can be rule-based or AI-powered

**3. Contracts** - Your smart contracts
- Registered with the SDK
- Emit events when things happen
- SDK listens to these events

**4. Events** - Blockchain notifications
- "Deposited", "Withdrawn", "Sale", etc.
- Trigger agent analysis automatically

---

## 📝 Code Example Walkthrough

Let's trace through a real example:

### Setup
```typescript
// 1. Create SDK instance
const sdk = new SentinelAgentSDK({
  network: 'cronos-testnet',
  rpcUrl: 'https://evm-t3.cronos.org'
});

// 2. Register your vault contract
await sdk.registerContract('my-vault', {
  address: '0x123...',
  abi: vaultABI
});

// 3. Register risk monitoring agent
sdk.registerAgent('risk-monitor', new RiskMonitor());
```

### Event Automation
```typescript
// 4. Set up automatic monitoring
sdk.onContractEvent('my-vault', 'Deposited', async (event) => {
  // This runs every time someone deposits
  
  const decision = await sdk.executeAgent('risk-monitor', {
    contractId: 'my-vault',
    user: event.args.user,
    customData: {
      balance: event.args.newBalance,
      threshold: ethers.parseEther('10')
    }
  });
  
  // Act on the decision
  if (decision.action.type === 'BLOCK') {
    await vault.pauseUser(event.args.user);
    console.log('⚠️ User paused due to risk');
  }
});

// 5. Start monitoring
await sdk.start();
```

### What Happens:
1. User deposits 5 tokens
2. Vault emits `Deposited(user, 5, newBalance)`
3. SDK catches the event
4. Calls RiskMonitor with balance data
5. RiskMonitor returns "LIMIT" decision
6. Your code pauses the user

---

## 🤖 Built-in Agents Explained

### 1. RiskMonitor
**Job:** Protect against risky operations
```typescript
Input: { balance: 5, threshold: 10 }
Logic: if balance < threshold → LIMIT
Output: { type: 'LIMIT', reason: 'Below threshold' }
```

### 2. LiquidityOptimizer
**Job:** Keep liquidity pools balanced
```typescript
Input: { liquidity: 1000, targetRatio: 0.8 }
Logic: if liquidity > target → REMOVE excess
Output: { type: 'REMOVE', amount: 200 }
```

### 3. EmergencyBrake
**Job:** Stop everything when things go wrong
```typescript
Input: { metric: 95, criticalThreshold: 90 }
Logic: if metric > threshold → PAUSE
Output: { type: 'PAUSE', reason: 'Critical threshold breached' }
```

### 4. ThresholdGuard
**Job:** Enforce min/max limits
```typescript
Input: { value: 150, maxThreshold: 100 }
Logic: if value > max → cap at max
Output: { type: 'APPROVE', adjustedValue: 100 }
```

### 5. AnomalyDetector
**Job:** Find unusual patterns
```typescript
Input: { currentValue: 100, average: 50, stdDev: 10 }
Logic: if deviation > 3 standard deviations → ANOMALY
Output: { type: 'ANOMALY_DETECTED', severity: 'HIGH' }
```

---

## 🎨 Custom Agents

You can create your own agents:

```typescript
class PriceProtectionAgent extends BaseAgent {
  config = {
    id: 'price-protection',
    name: 'Price Protection Agent',
    description: 'Prevents price manipulation',
    version: '1.0.0'
  };

  async decide(context) {
    const { currentPrice, oraclePrice } = context.customData;
    const deviation = Math.abs(currentPrice - oraclePrice) / oraclePrice;

    if (deviation > 0.1) {  // 10% deviation
      return {
        action: { type: 'REJECT' },
        reason: `Price deviates ${(deviation * 100).toFixed(1)}% from oracle`,
        confidence: 0.95
      };
    }

    return {
      action: { type: 'APPROVE' },
      reason: 'Price within acceptable range',
      confidence: 0.9
    };
  }
}

// Use it
sdk.registerAgent('price-protection', new PriceProtectionAgent());
```

---

## 🧠 AI Integration (Optional)

### Rule-Based (Default)
```typescript
// Fast, predictable, no API costs
if (balance < threshold) {
  return { action: 'BLOCK', reason: 'Too risky' };
}
```

### AI-Powered (Optional)
```typescript
// Slower, smarter, costs money
const prompt = `
  User balance: ${balance}
  Market conditions: ${marketData}
  Historical behavior: ${userHistory}
  
  Should we allow this transaction?
`;

const decision = await aiProvider.generateDecision(prompt, context);
// AI returns: { action: 'ALLOW', reason: 'User has good history despite low balance' }
```

---

## 🛡️ Policy Engine

Add safety rules that apply to ALL decisions:

```typescript
// Minimum confidence policy
sdk.addPolicy({
  id: 'min-confidence',
  name: 'Minimum Confidence Policy',
  validate: (decision) => decision.confidence >= 0.7,
  enforce: (decision) => ({
    ...decision,
    confidence: Math.max(decision.confidence, 0.7)
  })
});

// Now all agent decisions must have 70%+ confidence
```

---

## 🎮 Real-World Example: Gaming Anti-Cheat

```typescript
// Player earns 100 tokens in 1 hour
// Normal rate is 10 tokens/hour
// This player is earning 10x normal rate!

const decision = await sdk.executeAgent('anti-cheat', {
  contractId: 'game',
  user: 'player123',
  customData: {
    earnedTokens: 100,
    timeSpent: 3600,  // 1 hour
    expectedRate: 10
  }
});

// Agent decides: BAN for 24 hours
// Your game automatically bans the player
```

---

## 🔄 Event Flow Diagram

```
1. Smart Contract Event
   ↓
2. SDK Event Listener catches it
   ↓
3. SDK calls registered handler
   ↓
4. Handler executes agent
   ↓
5. Agent analyzes context
   ↓
6. Agent returns decision
   ↓
7. Policy Engine validates decision
   ↓
8. Your code acts on decision
```

---

## 💡 Key Benefits

### For Developers:
- **Easy to use**: 5 lines of code to add intelligence
- **Protocol agnostic**: Works with any smart contract
- **Type safe**: Full TypeScript support
- **Tested**: Comprehensive test suite

### For Users:
- **Automatic protection**: No manual monitoring needed
- **Fast response**: Decisions in milliseconds
- **Consistent**: Same logic applied every time
- **Transparent**: Clear reasons for all decisions

---

## 🚀 Getting Started

### 1. Test it (30 seconds)
```bash
cd v4/packages/examples/standalone-test
npm install
npm test
```

### 2. See the UI (2 minutes)
```bash
cd v4/packages/examples/ui-demo
npm install
npm run dev
```

### 3. Use in your project
```typescript
import { SentinelAgentSDK, RiskMonitor } from '@sentinel/ai-agent-sdk';

const sdk = new SentinelAgentSDK({ /* config */ });
sdk.registerAgent('risk', new RiskMonitor());

const decision = await sdk.executeAgent('risk', {
  contractId: 'my-contract',
  user: '0x123',
  customData: { /* your data */ }
});

console.log('Agent recommends:', decision.action.type);
```

---

## 🎯 Summary

This SDK is like having a **smart assistant for your smart contracts**:

1. **You register** your contracts and agents
2. **SDK watches** for blockchain events
3. **Agents analyze** what's happening
4. **You get recommendations** on what to do
5. **Your app takes action** based on recommendations

It's **fully functional right now** - you can test all agents without deploying any contracts!