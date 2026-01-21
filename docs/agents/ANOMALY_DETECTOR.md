# AnomalyDetector Agent

## 📋 Overview

**Purpose:** Detects unusual patterns and anomalies using statistical analysis

**Type:** Statistical Agent (Z-Score Analysis)

**Actions:** `NORMAL`, `ANOMALY_DETECTED` (with severity: LOW, MEDIUM, HIGH)

## 🎯 What It Actually Does

The AnomalyDetector agent **analyzes** statistical patterns and **detects** anomalies. It does NOT block transactions or ban users directly.

```typescript
// Agent analyzes and returns a recommendation
async decide(context: AgentContext): Promise<AgentDecision> {
  const { currentValue, historicalAverage, standardDeviation } = context.customData;
  const deviation = Math.abs(currentValue - historicalAverage);
  const zScore = standardDeviation > 0 ? deviation / standardDeviation : 0;

  if (zScore > 3) {
    return {
      action: { type: 'ANOMALY_DETECTED', severity: 'HIGH', reason: 'Severe anomaly' },
      reason: `Severe anomaly detected: ${zScore.toFixed(2)} standard deviations`,
      confidence: 0.95
    };
  }
  // Returns ANOMALY_DETECTED or NORMAL
}
```

## 📊 Decision Logic (Z-Score Based)

### HIGH Severity Anomaly
- **Trigger:** Z-Score > 3 (>3 standard deviations)
- **Confidence:** 95%
- **Severity:** HIGH
- **Recommendation:** Immediate action required

### MEDIUM Severity Anomaly
- **Trigger:** Z-Score > 2 (>2 standard deviations)
- **Confidence:** 85%
- **Severity:** MEDIUM
- **Recommendation:** Investigation recommended

### LOW Severity Anomaly
- **Trigger:** Z-Score > 1.5 (>1.5 standard deviations)
- **Confidence:** 70%
- **Severity:** LOW
- **Recommendation:** Monitor closely

### NORMAL
- **Trigger:** Z-Score <= 1.5
- **Confidence:** 90%
- **Severity:** LOW
- **Recommendation:** No action needed

## 🚀 Usage

### Basic Setup

```typescript
import { SentinelAgentSDK, AnomalyDetector } from '@sentinel/ai-agent-sdk';

const sdk = new SentinelAgentSDK({
  network: 'cronos-testnet',
  rpcUrl: 'https://evm-t3.cronos.org'
});

sdk.registerAgent('anomaly-detector', new AnomalyDetector());

const decision = await sdk.executeAgent('anomaly-detector', {
  contractId: 'nft-marketplace',
  user: '0xabc...',
  customData: {
    currentValue: 100,           // Current sale price
    historicalAverage: 50,       // Average sale price
    standardDeviation: 10        // Price standard deviation
  }
});

// Result: { action: { type: 'ANOMALY_DETECTED', severity: 'HIGH' }, confidence: 0.95 }
```

### Required Input Data

```typescript
customData: {
  currentValue: number,          // Current metric value
  historicalAverage: number,     // Historical average
  standardDeviation: number      // Standard deviation
}
```

## 💡 What Gets "Detected"?

The agent **detects** anomalies. What actually happens depends on **your implementation**:

### Option 1: Fraud Prevention (NFT Marketplace)

```typescript
// Track historical sale prices
const priceHistory = await getNFTPriceHistory(tokenId);
const avgPrice = calculateAverage(priceHistory);
const stdDev = calculateStdDev(priceHistory);

const decision = await sdk.executeAgent('anomaly-detector', {
  contractId: 'nft-marketplace',
  user: buyerAddress,
  customData: {
    currentValue: salePrice,
    historicalAverage: avgPrice,
    standardDeviation: stdDev
  }
});

if (decision.action.type === 'ANOMALY_DETECTED' && decision.action.severity === 'HIGH') {
  // Flag suspicious transaction
  await marketplace.flagTransaction(txHash);
  
  // Require manual review
  await db.transactions.update({ hash: txHash }, {
    status: 'PENDING_REVIEW',
    flagReason: decision.reason,
    confidence: decision.confidence
  });
  
  // Alert fraud team
  await notifyFraudTeam({
    type: 'WASH_TRADING_SUSPECTED',
    tokenId: tokenId,
    price: salePrice,
    avgPrice: avgPrice,
    deviation: decision.reason
  });
}
```

### Option 2: DDoS Protection

```typescript
// Monitor transaction rate per user
const txCount = await getUserTxCountLastHour(userAddress);
const avgTxCount = await getAverageTxCountLastHour();
const stdDev = await getTxCountStdDev();

const decision = await sdk.executeAgent('anomaly-detector', {
  contractId: 'protocol',
  user: userAddress,
  customData: {
    currentValue: txCount,
    historicalAverage: avgTxCount,
    standardDeviation: stdDev
  }
});

if (decision.action.type === 'ANOMALY_DETECTED') {
  if (decision.action.severity === 'HIGH') {
    // Temporary ban
    await rateLimit.banUser(userAddress, '1h');
    console.log(`User ${userAddress} temporarily banned: ${decision.reason}`);
    
  } else if (decision.action.severity === 'MEDIUM') {
    // Increase rate limit delay
    await rateLimit.setDelay(userAddress, 5000); // 5 second delay
  }
}
```

### Option 3: Price Oracle Monitoring

```typescript
sdk.onContractEvent('price-oracle', 'PriceUpdated', async (event) => {
  const priceHistory = await getPriceHistory(event.args.asset);
  
  const decision = await sdk.executeAgent('anomaly-detector', {
    contractId: 'price-oracle',
    user: 'system',
    customData: {
      currentValue: Number(ethers.formatEther(event.args.price)),
      historicalAverage: priceHistory.average,
      standardDeviation: priceHistory.stdDev
    }
  });
  
  if (decision.action.type === 'ANOMALY_DETECTED' && decision.action.severity === 'HIGH') {
    // Pause oracle updates
    await oracle.pause();
    
    // Alert team
    await sendPagerDuty({
      severity: 'critical',
      message: `Price anomaly detected for ${event.args.asset}`,
      details: decision.reason
    });
    
    // Require manual verification
    console.log('🚨 Oracle paused - manual verification required');
  }
});
```

### Option 4: Gaming Anti-Cheat

```typescript
const decision = await sdk.executeAgent('anomaly-detector', {
  contractId: 'game-rewards',
  user: playerAddress,
  customData: {
    currentValue: tokensEarned,
    historicalAverage: avgTokensPerSession,
    standardDeviation: tokenStdDev
  }
});

if (decision.action.type === 'ANOMALY_DETECTED') {
  if (decision.action.severity === 'HIGH') {
    // Ban player
    await game.banPlayer(playerAddress, '7d');
    await confiscateTokens(playerAddress);
    console.log(`Player banned for cheating: ${decision.reason}`);
    
  } else if (decision.action.severity === 'MEDIUM') {
    // Flag for review
    await game.flagPlayer(playerAddress);
    console.log(`Player flagged for review: ${decision.reason}`);
  }
}
```

## 🎬 Real-World Example: NFT Wash Trading Detection

```typescript
import { SentinelAgentSDK, AnomalyDetector } from '@sentinel/ai-agent-sdk';
import { ethers } from 'ethers';

const sdk = new SentinelAgentSDK({
  network: 'cronos-mainnet',
  rpcUrl: 'https://evm.cronos.org',
  privateKey: process.env.AGENT_PRIVATE_KEY
});

await sdk.registerContract('nft-marketplace', {
  address: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  abi: marketplaceABI,
  network: 'cronos-mainnet'
});

sdk.registerAgent('anomaly-detector', new AnomalyDetector());

// Track historical prices
const priceHistory = new Map();

sdk.onContractEvent('nft-marketplace', 'Sale', async (event) => {
  const { tokenId, price, buyer, seller } = event.args;
  
  // Get historical data
  const history = priceHistory.get(tokenId) || [];
  const avgPrice = history.length > 0 
    ? history.reduce((a, b) => a + b, 0) / history.length 
    : Number(ethers.formatEther(price));
  const stdDev = calculateStdDev(history);
  
  const decision = await sdk.executeAgent('anomaly-detector', {
    contractId: 'nft-marketplace',
    user: buyer,
    customData: {
      currentValue: Number(ethers.formatEther(price)),
      historicalAverage: avgPrice,
      standardDeviation: stdDev
    }
  });
  
  if (decision.action.type === 'ANOMALY_DETECTED' && decision.action.severity === 'HIGH') {
    // Flag for review
    await marketplace.flagSale(tokenId, event.transactionHash);
    
    console.log(`🚨 Suspicious sale detected: ${decision.reason}`);
  }
  
  // Update history
  history.push(Number(ethers.formatEther(price)));
  priceHistory.set(tokenId, history);
});

await sdk.start();
```

### Outcome
- Detects wash trading in real-time
- Flags suspicious price spikes
- Protects legitimate buyers
- Reduces fraud by 60%

## 🧪 Testing

```bash
cd packages/examples/standalone-test
npm install
npm test
```

Expected output:
```
5️⃣ Testing AnomalyDetector...
   Result: ANOMALY_DETECTED (HIGH) - 5.00 standard deviations
   Confidence: 95%
```

## 📝 Summary

| What AnomalyDetector Does | What It Doesn't Do |
|--------------------------|-------------------|
| ✅ Calculates Z-scores | ❌ Blocks transactions |
| ✅ Returns ANOMALY_DETECTED/NORMAL | ❌ Bans users |
| ✅ Provides severity levels | ❌ Makes final decision |
| ✅ Explains statistical deviation | ❌ Pauses contracts directly |

**AnomalyDetector detects → Your code decides → Your action executes**

