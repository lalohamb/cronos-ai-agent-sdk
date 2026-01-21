# EmergencyBrake Agent

## 📋 Overview

**Purpose:** Triggers emergency stops when critical thresholds are breached

**Type:** Deterministic Agent

**Actions:** `PAUSE`, `RESUME`

## 🎯 What It Actually Does

The EmergencyBrake agent **analyzes** metrics and **recommends** emergency actions. It does NOT pause contracts or execute transactions directly.

```typescript
// Agent analyzes and returns a recommendation
async decide(context: AgentContext): Promise<AgentDecision> {
  const { metric, criticalThreshold } = context.customData;
  
  if (metric >= criticalThreshold) {
    return {
      action: { type: 'PAUSE', reason: 'Critical threshold breached', severity: 'CRITICAL' },
      reason: `Metric ${metric} exceeded critical threshold ${criticalThreshold}`,
      confidence: 1.0
    };
  }
  
  return {
    action: { type: 'RESUME', reason: 'System operating normally', severity: 'LOW' },
    reason: 'All metrics within safe range',
    confidence: 0.95
  };
  // Returns a DECISION object, not a transaction
}
```

## 📊 Decision Logic

### PAUSE (Critical Threshold Breached)
- **Trigger:** Metric >= critical threshold
- **Confidence:** 100%
- **Severity:** CRITICAL
- **Recommendation:** Pause operations immediately

### RESUME (Normal Operation)
- **Trigger:** Metric < critical threshold
- **Confidence:** 95%
- **Severity:** LOW
- **Recommendation:** Resume normal operations

## 🚀 Usage

### Basic Setup

```typescript
import { SentinelAgentSDK, EmergencyBrake } from '@sentinel/ai-agent-sdk';

const sdk = new SentinelAgentSDK({
  network: 'cronos-testnet',
  rpcUrl: 'https://evm-t3.cronos.org'
});

sdk.registerAgent('emergency-brake', new EmergencyBrake());

const decision = await sdk.executeAgent('emergency-brake', {
  contractId: 'protocol',
  user: 'system',
  customData: {
    metric: 95,              // Current metric value
    criticalThreshold: 90    // Critical threshold
  }
});

// Result: { action: { type: 'PAUSE' }, reason: '...', confidence: 1.0 }
```

### Required Input Data

```typescript
customData: {
  metric: number,              // Current metric value
  criticalThreshold: number    // Critical threshold to trigger pause
}
```

## 💡 What Gets "Paused"?

The agent **recommends** pausing. What actually gets paused depends on **your implementation**:

### Option 1: Pause Smart Contract (On-Chain)

```typescript
const decision = await sdk.executeAgent('emergency-brake', {
  contractId: 'stablecoin',
  user: 'system',
  customData: {
    metric: currentTVL,
    criticalThreshold: minTVL
  }
});

if (decision.action.type === 'PAUSE') {
  // YOU execute the pause transaction
  const tx = await stablecoin.pause();  // ← THIS pauses the contract
  await tx.wait();
  console.log('✅ Contract paused on-chain');
  
  // Notify team
  await sendPagerDutyAlert({
    severity: 'critical',
    message: decision.reason
  });
}
```

### Option 2: Pause Off-Chain Service

```typescript
if (decision.action.type === 'PAUSE') {
  // Pause your backend service
  await serviceManager.pauseService('trading-bot');
  
  // Stop processing new requests
  app.locals.paused = true;
  
  // Notify users
  await broadcastMessage({
    type: 'SERVICE_PAUSED',
    reason: decision.reason
  });
}
```

### Option 3: Pause User Actions (Frontend)

```typescript
if (decision.action.type === 'PAUSE') {
  // Update database flag
  await db.settings.update({ key: 'deposits_enabled' }, { value: false });
  
  // Frontend will check this flag and disable deposit UI
  // No on-chain transaction needed
  
  console.log('Deposits paused in UI');
}
```

### Option 4: Just Alert (No Pause)

```typescript
if (decision.action.type === 'PAUSE') {
  // Don't actually pause, just alert
  await sendPagerDutyAlert({
    severity: 'critical',
    message: decision.reason,
    confidence: decision.confidence
  });
  
  // Log for manual review
  await auditLog.create({
    type: 'EMERGENCY_ALERT',
    decision: decision,
    timestamp: Date.now()
  });
  
  // Require human approval before pausing
  await requestAdminApproval({
    action: 'PAUSE_CONTRACT',
    reason: decision.reason
  });
}
```

## 🎬 Real-World Example: Protocol Circuit Breaker

```typescript
import { SentinelAgentSDK, EmergencyBrake } from '@sentinel/ai-agent-sdk';
import { ethers } from 'ethers';

const sdk = new SentinelAgentSDK({
  network: 'cronos-mainnet',
  rpcUrl: 'https://evm.cronos.org',
  privateKey: process.env.AGENT_PRIVATE_KEY
});

await sdk.registerContract('lending-protocol', {
  address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  abi: protocolABI,
  network: 'cronos-mainnet'
});

sdk.registerAgent('emergency-brake', new EmergencyBrake());

// Monitor TVL every block
setInterval(async () => {
  const currentTVL = await protocol.getTotalValueLocked();
  const minTVL = ethers.parseEther('1000000'); // $1M minimum
  
  const decision = await sdk.executeAgent('emergency-brake', {
    contractId: 'lending-protocol',
    user: 'system',
    customData: {
      metric: Number(ethers.formatEther(currentTVL)),
      criticalThreshold: Number(ethers.formatEther(minTVL))
    }
  });
  
  if (decision.action.type === 'PAUSE') {
    // Pause the protocol
    const tx = await protocol.pause();
    await tx.wait();
    
    // Alert team
    await sendSlackAlert({
      channel: '#critical-alerts',
      message: `🚨 Protocol paused: ${decision.reason}`,
      confidence: decision.confidence
    });
    
    console.log('🚨 Emergency brake activated!');
  }
}, 12000); // Every block (~12 seconds)
```

### Outcome
- Monitors protocol health 24/7
- Automatically pauses during critical events
- Prevents cascading failures
- Protects user funds

## 🎯 Common Use Cases

### 1. TVL Drop Protection
```typescript
customData: {
  metric: currentTVL,
  criticalThreshold: minSafeTVL
}
```

### 2. Price Oracle Failure
```typescript
customData: {
  metric: timeSinceLastUpdate,
  criticalThreshold: maxStaleTime
}
```

### 3. Collateral Ratio Breach
```typescript
customData: {
  metric: currentCollateralRatio,
  criticalThreshold: minCollateralRatio
}
```

### 4. Gas Price Spike
```typescript
customData: {
  metric: currentGasPrice,
  criticalThreshold: maxAcceptableGasPrice
}
```

## 🧪 Testing

```bash
cd packages/examples/standalone-test
npm install
npm test
```

Expected output:
```
3️⃣ Testing EmergencyBrake...
   Result: PAUSE - Critical threshold breached
   Confidence: 100%
```

## 📝 Summary

| What EmergencyBrake Does | What It Doesn't Do |
|-------------------------|-------------------|
| ✅ Analyzes metrics vs thresholds | ❌ Executes pause transactions |
| ✅ Returns PAUSE/RESUME | ❌ Accesses your wallet |
| ✅ Provides 100% confidence on critical | ❌ Makes final decision |
| ✅ Explains breach reason | ❌ Pauses contracts directly |

**EmergencyBrake recommends → Your code decides → Your transaction executes**

