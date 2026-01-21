# Real Agent UI Demo

## ✅ **ACTUALLY EXECUTES REAL AGENTS**

Unlike the mock UI demo, this interface **directly calls the actual agent logic** from the 5 built-in agents.

## 🎯 **What This Demo Does:**

### **Real Agent Execution:**
- **RiskMonitor**: Analyzes balance, threshold, and risk score
- **LiquidityOptimizer**: Calculates liquidity rebalancing for DEX pools  
- **EmergencyBrake**: Triggers emergency stops based on risk levels
- **ThresholdGuard**: Enforces value limits on operations
- **AnomalyDetector**: Detects unusual patterns with confidence scoring

### **Live Data Processing:**
Each agent receives **real data** and returns **actual decisions**:

```typescript
// LiquidityOptimizer with real DEX data
{
  currentPrice: "1800000000000000000", // 1800 ETH in wei
  liquidity: "500000000000000000000",  // 500 ETH current liquidity
  targetRatio: 0.8                     // 80% target ratio
}

// Returns real decision:
{
  action: { type: 'REMOVE', value: '100000000000000000000' },
  reason: 'Remove 100000000000000000000 excess liquidity',
  confidence: 0.85
}
```

## 🚀 **Usage:**

```bash
cd packages/examplebuildingui
npm install
npm run dev
```

Visit http://localhost:3002

## 🔍 **Key Differences from Mock UI:**

| Feature | Mock UI Demo | **Real Agent UI** |
|---------|-------------|------------------|
| Agent Execution | ❌ Simulated | ✅ **Real Logic** |
| Data Processing | ❌ Fake Results | ✅ **Actual Calculations** |
| Decision Logic | ❌ Static Responses | ✅ **Dynamic Decisions** |
| Agent Algorithms | ❌ Not Used | ✅ **Full Implementation** |

## 📊 **Test Each Agent:**

1. **Select Agent** from dropdown
2. **Click "Execute Real Agent"**  
3. **View Input Data** - See what data the agent received
4. **View Decision** - See the agent's actual decision logic

## 🎯 **Real Agent Behaviors:**

- **RiskMonitor**: Blocks transactions when risk > 85%
- **LiquidityOptimizer**: Calculates ADD/REMOVE/HOLD based on target ratios
- **EmergencyBrake**: Triggers EMERGENCY_STOP when thresholds exceeded
- **ThresholdGuard**: Blocks operations exceeding value limits
- **AnomalyDetector**: Issues ALERT/MONITOR based on confidence levels

This UI demonstrates the **actual intelligence** of the Cronos AI Agent SDK!