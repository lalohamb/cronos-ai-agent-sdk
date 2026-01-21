# SDK Integration Explanation

## How the SDK and SimpleVault-Landing-v1 are Related

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    simplevault-landing-v1                    │
│                    (React Frontend App)                      │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              App.tsx (Root Component)               │    │
│  │                                                      │    │
│  │  1. Imports SDK from @sentinal/ai-agent-sdk         │    │
│  │  2. Initializes SDK on app load                     │    │
│  │  3. Registers 5 built-in agents                     │    │
│  │  4. Registers SimpleVault contract                  │    │
│  │  5. Passes SDK instance to child components         │    │
│  └────────────────────────────────────────────────────┘    │
│                           │                                  │
│                           ▼                                  │
│  ┌────────────────────────────────────────────────────┐    │
│  │         AgentDashboard Component                    │    │
│  │                                                      │    │
│  │  - Receives SDK instance as prop                    │    │
│  │  - Executes agents via sdk.executeAgent()           │    │
│  │  - Displays agent results                           │    │
│  │  - Shows SDK health status                          │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ imports from
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              @sentinal/ai-agent-sdk (packages/core)          │
│                                                              │
│  - SentinelAgentSDK (main SDK class)                        │
│  - Built-in Agents (RiskMonitor, LiquidityOptimizer, etc.)  │
│  - Contract Registry                                        │
│  - Agent Registry                                           │
│  - Policy Engine                                            │
│  - Event System                                             │
└─────────────────────────────────────────────────────────────┘
```

### Dependency Relationship

**In `package.json`:**
```json
"dependencies": {
  "@sentinal/ai-agent-sdk": "file:../core"
}
```

This means:
- The landing app **depends on** the core SDK package
- It uses a **local file reference** (monorepo setup)
- Changes to `packages/core` are immediately available to the landing app after rebuild

---

## Dashboard Connection to Contract

### Initialization Flow (App.tsx)

**Step 1: SDK Initialization (Lines 28-37)**
```typescript
const sentinelSDK = new SentinelAgentSDK({
  network: 'cronos-testnet',
  rpcUrl: 'https://evm-t3.cronos.org',
  logLevel: LogLevel.INFO,
  runtime: {
    appName: 'SimpleVault Landing',
    env: 'development',
    version: '1.0.0'
  }
});
```

**Step 2: Start SDK (Line 40)**
```typescript
await sentinelSDK.start();
```

**Step 3: Register Agents (Lines 45-50)**
```typescript
sentinelSDK.registerAgent('risk-monitor', new RiskMonitor());
sentinelSDK.registerAgent('liquidity-optimizer', new LiquidityOptimizer());
sentinelSDK.registerAgent('emergency-brake', new EmergencyBrake());
sentinelSDK.registerAgent('threshold-guard', new ThresholdGuard());
sentinelSDK.registerAgent('anomaly-detector', new AnomalyDetector());
```

**Step 4: Register Contract (Lines 62-66)**
```typescript
await sentinelSDK.registerContract('simple-vault', {
  address: '0x656a4D09f53ab82f6B291082cb3159F7c14424dE',
  abi: [], // ABI not needed for basic health checks
  network: 'cronos-testnet'
});
```

**Step 5: Pass SDK to Dashboard (Line 93)**
```typescript
<Route path="/dashboard" element={
  <AgentDashboard sdk={sdk} isReady={isReady} healthStatus={healthStatus} />
} />
```

---

### Dashboard Usage (AgentDashboard.tsx)

**Receives SDK as Prop (Line 20)**
```typescript
export default function AgentDashboard({ sdk, isReady, healthStatus }: AgentDashboardProps)
```

**Uses Contract in Agent Execution (Lines 380-386)**
```typescript
const buildAgentContext = (agentId: string) => {
  const baseContext = {
    contractId: 'simple-vault',  // ← References the registered contract
    user: '0x656a4D09f53ab82f6B291082cb3159F7c14424dE',
    timestamp: Date.now(),
    customData: {}
  };
  // ...
};
```

**Executes Agents (Line 455)**
```typescript
const decision = await sdk.executeAgent(selectedAgent, context);
```

---

## Does the Dashboard Load with Contract Connection?

### ✅ YES - Here's the Flow:

1. **App Loads** → `App.tsx` `useEffect` runs
2. **SDK Initializes** → Connects to Cronos testnet RPC
3. **Contract Registers** → SimpleVault contract added to SDK's contract registry
4. **Agents Register** → 5 agents ready to execute
5. **SDK Instance Passed** → Dashboard receives fully initialized SDK
6. **Dashboard Ready** → `isReady={true}` enables agent execution

### Connection Status Indicators:

**In the Dashboard Header:**
```typescript
<div className={`w-3 h-3 rounded-full ${
  isReady ? 'bg-green-500' : 'bg-red-500'
}`}></div>
<span className="text-sm text-gray-600">
  {isReady ? 'SDK Connected' : 'SDK Disconnected'}
</span>
```

**"View Details" Button:**
- Shows registered contracts (including simple-vault)
- Shows registered agents (5 agents)
- Shows network (cronos-testnet)
- Shows health status

---

## Key Points

### 1. **Single SDK Instance**
- Created once in `App.tsx`
- Shared across all routes via props
- Maintains state throughout app lifecycle

### 2. **Contract is Pre-Registered**
- Contract registration happens **before** dashboard loads
- Dashboard doesn't need to register it again
- Just references it by ID: `'simple-vault'`

### 3. **Agent Execution Flow**
```
User clicks "Execute" 
  → buildAgentContext() creates context with contractId
  → sdk.executeAgent(agentId, context)
  → SDK looks up agent in registry
  → SDK looks up contract in registry
  → Agent executes with contract context
  → Decision returned to dashboard
  → Results displayed
```

### 4. **No Direct Blockchain Calls**
- Dashboard doesn't call contract methods directly
- All interaction goes through SDK
- SDK manages contract connections via ethers.js
- Agents make decisions based on context data (simulated for demo)

---

## Environment Variables

All configuration is now in `.env`:
- `VITE_CONTRACT_ID` - Contract identifier
- `VITE_CONTRACT_ADDRESS` - SimpleVault address on Cronos testnet
- `VITE_CONTRACT_NETWORK` - Network name
- `VITE_NETWORK` - SDK network
- `VITE_RPC_URL` - Cronos testnet RPC endpoint

This allows easy switching between contracts/networks without code changes.

