# Agent Implementation Patterns

This guide shows common patterns for implementing agent decisions in your application.

## 🎯 The Four Implementation Strategies

### 1. Direct Execution (On-Chain)
**When to use:** High confidence decisions, production systems, automated protocols

```typescript
const decision = await sdk.executeAgent('emergency-brake', context);

if (decision.action.type === 'PAUSE') {
  // Execute on-chain transaction immediately
  const tx = await contract.pause();
  await tx.wait();
  console.log('✅ Contract paused on-chain');
}
```

**Pros:**
- ✅ Fully automated
- ✅ Fast response time
- ✅ No human intervention needed

**Cons:**
- ⚠️ Requires high confidence in agent
- ⚠️ Gas costs for every decision
- ⚠️ Irreversible actions

---

### 2. Human-in-the-Loop
**When to use:** Low confidence decisions, high-value operations, compliance requirements

```typescript
const decision = await sdk.executeAgent('risk-monitor', context);

if (decision.action.type === 'BLOCK') {
  // Queue for human approval
  await approvalQueue.add({
    agent: 'risk-monitor',
    decision: decision,
    context: context,
    status: 'PENDING_APPROVAL',
    createdAt: Date.now()
  });
  
  // Notify admin
  await sendSlackNotification({
    channel: '#approvals',
    message: `Agent recommends blocking user ${context.user}`,
    reason: decision.reason,
    confidence: decision.confidence,
    approveUrl: `https://admin.example.com/approve/${approvalId}`
  });
}
```

**Pros:**
- ✅ Human oversight
- ✅ Compliance-friendly
- ✅ Can override bad decisions

**Cons:**
- ⚠️ Slower response time
- ⚠️ Requires admin availability
- ⚠️ Not fully automated

---

### 3. Confidence-Based Execution
**When to use:** Mixed scenarios, gradual automation rollout

```typescript
const decision = await sdk.executeAgent('liquidity-optimizer', context);

if (decision.action.type === 'REMOVE') {
  if (decision.confidence > 0.95) {
    // High confidence - auto-execute
    await pool.removeLiquidity(decision.action.value);
    console.log('✅ Auto-executed (high confidence)');
    
  } else if (decision.confidence > 0.8) {
    // Medium confidence - execute with notification
    await pool.removeLiquidity(decision.action.value);
    await notifyTeam({
      message: `Executed with ${decision.confidence} confidence`,
      action: decision
    });
    
  } else {
    // Low confidence - require approval
    await requestApproval(decision);
    console.log('⏳ Queued for approval (low confidence)');
  }
}
```

**Pros:**
- ✅ Balanced approach
- ✅ Automated for clear cases
- ✅ Human review for edge cases

**Cons:**
- ⚠️ More complex logic
- ⚠️ Need to tune confidence thresholds

---

### 4. Simulation First
**When to use:** High-risk operations, testing new agents, financial protocols

```typescript
const decision = await sdk.executeAgent('threshold-guard', context);

if (decision.action.type === 'APPROVE') {
  // Simulate the transaction first
  const simulation = await contract.callStatic.withdraw(amount);
  
  // Check simulation results
  if (simulation.success && simulation.gasUsed < MAX_GAS) {
    // Simulation passed - execute for real
    const tx = await contract.withdraw(amount);
    await tx.wait();
    console.log('✅ Transaction executed after successful simulation');
  } else {
    // Simulation failed - don't execute
    console.log('❌ Simulation failed, transaction aborted');
    await logFailure({
      reason: 'Simulation failed',
      simulation: simulation
    });
  }
}
```

**Pros:**
- ✅ Prevents failed transactions
- ✅ Saves gas on failures
- ✅ Extra safety layer

**Cons:**
- ⚠️ Slower (two calls)
- ⚠️ State might change between simulation and execution

---

## 🔄 Multi-Agent Patterns

### Pattern 1: Sequential Validation (AND Logic)

```typescript
// All agents must approve
async function validateWithdrawal(userAddress, amount) {
  // Step 1: Check thresholds
  const thresholdCheck = await sdk.executeAgent('threshold-guard', {
    contractId: 'vault',
    user: userAddress,
    customData: { value: amount, minThreshold: MIN, maxThreshold: MAX }
  });
  
  if (thresholdCheck.action.type === 'REJECT') {
    return { approved: false, reason: 'Amount out of range' };
  }
  
  // Step 2: Check risk
  const riskCheck = await sdk.executeAgent('risk-monitor', {
    contractId: 'vault',
    user: userAddress,
    customData: { balance: userBalance, threshold: MIN_BALANCE }
  });
  
  if (riskCheck.action.type === 'BLOCK') {
    return { approved: false, reason: 'Insufficient collateral' };
  }
  
  // Step 3: Check for anomalies
  const anomalyCheck = await sdk.executeAgent('anomaly-detector', {
    contractId: 'vault',
    user: userAddress,
    customData: { currentValue: amount, historicalAverage: avgAmount, standardDeviation: stdDev }
  });
  
  if (anomalyCheck.action.type === 'ANOMALY_DETECTED' && anomalyCheck.action.severity === 'HIGH') {
    return { approved: false, reason: 'Suspicious activity detected' };
  }
  
  // All checks passed
  return { approved: true };
}
```

### Pattern 2: Parallel Validation (Voting)

```typescript
// Majority vote from multiple agents
async function validateWithVoting(context) {
  // Run all agents in parallel
  const [risk, threshold, anomaly] = await Promise.all([
    sdk.executeAgent('risk-monitor', context),
    sdk.executeAgent('threshold-guard', context),
    sdk.executeAgent('anomaly-detector', context)
  ]);
  
  // Count approvals
  let approvals = 0;
  let rejections = 0;
  
  if (risk.action.type === 'ALLOW') approvals++;
  if (risk.action.type === 'BLOCK') rejections++;
  
  if (threshold.action.type === 'APPROVE') approvals++;
  if (threshold.action.type === 'REJECT') rejections++;
  
  if (anomaly.action.type === 'NORMAL') approvals++;
  if (anomaly.action.type === 'ANOMALY_DETECTED') rejections++;
  
  // Majority wins
  return {
    approved: approvals > rejections,
    votes: { approvals, rejections },
    decisions: { risk, threshold, anomaly }
  };
}
```

### Pattern 3: Weighted Decision

```typescript
// Weight decisions by confidence
async function weightedDecision(context) {
  const decisions = await Promise.all([
    sdk.executeAgent('risk-monitor', context),
    sdk.executeAgent('threshold-guard', context),
    sdk.executeAgent('anomaly-detector', context)
  ]);
  
  // Calculate weighted score
  let totalWeight = 0;
  let approvalWeight = 0;
  
  for (const decision of decisions) {
    totalWeight += decision.confidence;
    
    if (isApproval(decision)) {
      approvalWeight += decision.confidence;
    }
  }
  
  const approvalScore = approvalWeight / totalWeight;
  
  return {
    approved: approvalScore > 0.7, // 70% threshold
    score: approvalScore,
    decisions: decisions
  };
}

function isApproval(decision) {
  return decision.action.type === 'ALLOW' || 
         decision.action.type === 'APPROVE' || 
         decision.action.type === 'NORMAL';
}
```

---

## 🎬 Real-World Implementation Examples

### Example 1: DeFi Vault with Multi-Layer Protection

```typescript
class SecureVault {
  constructor(sdk, contract) {
    this.sdk = sdk;
    this.contract = contract;
  }
  
  async withdraw(userAddress, amount) {
    // Layer 1: Threshold check
    const thresholdResult = await this.checkThresholds(userAddress, amount);
    if (!thresholdResult.approved) {
      throw new Error(thresholdResult.reason);
    }
    
    // Layer 2: Risk assessment
    const riskResult = await this.assessRisk(userAddress, amount);
    if (!riskResult.approved) {
      throw new Error(riskResult.reason);
    }
    
    // Layer 3: Anomaly detection
    const anomalyResult = await this.detectAnomalies(userAddress, amount);
    if (anomalyResult.severity === 'HIGH') {
      // Flag for manual review
      await this.flagForReview(userAddress, amount, anomalyResult);
      throw new Error('Transaction flagged for review');
    }
    
    // All checks passed - execute withdrawal
    const tx = await this.contract.withdraw(amount);
    await tx.wait();
    
    // Log successful withdrawal
    await this.logWithdrawal(userAddress, amount, tx.hash);
    
    return { success: true, txHash: tx.hash };
  }
  
  async checkThresholds(userAddress, amount) {
    const decision = await this.sdk.executeAgent('threshold-guard', {
      contractId: 'vault',
      user: userAddress,
      customData: {
        value: amount,
        minThreshold: ethers.parseEther('0.1'),
        maxThreshold: ethers.parseEther('1000')
      }
    });
    
    return {
      approved: decision.action.type === 'APPROVE',
      reason: decision.reason,
      cappedAmount: decision.action.value
    };
  }
  
  // ... other methods
}
```

---

## 📝 Best Practices Summary

1. **Start Conservative:** Begin with human-in-the-loop, gradually move to automation
2. **Log Everything:** Audit trail is critical for debugging and compliance
3. **Test in Staging:** Never deploy untested agent logic to production
4. **Monitor Confidence:** Track agent confidence over time to tune thresholds
5. **Have Fallbacks:** Always have a manual override mechanism
6. **Combine Agents:** Use multiple agents for comprehensive protection
7. **Simulate First:** For high-value operations, always simulate before executing

## 🔗 Related Documentation

- [Agents Overview](./AGENTS_OVERVIEW.md)
- [Agents Comparison](./AGENTS_COMPARISON.md)
- [Individual Agent Guides](./README.md)

