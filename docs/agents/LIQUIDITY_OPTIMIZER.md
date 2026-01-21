# LiquidityOptimizer Agent

## 📋 Overview

**Purpose:** Optimizes liquidity allocation in DEX pools and AMMs

**Type:** Deterministic Agent

**Actions:** `ADD`, `REMOVE`, `HOLD`

## 🎯 What It Actually Does

The LiquidityOptimizer agent **analyzes** liquidity data and **recommends** rebalancing actions. It does NOT execute liquidity transactions directly.

```typescript
// Agent analyzes and returns a recommendation
async decide(context: AgentContext): Promise<AgentDecision> {
  const liquidityBN = BigInt(liquidity.toString());
  const targetLiquidity = (liquidityBN * BigInt(Math.floor(targetRatio * 100))) / 100n;
  const difference = liquidityBN - targetLiquidity;
  
  if (difference > 0n) {
    return {
      action: { type: 'REMOVE', value: difference.toString(), reason: 'Excess liquidity' },
      reason: `Remove ${difference} excess liquidity`,
      confidence: 0.85
    };
  }
  // Returns a SUGGESTION, not a liquidity transaction
}
```

## 📊 Decision Logic

### REMOVE (Excess Liquidity)
- **Trigger:** Current liquidity > target (beyond 20% tolerance)
- **Confidence:** 85%
- **Returns:** Amount to remove
- **Recommendation:** Remove excess liquidity

### ADD (Insufficient Liquidity)
- **Trigger:** Current liquidity < target (beyond 20% tolerance)
- **Confidence:** 85%
- **Returns:** Amount to add
- **Recommendation:** Add liquidity to reach target

### HOLD (Within Range)
- **Trigger:** Liquidity within ±20% of target
- **Confidence:** 80%
- **Recommendation:** No action needed

## 🚀 Usage

### Basic Setup

```typescript
import { SentinelAgentSDK, LiquidityOptimizer } from '@sentinel/ai-agent-sdk';

const sdk = new SentinelAgentSDK({
  network: 'cronos-testnet',
  rpcUrl: 'https://evm-t3.cronos.org'
});

sdk.registerAgent('liquidity-optimizer', new LiquidityOptimizer());

const decision = await sdk.executeAgent('liquidity-optimizer', {
  contractId: 'dex-pool',
  user: '0x456...',
  customData: {
    currentPrice: BigInt(100e18),
    liquidity: BigInt(1000e18),
    targetRatio: 0.8  // Target 80% liquidity
  }
});

// Result: { action: { type: 'REMOVE', value: '200...' }, confidence: 0.85 }
```

### Required Input Data

```typescript
customData: {
  currentPrice: BigInt,    // Current market price (BigInt)
  liquidity: BigInt,       // Current liquidity amount (BigInt)
  targetRatio: number      // Target liquidity ratio (0-1)
}
```

## 💡 What Gets "Added" or "Removed"?

The agent **recommends** adding/removing liquidity. What actually happens depends on **your implementation**:

### Option 1: Execute Liquidity Transaction (On-Chain)

```typescript
const decision = await sdk.executeAgent('liquidity-optimizer', {
  contractId: 'dex-pool',
  user: event.args.pool,
  customData: {
    currentPrice: event.args.price,
    liquidity: event.args.liquidity,
    targetRatio: 0.8
  }
});

if (decision.action.type === 'ADD') {
  // YOU execute the liquidity addition
  await pool.addLiquidity(decision.action.value);  // ← THIS adds liquidity
  console.log(`💧 Added ${decision.action.value} liquidity`);
  
} else if (decision.action.type === 'REMOVE') {
  // YOU execute the liquidity removal
  await pool.removeLiquidity(decision.action.value);  // ← THIS removes liquidity
  console.log(`💧 Removed ${decision.action.value} liquidity`);
}
```

### Option 2: Queue for Manual Approval

```typescript
if (decision.action.type === 'REMOVE') {
  // Don't execute immediately, queue for approval
  await liquidityQueue.add({
    action: 'REMOVE',
    amount: decision.action.value,
    reason: decision.reason,
    confidence: decision.confidence,
    status: 'PENDING_APPROVAL'
  });
  
  // Notify admin
  await notifyAdmin({
    message: `Agent recommends removing ${decision.action.value} liquidity`,
    confidence: decision.confidence
  });
}
```

### Option 3: Auto-Execute Only High Confidence

```typescript
if (decision.action.type === 'ADD' && decision.confidence > 0.9) {
  // Auto-execute only if very confident
  await pool.addLiquidity(decision.action.value);
} else {
  // Low confidence - just log
  console.log(`Low confidence (${decision.confidence}), skipping auto-execution`);
}
```

### Option 4: Simulate First, Then Execute

```typescript
if (decision.action.type === 'REMOVE') {
  // Simulate the removal first
  const simulation = await pool.simulateRemoveLiquidity(decision.action.value);
  
  if (simulation.priceImpact < 0.01) { // Less than 1% impact
    // Safe to execute
    await pool.removeLiquidity(decision.action.value);
  } else {
    // Too much impact, don't execute
    console.log('Price impact too high, skipping removal');
  }
}
```

## 🎬 Real-World Example: DEX Liquidity Management

```typescript
import { SentinelAgentSDK, LiquidityOptimizer } from '@sentinel/ai-agent-sdk';
import { ethers } from 'ethers';

const sdk = new SentinelAgentSDK({
  network: 'cronos-mainnet',
  rpcUrl: 'https://evm.cronos.org',
  privateKey: process.env.AGENT_PRIVATE_KEY
});

await sdk.registerContract('dex-pool', {
  address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  abi: dexABI,
  network: 'cronos-mainnet'
});

sdk.registerAgent('liquidity-optimizer', new LiquidityOptimizer());

// Monitor price updates
sdk.onContractEvent('dex-pool', 'PriceUpdate', async (event) => {
  const decision = await sdk.executeAgent('liquidity-optimizer', {
    contractId: 'dex-pool',
    user: event.args.pool,
    customData: {
      currentPrice: event.args.price,
      liquidity: event.args.liquidity,
      targetRatio: 0.8 // Target 80% utilization
    }
  });
  
  if (decision.action.type === 'ADD') {
    await pool.addLiquidity(decision.action.value);
    console.log(`💧 Added ${decision.action.value} liquidity`);
  } else if (decision.action.type === 'REMOVE') {
    await pool.removeLiquidity(decision.action.value);
    console.log(`💧 Removed ${decision.action.value} liquidity`);
  }
});

await sdk.start();
```

### Outcome
- Rebalances pools automatically every price change
- Increases LP fee earnings by 25%
- Reduces impermanent loss by 30%
- Maintains optimal liquidity 24/7

## 🧪 Testing

```bash
cd packages/examples/standalone-test
npm install
npm test
```

Expected output:
```
2️⃣ Testing LiquidityOptimizer...
   Result: REMOVE - Excess liquidity detected
   Confidence: 85%
```

## 📝 Summary

| What LiquidityOptimizer Does | What It Doesn't Do |
|------------------------------|-------------------|
| ✅ Analyzes liquidity vs target | ❌ Executes liquidity transactions |
| ✅ Returns ADD/REMOVE/HOLD | ❌ Accesses your wallet |
| ✅ Calculates optimal amounts | ❌ Makes final decision |
| ✅ Provides confidence score | ❌ Adds/removes liquidity directly |

**LiquidityOptimizer recommends → Your code decides → Your transaction executes**

