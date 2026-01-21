# Dashboard Mock Data - AgentDashboard.tsx

## Overview
The Dashboard (`/dashboard`) uses **100% mock data** for demonstration purposes. No real AI agents are executed.

---

## 🔴 Mock Data #1: Future Agents (14 agents)

**Location:** Lines 19-34  
**Variable:** `futureAgents`

```typescript
const futureAgents = [
  { id: 'ai-reasoning-agent', name: 'AI Reasoning Agent', type: 'AI/LLM', ... },
  { id: 'x402-payment-agent', name: 'x402 Payment Agent', type: 'x402', ... },
  { id: 'withdrawal-sentinel', name: 'Withdrawal Risk Sentinel', type: 'Protective', ... },
  { id: 'settlement-optimizer', name: 'Settlement Batch Optimizer', type: 'Efficiency', ... },
  { id: 'volatility-governor', name: 'Portfolio Volatility Governor', type: 'Market-Responsive', ... },
  { id: 'compliance-advisor', name: 'Compliance & Audit Advisor', type: 'Regulatory', ... },
  { id: 'recurring-payment', name: 'Recurring Payment Safety Agent', type: 'Scheduled', ... },
  { id: 'treasury-preservation', name: 'Treasury Preservation Agent', type: 'Treasury', ... },
  { id: 'behavior-monitor', name: 'User Behavior Pattern Monitor', type: 'Behavioral', ... },
  { id: 'consensus-synthesizer', name: 'Multi-Agent Consensus Synthesizer', type: 'Meta-Agent', ... },
  { id: 'cost-optimizer', name: 'Cost-Efficiency Optimizer', type: 'Gas', ... },
  { id: 'reputation-agent', name: 'Reputation-Aware Risk Agent', type: 'Trust-Based', ... },
  { id: 'human-approval', name: 'Human-in-the-Loop Approval Agent', type: 'Hybrid', ... },
  { id: 'genius-act-compliance', name: 'Genius Act Compliance', type: 'Regulatory', ... }
];
```

**Purpose:** Display locked/preview agents that require subscription  
**Status:** 🔴 **Completely Mock** - These agents don't exist yet

---

## 🔴 Mock Data #2: Built-in Agents (5 agents)

**Location:** Lines 36-366  
**Variable:** `agents`

### Agent 1: Risk Monitor
- **Type:** Deterministic
- **Purpose:** Monitors risk metrics and recommends protective actions
- **Controls:** Risk Threshold, Alert Level, Auto-Execute
- **Code:** Full TypeScript implementation (lines 45-107)

### Agent 2: Liquidity Optimizer
- **Type:** Deterministic
- **Purpose:** Optimizes liquidity allocation across pools
- **Controls:** Target Ratio, Rebalance Frequency, Slippage Tolerance
- **Code:** Full TypeScript implementation (lines 120-182)

### Agent 3: Emergency Brake
- **Type:** Deterministic
- **Purpose:** Triggers emergency stops when critical conditions detected
- **Controls:** Emergency Threshold, Cooldown Period, Recovery Mode
- **Code:** Full TypeScript implementation (lines 195-257)

### Agent 4: Threshold Guard
- **Type:** Deterministic
- **Purpose:** Enforces threshold limits on operations
- **Controls:** Max Exposure, Daily Limits, User Limits
- **Code:** Full TypeScript implementation (lines 270-332)

### Agent 5: Anomaly Detector
- **Type:** Statistical
- **Purpose:** Detects unusual patterns using statistical analysis
- **Controls:** Sensitivity, Learning Period, Alert Threshold
- **Code:** Full TypeScript implementation (lines 345-364)

**Each agent includes:**
- `id` - Unique identifier
- `name` - Display name
- `type` - Agent type (Deterministic/Statistical)
- `purpose` - What the agent does
- `controls` - Array of control names (for sliders)
- `description` - Short description
- `codeExplanation` - Why it's deterministic/statistical
- `code` - Full TypeScript code example (50-120 lines each)

**Status:** 🔴 **Completely Mock** - Code examples are for demonstration only

---

## 🔴 Mock Data #3: Agent Execution Results

**Location:** Lines 368-390  
**Function:** `executeAgent()`

```typescript
const executeAgent = async () => {
  if (!isReady) return;

  // Demo mode - simulate agent execution
  const mockResult = {
    action: {
      type: Math.random() > 0.3 ? 'ALLOW' : 'BLOCK',  // 70% ALLOW, 30% BLOCK
      confidence: Math.random(),                       // Random 0-1
      reason: `${selectedAgent} analysis complete`
    },
    metadata: {
      executionTime: Math.floor(Math.random() * 100) + 'ms',  // Random 0-100ms
      agentType: agents.find(a => a.id === selectedAgent)?.type
    }
  };

  setAgentResults(prev => [{
    id: Date.now(),
    agent: selectedAgent,
    result: mockResult,
    timestamp: new Date().toLocaleTimeString()
  }, ...prev.slice(0, 4)]);
};
```

**What's Mock:**
- ✅ Action type (ALLOW/BLOCK) - **randomly generated**
- ✅ Confidence score - **random number 0-1**
- ✅ Execution time - **random 0-100ms**
- ✅ Reason - **generic message**

**Status:** 🔴 **Completely Mock** - No real agent logic is executed

---

## 🟢 Real Data: SDK Health Status

**Location:** Passed as props from `App.tsx`  
**Source:** `src/utils/sdkHealthChecker.ts`

```typescript
interface AgentDashboardProps {
  sdk: any;
  isReady: boolean;              // ✅ Real - from health checker
  healthStatus: SDKHealthResults | null;  // ✅ Real - from health checker
}
```

**What's Real:**
- ✅ `isReady` - Actual SDK initialization status
- ✅ `healthStatus.rpcHealth` - Real RPC connection test
- ✅ `healthStatus.contractValidation` - Real gas price from network
- ✅ Network connectivity status

**What's Mock:**
- 🔴 `healthStatus.agentRegistration` - Simulated (no real agents registered)

---

## Summary Table

| Data Type | Location | Lines | Status | Purpose |
|-----------|----------|-------|--------|---------|
| **Future Agents** | `futureAgents` | 19-34 | 🔴 Mock | Preview locked agents |
| **Built-in Agents** | `agents` | 36-366 | 🔴 Mock | Display agent info & code |
| **Agent Code** | `agents[].code` | 45-364 | 🔴 Mock | Show TypeScript examples |
| **Execution Results** | `executeAgent()` | 368-390 | 🔴 Mock | Simulate agent responses |
| **SDK Status** | `isReady` prop | - | 🟢 Real | Actual health check |
| **RPC Health** | `healthStatus` prop | - | 🟢 Real | Real network data |

---

## How Mock Data is Used

### 1. Agent Selection Panel (Left Side)
- Displays 5 built-in agents from `agents` array
- Displays 14 future agents from `futureAgents` array
- Shows lock icon for future agents

### 2. Agent Details (Right Side - Explain Tab)
- Shows `currentAgent.purpose`
- Shows `currentAgent.description`
- Shows `currentAgent.type`

### 3. Code Tab
- Shows `currentAgent.codeExplanation`
- Shows `currentAgent.code` with syntax highlighting

### 4. See in Action Tab
- Shows sliders based on `currentAgent.controls`
- "Execute" button calls `executeAgent()`
- Displays mock results from `agentResults` state

---

## To Replace Mock Data with Real Agents

### Step 1: Install Real SDK
```bash
npm install @sentinel/ai-agent-sdk
```

### Step 2: Update App.tsx
```typescript
import { SentinelAgentSDK } from '@sentinel/ai-agent-sdk';

const sdk = new SentinelAgentSDK({
  network: 'cronos-testnet',
  rpcUrl: 'https://evm-t3.cronos.org'
});
```

### Step 3: Update executeAgent() Function
Replace lines 368-390 with:
```typescript
const executeAgent = async () => {
  if (!isReady || !sdk) return;

  try {
    // Call real SDK
    const result = await sdk.executeAgent(selectedAgent, {
      // Pass slider values as context
      customData: sliderValues
    });

    setAgentResults(prev => [{
      id: Date.now(),
      agent: selectedAgent,
      result: result,
      timestamp: new Date().toLocaleTimeString()
    }, ...prev.slice(0, 4)]);
  } catch (error) {
    console.error('Agent execution failed:', error);
  }
};
```

---

## Conclusion

**Current State:**
- 🔴 **100% of agent functionality is mock**
- 🔴 **All execution results are randomly generated**
- 🔴 **Code examples are for demonstration only**
- 🟢 **Only SDK health checks use real network data**

**To Make It Real:**
- Install actual SDK package
- Connect to real agent implementations
- Replace mock execution with SDK calls
- Use real contract addresses and data

