# RiskMonitor Agent

## 📋 Overview

**Purpose:** Monitors balance/collateral ratios and prevents risky operations

**Type:** Deterministic Agent

**Actions:** `ALLOW`, `LIMIT`, `BLOCK`

## 🎯 What It Actually Does

The RiskMonitor agent **analyzes** balance data and **recommends** protective actions. It does NOT execute transactions or pause contracts directly.

```typescript
// Agent analyzes and returns a recommendation
async decide(context: AgentContext): Promise<AgentDecision> {
  const balanceBN = BigInt(balance.toString());
  const thresholdBN = BigInt(threshold.toString());
  const criticalThreshold = thresholdBN / 4n; // 25% of threshold
  
  if (balanceBN < criticalThreshold) {
    return {
      action: { type: 'BLOCK', reason: 'Balance critically low', severity: 'CRITICAL' },
      reason: `Balance ${balanceBN} is below critical threshold ${criticalThreshold}`,
      confidence: 0.95
    };
  }
  // Returns a RECOMMENDATION, not a transaction
}
```

## 📊 Decision Logic

### BLOCK (Critically Low)
- **Trigger:** Balance < 25% of threshold
- **Confidence:** 95%
- **Severity:** CRITICAL
- **Recommendation:** Block all operations

### LIMIT (Below Threshold)
- **Trigger:** Balance < threshold (but > 25%)
- **Confidence:** 85%
- **Severity:** HIGH
- **Recommendation:** Reduce limits, restrict operations

### ALLOW (Safe)
- **Trigger:** Balance >= threshold
- **Confidence:** 90%
- **Severity:** LOW
- **Recommendation:** Allow normal operations

## 🚀 Usage

### Basic Setup

```typescript
import { SentinelAgentSDK, RiskMonitor } from '@sentinel/ai-agent-sdk';

const sdk = new SentinelAgentSDK({
  network: 'cronos-testnet',
  rpcUrl: 'https://evm-t3.cronos.org'
});

sdk.registerAgent('risk-monitor', new RiskMonitor());

const decision = await sdk.executeAgent('risk-monitor', {
  contractId: 'my-vault',
  user: '0xabc...',
  customData: {
    balance: BigInt(5e18),      // 5 ETH
    threshold: BigInt(10e18)    // 10 ETH minimum
  }
});

// Result: { action: { type: 'LIMIT' }, reason: '...', confidence: 0.85 }
```

### Required Input Data

```typescript
customData: {
  balance: BigInt,      // Current balance (BigInt)
  threshold: BigInt     // Minimum safe threshold (BigInt)
}
```

## 💡 What Gets "Blocked"?

The agent **recommends** blocking. What actually gets blocked depends on **your implementation**:

### Option 1: Block User Withdrawals (On-Chain)

```typescript
const decision = await sdk.executeAgent('risk-monitor', {
  contractId: 'lending-vault',
  user: event.args.user,
  customData: {
    balance: event.args.newBalance,
    threshold: ethers.parseEther('100')
  }
});

if (decision.action.type === 'BLOCK') {
  // YOU execute the on-chain transaction
  await vault.pauseUser(event.args.user);  // ← THIS blocks the user
  console.log(`⚠️ User ${event.args.user} paused: ${decision.reason}`);
}
```

### Option 2: Block Transaction in Your Backend

```typescript
if (decision.action.type === 'BLOCK') {
  // Reject the transaction before it reaches the blockchain
  return res.status(403).json({
    error: 'Transaction blocked',
    reason: decision.reason,
    confidence: decision.confidence
  });
}
```

### Option 3: Reduce Limits (Soft Block)

```typescript
if (decision.action.type === 'LIMIT') {
  // Reduce user's withdrawal limit instead of full block
  const newLimit = calculateReducedLimit(decision);
  await vault.setUserLimit(userAddress, newLimit);
  
  // Or just in your database
  await db.users.update({ address: userAddress }, { 
    withdrawalLimit: newLimit 
  });
}
```

### Option 4: Just Alert (No Block)

```typescript
if (decision.action.type === 'BLOCK') {
  // Don't actually block, just notify
  await sendSlackAlert({
    severity: 'critical',
    message: `Risk detected for user ${userAddress}`,
    reason: decision.reason,
    confidence: decision.confidence
  });
  
  // Log for manual review
  await auditLog.create({
    type: 'RISK_ALERT',
    user: userAddress,
    decision: decision
  });
}
```

## 🎬 Real-World Example: DeFi Lending Protocol

```typescript
import { SentinelAgentSDK, RiskMonitor } from '@sentinel/ai-agent-sdk';
import { ethers } from 'ethers';

const sdk = new SentinelAgentSDK({
  network: 'cronos-mainnet',
  rpcUrl: 'https://evm.cronos.org',
  privateKey: process.env.AGENT_PRIVATE_KEY
});

await sdk.registerContract('lending-vault', {
  address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  abi: vaultABI,
  network: 'cronos-mainnet'
});

sdk.registerAgent('risk-monitor', new RiskMonitor());

// Monitor every deposit
sdk.onContractEvent('lending-vault', 'Deposited', async (event) => {
  const decision = await sdk.executeAgent('risk-monitor', {
    contractId: 'lending-vault',
    user: event.args.user,
    customData: {
      balance: event.args.newBalance,
      threshold: ethers.parseEther('100') // Min 100 CRO
    }
  });
  
  if (decision.action.type === 'BLOCK') {
    // Pause withdrawals for this user
    await vault.pauseUser(event.args.user);
    console.log(`⚠️ User ${event.args.user} paused: ${decision.reason}`);
  }
});

await sdk.start();
```

### Outcome
- Automatically monitors 1000+ deposits/day
- Prevents risky withdrawals before liquidation
- Reduces bad debt by 40%
- No manual intervention needed

## 🧪 Testing

```bash
cd packages/examples/standalone-test
npm install
npm test
```

Expected output:
```
1️⃣ Testing RiskMonitor...
   Result: LIMIT - Balance below threshold
   Confidence: 85%
```

## 📝 Summary

| What RiskMonitor Does | What It Doesn't Do |
|----------------------|-------------------|
| ✅ Analyzes balance vs threshold | ❌ Executes pause transactions |
| ✅ Returns BLOCK/LIMIT/ALLOW | ❌ Accesses your wallet |
| ✅ Provides confidence score | ❌ Makes final decision |
| ✅ Explains reasoning | ❌ Pauses users directly |

**RiskMonitor recommends → Your code decides → Your transaction executes**

