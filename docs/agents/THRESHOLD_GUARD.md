# ThresholdGuard Agent

## 📋 Overview

**Purpose:** Enforces minimum and maximum limits on operations

**Type:** Deterministic Agent

**Actions:** `APPROVE`, `REJECT`

## 🎯 What It Actually Does

The ThresholdGuard agent **analyzes** values against thresholds and **recommends** approval or rejection. It does NOT execute or block transactions directly.

```typescript
// Agent analyzes and returns a recommendation
async decide(context: AgentContext): Promise<AgentDecision> {
  const valueBN = BigInt(value.toString());
  const minBN = BigInt(minThreshold.toString());
  const maxBN = BigInt(maxThreshold.toString());

  if (valueBN < minBN) {
    return {
      action: { type: 'REJECT', reason: 'Below minimum threshold', severity: 'HIGH' },
      reason: `Value ${valueBN} below minimum threshold ${minBN}`,
      confidence: 1.0
    };
  }

  if (valueBN > maxBN) {
    return {
      action: { type: 'APPROVE', value: maxBN.toString(), reason: 'Capped at maximum' },
      reason: `Value capped at maximum threshold ${maxBN}`,
      confidence: 0.9
    };
  }
  // Returns APPROVE/REJECT recommendation
}
```

## 📊 Decision Logic

### REJECT (Below Minimum)
- **Trigger:** Value < minimum threshold
- **Confidence:** 100%
- **Severity:** HIGH
- **Recommendation:** Reject the operation

### APPROVE with Cap (Above Maximum)
- **Trigger:** Value > maximum threshold
- **Confidence:** 90%
- **Severity:** MEDIUM
- **Returns:** Capped value (at maximum)
- **Recommendation:** Approve with reduced value

### APPROVE (Within Range)
- **Trigger:** Min <= Value <= Max
- **Confidence:** 100%
- **Severity:** LOW
- **Recommendation:** Approve at requested value

## 🚀 Usage

### Basic Setup

```typescript
import { SentinelAgentSDK, ThresholdGuard } from '@sentinel/ai-agent-sdk';

const sdk = new SentinelAgentSDK({
  network: 'cronos-testnet',
  rpcUrl: 'https://evm-t3.cronos.org'
});

sdk.registerAgent('threshold-guard', new ThresholdGuard());

const decision = await sdk.executeAgent('threshold-guard', {
  contractId: 'vault',
  user: '0x789...',
  customData: {
    value: BigInt(50e18),           // 50 ETH
    minThreshold: BigInt(1e18),     // 1 ETH minimum
    maxThreshold: BigInt(100e18)    // 100 ETH maximum
  }
});

// Result: { action: { type: 'APPROVE' }, confidence: 1.0 }
```

### Required Input Data

```typescript
customData: {
  value: BigInt,           // Value to check (BigInt)
  minThreshold: BigInt,    // Minimum allowed value (BigInt)
  maxThreshold: BigInt     // Maximum allowed value (BigInt)
}
```

## 💡 What Gets "Approved" or "Rejected"?

The agent **recommends** approving/rejecting. What actually happens depends on **your implementation**:

### Option 1: Enforce in Smart Contract

```typescript
const decision = await sdk.executeAgent('threshold-guard', {
  contractId: 'payment-system',
  user: userAddress,
  customData: {
    value: withdrawalAmount,
    minThreshold: ethers.parseEther('1'),
    maxThreshold: ethers.parseEther('100')
  }
});

if (decision.action.type === 'REJECT') {
  // Don't submit the transaction at all
  throw new Error(`Transaction rejected: ${decision.reason}`);
  
} else if (decision.action.type === 'APPROVE' && decision.action.value) {
  // Use the capped value instead of original
  const cappedAmount = decision.action.value;
  await contract.withdraw(cappedAmount);  // ← THIS executes with capped value
  console.log(`Withdrawal capped at ${cappedAmount}`);
  
} else {
  // Approved at original value
  await contract.withdraw(withdrawalAmount);
}
```

### Option 2: Enforce in API Layer

```typescript
app.post('/api/withdraw', async (req, res) => {
  const { amount, userAddress } = req.body;
  
  const decision = await sdk.executeAgent('threshold-guard', {
    contractId: 'vault',
    user: userAddress,
    customData: {
      value: amount,
      minThreshold: MIN_WITHDRAWAL,
      maxThreshold: MAX_WITHDRAWAL
    }
  });
  
  if (decision.action.type === 'REJECT') {
    // Reject at API level
    return res.status(400).json({
      error: 'Withdrawal rejected',
      reason: decision.reason
    });
  }
  
  // Process withdrawal
  const finalAmount = decision.action.value || amount;
  await processWithdrawal(userAddress, finalAmount);
  res.json({ success: true, amount: finalAmount });
});
```

### Option 3: Daily Limit Enforcement

```typescript
// Check daily withdrawal limit
const todayTotal = await getUserDailyWithdrawals(userAddress);
const requestedAmount = ethers.parseEther('50');

const decision = await sdk.executeAgent('threshold-guard', {
  contractId: 'vault',
  user: userAddress,
  customData: {
    value: todayTotal + requestedAmount,
    minThreshold: 0,
    maxThreshold: DAILY_LIMIT  // e.g., 100 ETH/day
  }
});

if (decision.action.type === 'REJECT') {
  return res.status(429).json({
    error: 'Daily limit exceeded',
    limit: DAILY_LIMIT,
    used: todayTotal,
    reason: decision.reason
  });
}
```

### Option 4: Dynamic Fee Adjustment

```typescript
if (decision.action.type === 'APPROVE' && decision.action.value) {
  // Transaction was capped - charge higher fee
  const fee = calculateDynamicFee(decision.action.value, originalAmount);
  await contract.withdrawWithFee(decision.action.value, fee);
} else {
  // Normal fee
  await contract.withdraw(amount);
}
```

## 🎬 Real-World Example: Withdrawal Limits

```typescript
import { SentinelAgentSDK, ThresholdGuard } from '@sentinel/ai-agent-sdk';
import { ethers } from 'ethers';

const sdk = new SentinelAgentSDK({
  network: 'cronos-mainnet',
  rpcUrl: 'https://evm.cronos.org',
  privateKey: process.env.AGENT_PRIVATE_KEY
});

await sdk.registerContract('vault', {
  address: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
  abi: vaultABI,
  network: 'cronos-mainnet'
});

sdk.registerAgent('threshold-guard', new ThresholdGuard());

// API endpoint for withdrawals
app.post('/api/withdraw', async (req, res) => {
  const { amount, userAddress } = req.body;
  
  const decision = await sdk.executeAgent('threshold-guard', {
    contractId: 'vault',
    user: userAddress,
    customData: {
      value: ethers.parseEther(amount),
      minThreshold: ethers.parseEther('0.1'),   // Min 0.1 CRO
      maxThreshold: ethers.parseEther('1000')   // Max 1000 CRO
    }
  });
  
  if (decision.action.type === 'REJECT') {
    return res.status(400).json({
      error: 'Withdrawal amount too low',
      minimum: '0.1 CRO',
      reason: decision.reason
    });
  }
  
  const finalAmount = decision.action.value 
    ? ethers.formatEther(decision.action.value)
    : amount;
  
  // Execute withdrawal
  const tx = await vault.withdraw(ethers.parseEther(finalAmount));
  await tx.wait();
  
  res.json({
    success: true,
    amount: finalAmount,
    capped: !!decision.action.value,
    txHash: tx.hash
  });
});
```

### Outcome
- Enforces min/max limits automatically
- Prevents dust transactions
- Caps large withdrawals
- Improves UX with clear error messages

## 🧪 Testing

```bash
cd packages/examples/standalone-test
npm install
npm test
```

Expected output:
```
4️⃣ Testing ThresholdGuard...
   Result: REJECT - Below minimum threshold
   Confidence: 100%
```

## 📝 Summary

| What ThresholdGuard Does | What It Doesn't Do |
|-------------------------|-------------------|
| ✅ Checks value vs min/max | ❌ Executes transactions |
| ✅ Returns APPROVE/REJECT | ❌ Accesses your wallet |
| ✅ Suggests capped values | ❌ Makes final decision |
| ✅ Provides 100% confidence | ❌ Blocks transactions directly |

**ThresholdGuard recommends → Your code decides → Your transaction executes**

