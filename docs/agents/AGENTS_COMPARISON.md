# Built-in Agents - Comparison Guide

## 📊 Quick Reference Table

| Agent | Type | Actions | Confidence | Use Case |
|-------|------|---------|-----------|----------|
| **RiskMonitor** | Deterministic | ALLOW, LIMIT, BLOCK | 85-95% | Collateral monitoring, vault protection |
| **LiquidityOptimizer** | Deterministic | ADD, REMOVE, HOLD | 80-85% | DEX pools, AMM rebalancing |
| **EmergencyBrake** | Deterministic | PAUSE, RESUME | 95-100% | Circuit breakers, emergency stops |
| **ThresholdGuard** | Deterministic | APPROVE, REJECT | 90-100% | Transaction limits, min/max enforcement |
| **AnomalyDetector** | Statistical | NORMAL, ANOMALY_DETECTED | 70-95% | Fraud detection, pattern analysis |

## 🎯 When to Use Which Agent

### RiskMonitor
**Use when:**
- Monitoring collateral ratios
- Protecting lending protocols
- Preventing under-collateralized positions
- Managing vault health

**Input:** Balance vs. threshold
**Output:** BLOCK (< 25%), LIMIT (< 100%), ALLOW (>= 100%)

**Example:**
```typescript
customData: {
  balance: BigInt(5e18),      // 5 ETH
  threshold: BigInt(10e18)    // 10 ETH minimum
}
// → LIMIT (50% of threshold)
```

---

### LiquidityOptimizer
**Use when:**
- Managing DEX pool liquidity
- Optimizing AMM ratios
- Rebalancing based on price changes
- Maintaining target utilization

**Input:** Current liquidity vs. target ratio
**Output:** ADD (below target), REMOVE (above target), HOLD (within range)

**Example:**
```typescript
customData: {
  currentPrice: BigInt(100e18),
  liquidity: BigInt(1000e18),
  targetRatio: 0.8  // 80% target
}
// → REMOVE (excess liquidity)
```

---

### EmergencyBrake
**Use when:**
- Implementing circuit breakers
- Monitoring critical metrics (TVL, price, etc.)
- Protecting against cascading failures
- Emergency protocol stops

**Input:** Metric vs. critical threshold
**Output:** PAUSE (breached), RESUME (normal)

**Example:**
```typescript
customData: {
  metric: 95,              // Current TVL drop %
  criticalThreshold: 90    // 90% drop is critical
}
// → PAUSE (critical threshold breached)
```

---

### ThresholdGuard
**Use when:**
- Enforcing min/max transaction sizes
- Implementing daily limits
- Preventing dust transactions
- Capping large withdrawals

**Input:** Value vs. min/max thresholds
**Output:** REJECT (< min), APPROVE (within range), APPROVE with cap (> max)

**Example:**
```typescript
customData: {
  value: BigInt(150e18),        // 150 ETH
  minThreshold: BigInt(1e18),   // 1 ETH min
  maxThreshold: BigInt(100e18)  // 100 ETH max
}
// → APPROVE with value: 100e18 (capped)
```

---

### AnomalyDetector
**Use when:**
- Detecting fraud (wash trading, etc.)
- Monitoring unusual patterns
- DDoS protection
- Price oracle validation
- Gaming anti-cheat

**Input:** Current value vs. historical average + std dev
**Output:** NORMAL or ANOMALY_DETECTED (LOW/MEDIUM/HIGH)

**Example:**
```typescript
customData: {
  currentValue: 100,           // Current price
  historicalAverage: 50,       // Avg price
  standardDeviation: 10        // Std dev
}
// → ANOMALY_DETECTED (HIGH) - 5 std deviations
```

## 🔄 Combining Multiple Agents

### Example: Comprehensive Vault Protection

```typescript
// 1. Check thresholds first
const thresholdCheck = await sdk.executeAgent('threshold-guard', {
  contractId: 'vault',
  user: userAddress,
  customData: {
    value: withdrawalAmount,
    minThreshold: MIN_WITHDRAWAL,
    maxThreshold: MAX_WITHDRAWAL
  }
});

if (thresholdCheck.action.type === 'REJECT') {
  return { error: 'Amount out of range' };
}

// 2. Check risk level
const riskCheck = await sdk.executeAgent('risk-monitor', {
  contractId: 'vault',
  user: userAddress,
  customData: {
    balance: userBalance,
    threshold: MIN_SAFE_BALANCE
  }
});

if (riskCheck.action.type === 'BLOCK') {
  return { error: 'Insufficient collateral' };
}

// 3. Check for anomalies
const anomalyCheck = await sdk.executeAgent('anomaly-detector', {
  contractId: 'vault',
  user: userAddress,
  customData: {
    currentValue: withdrawalAmount,
    historicalAverage: avgWithdrawal,
    standardDeviation: withdrawalStdDev
  }
});

if (anomalyCheck.action.type === 'ANOMALY_DETECTED' && 
    anomalyCheck.action.severity === 'HIGH') {
  // Flag for manual review
  await flagForReview(userAddress, withdrawalAmount);
}

// All checks passed - execute withdrawal
await vault.withdraw(withdrawalAmount);
```

## 📈 Confidence Levels Explained

### 100% Confidence
- **Agents:** ThresholdGuard (exact checks), EmergencyBrake (critical)
- **Meaning:** Deterministic rule-based decision
- **Action:** Safe to auto-execute

### 90-95% Confidence
- **Agents:** RiskMonitor, AnomalyDetector (high severity)
- **Meaning:** Very high confidence in recommendation
- **Action:** Auto-execute with logging

### 80-85% Confidence
- **Agents:** LiquidityOptimizer, AnomalyDetector (medium severity)
- **Meaning:** Good confidence, some uncertainty
- **Action:** Consider human approval for large amounts

### 70% Confidence
- **Agents:** AnomalyDetector (low severity)
- **Meaning:** Possible anomaly, needs investigation
- **Action:** Flag for review, don't auto-execute

## 🎭 Agent Personalities

### RiskMonitor: The Conservative Guardian
- **Motto:** "Better safe than sorry"
- **Approach:** Proactive risk prevention
- **Best for:** Financial protocols, lending platforms

### LiquidityOptimizer: The Efficiency Expert
- **Motto:** "Maximize returns, minimize waste"
- **Approach:** Data-driven optimization
- **Best for:** DEXs, AMMs, liquidity pools

### EmergencyBrake: The Circuit Breaker
- **Motto:** "Stop everything when things go wrong"
- **Approach:** Binary critical decisions
- **Best for:** Protocol-wide safety mechanisms

### ThresholdGuard: The Bouncer
- **Motto:** "You must be this tall to ride"
- **Approach:** Strict rule enforcement
- **Best for:** Transaction validation, limit enforcement

### AnomalyDetector: The Detective
- **Motto:** "Something doesn't add up here"
- **Approach:** Statistical pattern analysis
- **Best for:** Fraud detection, security monitoring

## 🚦 Decision Flow Comparison

```
RiskMonitor:
Balance → Compare to threshold → BLOCK/LIMIT/ALLOW

LiquidityOptimizer:
Liquidity → Compare to target → ADD/REMOVE/HOLD

EmergencyBrake:
Metric → Compare to critical → PAUSE/RESUME

ThresholdGuard:
Value → Compare to min/max → APPROVE/REJECT

AnomalyDetector:
Value → Calculate Z-score → NORMAL/ANOMALY_DETECTED
```

## 💡 Best Practices

### 1. Layer Your Defenses
Use multiple agents for comprehensive protection:
- ThresholdGuard for basic validation
- RiskMonitor for risk assessment
- AnomalyDetector for fraud detection
- EmergencyBrake as last resort

### 2. Adjust Confidence Thresholds
```typescript
if (decision.confidence > 0.95) {
  // Auto-execute
} else if (decision.confidence > 0.8) {
  // Execute with notification
} else {
  // Require human approval
}
```

### 3. Log All Decisions
```typescript
await auditLog.create({
  agent: 'risk-monitor',
  decision: decision,
  executed: true,
  timestamp: Date.now()
});
```

### 4. Test in Staging First
```typescript
if (process.env.NODE_ENV === 'production') {
  await executeAction(decision);
} else {
  console.log('Would execute:', decision);
}
```

## 📚 Further Reading

- [RiskMonitor Documentation](./RISK_MONITOR.md)
- [LiquidityOptimizer Documentation](./LIQUIDITY_OPTIMIZER.md)
- [EmergencyBrake Documentation](./EMERGENCY_BRAKE.md)
- [ThresholdGuard Documentation](./THRESHOLD_GUARD.md)
- [AnomalyDetector Documentation](./ANOMALY_DETECTOR.md)
- [Agents Overview](./AGENTS_OVERVIEW.md)

