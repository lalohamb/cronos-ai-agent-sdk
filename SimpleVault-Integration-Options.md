# SimpleVault + SDK Integration: Architecture Options

## Overview

This guide explains **two different approaches** for integrating the Cronos AI Agent SDK with the existing SimpleVault project. Understanding these options is critical for choosing the right integration strategy for your use case.

---

## Current Standalone Architecture

The SimpleVault project currently has this structure:

```
┌─────────────────────────────────────────────────────────────┐
│              Frontend (Next.js :3001)                        │
│         Dashboard + Agent Console UI                         │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           Agent-Service (Express :3000)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Custom Implementation                               │  │
│  │  • 4 Custom Agents (withdrawal-risk, emergency, etc) │  │
│  │  • Custom Event Monitoring (WebSocket)               │  │
│  │  • Custom Policy (clamp.ts)                          │  │
│  │  • Direct ethers.js calls                            │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ ethers.js
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              SimpleVault.sol (Cronos EVM)                    │
│  • deposit() / withdraw()                                    │
│  • agentSetWithdrawLimit() - Agent hook                     │
│  • Events: Deposited, Withdrawn, AgentRecommendation        │
└─────────────────────────────────────────────────────────────┘
```

**Key Components:**
- **Frontend**: Next.js dashboard at port 3001
- **Agent-Service**: Custom Express server with 4 agents
- **Smart Contract**: SimpleVault.sol deployed on Cronos

---

## Integration Options

### Option 1: Replace Agent-Service Entirely ✅ (Recommended for Hackathon)

**Concept:** The SDK completely replaces the standalone Agent-Service.

```
┌─────────────────────────────────────────────────────────────┐
│              Frontend (Next.js :3001)                        │
│         Dashboard + Agent Console UI                         │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           SDK-Based Service (Express :3000)                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         @sentinel/ai-agent-sdk (Core)                  │  │
│  │  ┌────────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │   Agent    │  │    Policy    │  │   Event     │  │  │
│  │  │  Registry  │  │    Engine    │  │  Listener   │  │  │
│  │  └────────────┘  └──────────────┘  └─────────────┘  │  │
│  │  ┌────────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │ Contract   │  │   Payment    │  │    Audit    │  │  │
│  │  │  Registry  │  │   Manager    │  │   Logger    │  │  │
│  │  └────────────┘  └──────────────┘  └─────────────┘  │  │
│  │                                                      │  │
│  │  Adapted Agents (SDK-compatible):                   │  │
│  │  • WithdrawalRiskSentinel (extends BaseAgent)       │  │
│  │  • EmergencyBrakeAgent (extends BaseAgent)          │  │
│  │  • SettlementBatchOptimizer (extends BaseAgent)     │  │
│  │  • PortfolioRebalancerAI (extends BaseAgent)        │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ ethers.js (via SDK ContractAdapter)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              SimpleVault.sol (Cronos EVM)                    │
│  • deposit() / withdraw()                                    │
│  • agentSetWithdrawLimit() - Agent hook                     │
│  • Events: Deposited, Withdrawn, AgentRecommendation        │
└─────────────────────────────────────────────────────────────┘
```

**What Changes:**
- ❌ **Remove**: `agent-service/src/agents/` (custom implementations)
- ❌ **Remove**: `agent-service/src/events/` (custom event monitoring)
- ❌ **Remove**: `agent-service/src/utils/clamp.ts` (custom policy)
- ✅ **Add**: SDK initialization and configuration
- ✅ **Add**: SDK-adapted agents extending `BaseAgent`
- ✅ **Keep**: Express routes (but simplified)
- ✅ **Keep**: Frontend (unchanged or enhanced with SDK UI components)
- ✅ **Keep**: SimpleVault.sol (no changes)

**Pros:**
- ✅ Cleanest architecture
- ✅ Minimal code to maintain
- ✅ Full SDK feature set (audit, payments, control plane)
- ✅ Best for demo/presentation
- ✅ Shows "before and after" story clearly

**Cons:**
- ⚠️ Requires rewriting agent logic
- ⚠️ More upfront work
- ⚠️ Breaking change for existing integrations

---

### Option 2: Hybrid - Keep Agent-Service, Use SDK Internally 🔄 (Recommended for Production)

**Concept:** Keep the existing Agent-Service structure but power it with the SDK internally.

```
┌─────────────────────────────────────────────────────────────┐
│              Frontend (Next.js :3001)                        │
│         Dashboard + Agent Console UI                         │
│              (NO CHANGES REQUIRED)                           │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST (same API)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           Agent-Service (Express :3000)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Existing Routes (KEPT)                              │  │
│  │  • POST /agents/apply                                │  │
│  │  • GET /agents                                       │  │
│  │  • GET /vault/:user                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                    │
│                         ▼                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         @sentinel/ai-agent-sdk (Internal)              │  │
│  │  • Replaces custom agent execution                   │  │
│  │  • Replaces custom event monitoring                  │  │
│  │  • Replaces custom clamp.ts                          │  │
│  │  • Wraps ethers.js calls                             │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ ethers.js (via SDK)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              SimpleVault.sol (Cronos EVM)                    │
└─────────────────────────────────────────────────────────────┘
```

**What Changes:**
- ✅ **Keep**: All Express routes and API endpoints
- ✅ **Keep**: Frontend (100% unchanged)
- ✅ **Keep**: Agent logic (but adapt to SDK interface)
- 🔄 **Replace**: Internal implementation uses SDK
- 🔄 **Replace**: Event monitoring with SDK's EventListener
- 🔄 **Replace**: clamp.ts with SDK's PolicyEngine
- ✅ **Keep**: SimpleVault.sol (no changes)

**Pros:**
- ✅ Zero frontend changes
- ✅ Incremental migration path
- ✅ Can run both systems in parallel (A/B testing)
- ✅ Backward compatible
- ✅ Lower risk for production

**Cons:**
- ⚠️ More code to maintain
- ⚠️ Doesn't showcase SDK as clearly
- ⚠️ Some redundancy between routes and SDK

---

## Component Mapping: What Gets Replaced?

| Component | Standalone Location | SDK Equivalent | Option 1 | Option 2 |
|-----------|-------------------|----------------|----------|----------|
| **Agent implementations** | `agent-service/src/agents/` | SDK agents extending `BaseAgent` | Replace | Adapt |
| **Event monitoring** | `agent-service/src/events/` | SDK's `EventListener` | Replace | Replace |
| **Policy/clamping** | `agent-service/src/utils/clamp.ts` | SDK's `PolicyEngine` | Replace | Replace |
| **Contract interaction** | Direct ethers.js | SDK's `ContractAdapter` | Replace | Replace |
| **Express routes** | `agent-service/src/routes/` | Optional | Simplify | Keep |
| **Frontend** | `frontend/` | Can use SDK React components | Keep/Enhance | Keep |
| **Smart Contract** | `contracts/SimpleVault.sol` | No change | Keep ✅ | Keep ✅ |

---

## Option 1: Complete Implementation (Replace Agent-Service)

### Directory Structure

```
cronos-ai-agent-sdk/
├── packages/
│   └── core/                    # SDK core (already exists)
└── examples/
    └── simplevault-sdk/         # NEW: SDK-only implementation
        ├── src/
        │   ├── server.ts        # Express server using SDK
        │   ├── agents/          # SDK-adapted agents
        │   │   ├── WithdrawalRiskSentinel.ts
        │   │   ├── EmergencyBrakeAgent.ts
        │   │   ├── SettlementBatchOptimizer.ts
        │   │   └── PortfolioRebalancerAI.ts
        │   ├── config/
        │   │   └── sdk-config.ts
        │   └── routes/
        │       └── agents.ts    # Simplified routes
        ├── package.json
        └── .env.example
```

### Step 1: Install SDK

```bash
cd examples/simplevault-sdk
npm install @sentinel/ai-agent-sdk ethers dotenv express
```

### Step 2: Create SDK Configuration

```typescript
// src/config/sdk-config.ts
import { SentinelAgentSDK } from '@sentinel/ai-agent-sdk';

export const SIMPLE_VAULT_ABI = [
  'function deposit() payable',
  'function withdraw(uint256 amount)',
  'function balances(address user) view returns (uint256)',
  'function recommendedWithdrawLimit(address user) view returns (uint256)',
  'function agentSetWithdrawLimit(address user, uint256 newLimit, string reason)',
  'event Deposited(address indexed user, uint256 amount)',
  'event Withdrawn(address indexed user, uint256 amount)',
  'event AgentRecommendation(address indexed agent, address indexed user, uint256 newLimit, string reason)'
];

export async function initializeSDK() {
  const sdk = new SentinelAgentSDK({
    network: 'cronos-testnet',
    rpcUrl: process.env.CRONOS_RPC_URL || 'https://evm-t3.cronos.org',
    privateKey: process.env.AGENT_PRIVATE_KEY!,

    // Optional: Enable AI
    aiProvider: 'openai',
    aiApiKey: process.env.OPENAI_API_KEY,
    aiModel: 'gpt-4o-mini',

    // Enable audit logging
    audit: {
      enabled: true,
      logLevel: 'INFO'
    },

    logLevel: 'INFO'
  });

  // Register SimpleVault contract
  await sdk.registerContract('simple-vault', {
    address: process.env.SIMPLE_VAULT_ADDRESS!,
    abi: SIMPLE_VAULT_ABI,
    network: 'cronos-testnet'
  });

  return sdk;
}
```

### Step 3: Adapt Agents to SDK Interface

```typescript
// src/agents/WithdrawalRiskSentinel.ts
import { BaseAgent, AgentContext, AgentDecision } from '@sentinel/ai-agent-sdk';

export class WithdrawalRiskSentinel extends BaseAgent {
  config = {
    id: 'withdrawal-risk-sentinel',
    name: 'Withdrawal Risk Sentinel',
    description: 'Monitors account state and recommends safe withdrawal limits',
    version: '1.0.0'
  };

  async decide(context: AgentContext): Promise<AgentDecision> {
    this.validateContext(context);

    const { balanceWei, currentLimitWei } = context.customData;

    if (!balanceWei) {
      throw new Error('balanceWei required in customData');
    }

    const balance = BigInt(balanceWei.toString());
    const currentLimit = currentLimitWei ? BigInt(currentLimitWei.toString()) : 0n;

    // Initial recommendation: 50% of balance
    const halfBalance = (balance * 50n) / 100n;

    // If limit exists, tighten by 5% to reduce sudden-drain risk
    const proposedLimit = currentLimit > 0n
      ? (currentLimit * 95n) / 100n
      : halfBalance;

    return {
      action: {
        type: 'LIMIT',
        value: proposedLimit.toString(),
        reason: currentLimit > 0n
          ? 'Tightening limit by 5% to reduce sudden-drain risk'
          : 'Initial safe limit at 50% of balance',
        severity: 'MEDIUM'
      },
      reason: `Recommended withdrawal limit: ${proposedLimit.toString()} wei`,
      confidence: 0.7,
      metadata: {
        balance: balance.toString(),
        currentLimit: currentLimit.toString(),
        proposedLimit: proposedLimit.toString()
      }
    };
  }
}
```

```typescript
// src/agents/EmergencyBrakeAgent.ts
import { BaseAgent, AgentContext, AgentDecision } from '@sentinel/ai-agent-sdk';

export class EmergencyBrakeAgent extends BaseAgent {
  config = {
    id: 'emergency-brake',
    name: 'Emergency Brake',
    description: 'Crisis-mode limiter that clamps limits under abnormal conditions',
    version: '1.0.0'
  };

  async decide(context: AgentContext): Promise<AgentDecision> {
    this.validateContext(context);

    const { balanceWei, riskTrigger } = context.customData;
    const balance = BigInt(balanceWei.toString());

    const isSevere = riskTrigger === 'VOLATILITY_SPIKE' || riskTrigger === 'ANOMALY';

    // Severe: 10% of balance, Normal: 25% of balance
    const proposedLimit = isSevere
      ? (balance * 10n) / 100n
      : (balance * 25n) / 100n;

    return {
      action: {
        type: isSevere ? 'BLOCK' : 'LIMIT',
        value: proposedLimit.toString(),
        reason: isSevere
          ? `Emergency brake activated: ${riskTrigger}`
          : 'Normal risk mode',
        severity: isSevere ? 'CRITICAL' : 'MEDIUM'
      },
      reason: `Emergency brake: ${riskTrigger || 'NONE'} → limit to ${isSevere ? '10%' : '25%'}`,
      confidence: isSevere ? 0.85 : 0.6,
      metadata: {
        riskTrigger,
        proposedLimit: proposedLimit.toString()
      }
    };
  }
}
```

### Step 4: Create Express Server with SDK

```typescript
// src/server.ts
import express from 'express';
import { initializeSDK } from './config/sdk-config';
import { WithdrawalRiskSentinel } from './agents/WithdrawalRiskSentinel';
import { EmergencyBrakeAgent } from './agents/EmergencyBrakeAgent';

const app = express();
app.use(express.json());

let sdk: any;

async function startServer() {
  // Initialize SDK
  sdk = await initializeSDK();

  // Register agents
  sdk.registerAgent('withdrawal-risk-sentinel', new WithdrawalRiskSentinel());
  sdk.registerAgent('emergency-brake', new EmergencyBrakeAgent());

  // Add policies
  sdk.addPolicy({
    id: 'max-withdrawal-limit',
    name: 'Maximum Withdrawal Limit Policy',
    description: 'Ensures withdrawal limits never exceed 80% of balance',
    validate: (decision: any, context: any) => {
      const balance = BigInt(context.customData.balanceWei.toString());
      const proposedLimit = BigInt(decision.action.value?.toString() || '0');
      const maxAllowed = (balance * 80n) / 100n;
      return proposedLimit <= maxAllowed;
    },
    enforce: (decision: any, context: any) => {
      const balance = BigInt(context.customData.balanceWei.toString());
      const proposedLimit = BigInt(decision.action.value?.toString() || '0');
      const maxAllowed = (balance * 80n) / 100n;

      if (proposedLimit > maxAllowed) {
        return {
          ...decision,
          action: {
            ...decision.action,
            value: maxAllowed.toString(),
            reason: `Clamped to 80% of balance (was ${proposedLimit.toString()})`
          },
          reason: `${decision.reason} [CLAMPED to max 80%]`
        };
      }

      return decision;
    }
  });

  // Set up event listeners
  sdk.onContractEvent('simple-vault', 'Deposited', async (event: any) => {
    console.log('💰 Deposit detected:', {
      user: event.args.user,
      amount: event.args.amount.toString()
    });

    const contract = await sdk.getContract('simple-vault');
    const balance = await contract.call('balances', [event.args.user]);
    const currentLimit = await contract.call('recommendedWithdrawLimit', [event.args.user]);

    const decision = await sdk.executeAgent('withdrawal-risk-sentinel', {
      contractId: 'simple-vault',
      user: event.args.user,
      customData: {
        balanceWei: balance,
        currentLimitWei: currentLimit
      }
    });

    if (decision.action.type === 'LIMIT') {
      const tx = await contract.send('agentSetWithdrawLimit', [
        event.args.user,
        decision.action.value,
        decision.reason.substring(0, 200)
      ]);
      await tx.wait();
      console.log('✅ Limit applied on-chain:', tx.hash);
    }
  });

  sdk.onContractEvent('simple-vault', 'Withdrawn', async (event: any) => {
    console.log('💸 Withdrawal detected:', {
      user: event.args.user,
      amount: event.args.amount.toString()
    });

    const contract = await sdk.getContract('simple-vault');
    const balance = await contract.call('balances', [event.args.user]);
    const currentLimit = await contract.call('recommendedWithdrawLimit', [event.args.user]);

    const decision = await sdk.executeAgent('withdrawal-risk-sentinel', {
      contractId: 'simple-vault',
      user: event.args.user,
      customData: {
        balanceWei: balance,
        currentLimitWei: currentLimit
      }
    });

    if (decision.action.type === 'LIMIT') {
      const tx = await contract.send('agentSetWithdrawLimit', [
        event.args.user,
        decision.action.value,
        decision.reason.substring(0, 200)
      ]);
      await tx.wait();
    }
  });

  // Start SDK
  await sdk.start();
  console.log('🚀 SDK started, monitoring events...');
}

// API Routes
app.post('/agents/apply', async (req, res) => {
  try {
    const { agentId, user, riskTrigger } = req.body;

    const contract = await sdk.getContract('simple-vault');
    const balance = await contract.call('balances', [user]);
    const currentLimit = await contract.call('recommendedWithdrawLimit', [user]);

    const decision = await sdk.executeAgent(agentId, {
      contractId: 'simple-vault',
      user,
      customData: {
        balanceWei: balance,
        currentLimitWei: currentLimit,
        riskTrigger
      }
    });

    // Apply decision on-chain
    if (decision.action.type === 'LIMIT') {
      const tx = await contract.send('agentSetWithdrawLimit', [
        user,
        decision.action.value,
        decision.reason.substring(0, 200)
      ]);
      await tx.wait();
    }

    res.json({ success: true, decision });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/agents', (req, res) => {
  res.json({ agents: sdk.listAgents() });
});

app.get('/vault/:user', async (req, res) => {
  try {
    const contract = await sdk.getContract('simple-vault');
    const balance = await contract.call('balances', [req.params.user]);
    const limit = await contract.call('recommendedWithdrawLimit', [req.params.user]);

    res.json({
      user: req.params.user,
      balance: balance.toString(),
      recommendedLimit: limit.toString()
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
startServer().then(() => {
  app.listen(3000, () => {
    console.log('🚀 SimpleVault SDK server running on port 3000');
  });
});
```

### Step 5: Environment Configuration

```bash
# .env.example
CRONOS_RPC_URL=https://evm-t3.cronos.org
SIMPLE_VAULT_ADDRESS=0x...
AGENT_PRIVATE_KEY=0x...
OPENAI_API_KEY=sk-...
```

### Step 6: Run the Server

```bash
npm run dev
```

**Result:**
- ✅ SDK handles all agent execution
- ✅ SDK monitors events automatically
- ✅ SDK enforces policies
- ✅ Simplified Express routes
- ✅ No custom event monitoring code
- ✅ No custom clamp.ts needed

---

## Option 2: Complete Implementation (Hybrid Approach)

### Directory Structure

```
v3 v001 SimpleVaultsol/
└── agent-service/              # EXISTING - Keep structure
    ├── src/
    │   ├── server.ts           # MODIFIED - Use SDK internally
    │   ├── agents/             # MODIFIED - Adapt to SDK
    │   │   ├── withdrawal-risk-sentinel/
    │   │   │   └── index.ts    # Wrap with SDK adapter
    │   │   ├── emergency-brake/
    │   │   │   └── index.ts    # Wrap with SDK adapter
    │   │   └── types.ts        # Keep existing types
    │   ├── routes/
    │   │   └── agents.ts       # MODIFIED - Call SDK internally
    │   └── config/
    │       └── sdk.ts          # NEW - SDK initialization
    └── package.json            # ADD: @sentinel/ai-agent-sdk
```

### Step 1: Install SDK (Keep Existing Dependencies)

```bash
cd agent-service
npm install @sentinel/ai-agent-sdk
```

### Step 2: Create SDK Initialization Module

```typescript
// agent-service/src/config/sdk.ts
import { SentinelAgentSDK } from '@sentinel/ai-agent-sdk';

const SIMPLE_VAULT_ABI = [
  'function deposit() payable',
  'function withdraw(uint256 amount)',
  'function balances(address user) view returns (uint256)',
  'function recommendedWithdrawLimit(address user) view returns (uint256)',
  'function agentSetWithdrawLimit(address user, uint256 newLimit, string reason)',
  'event Deposited(address indexed user, uint256 amount)',
  'event Withdrawn(address indexed user, uint256 amount)',
  'event AgentRecommendation(address indexed agent, address indexed user, uint256 newLimit, string reason)'
];

let sdkInstance: SentinelAgentSDK | null = null;

export async function getSDK(): Promise<SentinelAgentSDK> {
  if (sdkInstance) return sdkInstance;

  sdkInstance = new SentinelAgentSDK({
    network: 'cronos-testnet',
    rpcUrl: process.env.CRONOS_RPC_URL || 'https://evm-t3.cronos.org',
    privateKey: process.env.AGENT_PRIVATE_KEY!,
    aiProvider: 'openai',
    aiApiKey: process.env.OPENAI_API_KEY,
    audit: { enabled: true },
    logLevel: 'INFO'
  });

  await sdkInstance.registerContract('simple-vault', {
    address: process.env.SIMPLE_VAULT_ADDRESS!,
    abi: SIMPLE_VAULT_ABI,
    network: 'cronos-testnet'
  });

  return sdkInstance;
}
```

### Step 3: Create SDK Agent Adapters

```typescript
// agent-service/src/agents/withdrawal-risk-sentinel/sdk-adapter.ts
import { BaseAgent, AgentContext, AgentDecision } from '@sentinel/ai-agent-sdk';

export class WithdrawalRiskSentinelSDK extends BaseAgent {
  config = {
    id: 'withdrawal-risk-sentinel',
    name: 'Withdrawal Risk Sentinel',
    description: 'Monitors account state and recommends safe withdrawal limits',
    version: '1.0.0'
  };

  async decide(context: AgentContext): Promise<AgentDecision> {
    const { balanceWei, currentLimitWei } = context.customData;

    const balance = BigInt(balanceWei.toString());
    const currentLimit = currentLimitWei ? BigInt(currentLimitWei.toString()) : 0n;

    const halfBalance = (balance * 50n) / 100n;
    const proposedLimit = currentLimit > 0n
      ? (currentLimit * 95n) / 100n
      : halfBalance;

    return {
      action: {
        type: 'LIMIT',
        value: proposedLimit.toString(),
        reason: currentLimit > 0n
          ? 'Tightening limit by 5%'
          : 'Initial safe limit at 50%',
        severity: 'MEDIUM'
      },
      reason: `Recommended: ${proposedLimit.toString()} wei`,
      confidence: 0.7,
      metadata: {
        balance: balance.toString(),
        currentLimit: currentLimit.toString(),
        proposedLimit: proposedLimit.toString()
      }
    };
  }
}
```

```typescript
// agent-service/src/agents/emergency-brake/sdk-adapter.ts
import { BaseAgent, AgentContext, AgentDecision } from '@sentinel/ai-agent-sdk';

export class EmergencyBrakeSDK extends BaseAgent {
  config = {
    id: 'emergency-brake',
    name: 'Emergency Brake',
    description: 'Crisis-mode limiter',
    version: '1.0.0'
  };

  async decide(context: AgentContext): Promise<AgentDecision> {
    const { balanceWei, riskTrigger } = context.customData;
    const balance = BigInt(balanceWei.toString());

    const isSevere = riskTrigger === 'VOLATILITY_SPIKE' || riskTrigger === 'ANOMALY';
    const proposedLimit = isSevere ? (balance * 10n) / 100n : (balance * 25n) / 100n;

    return {
      action: {
        type: isSevere ? 'BLOCK' : 'LIMIT',
        value: proposedLimit.toString(),
        reason: isSevere ? `Emergency: ${riskTrigger}` : 'Normal mode',
        severity: isSevere ? 'CRITICAL' : 'MEDIUM'
      },
      reason: `Emergency brake: ${riskTrigger || 'NONE'}`,
      confidence: isSevere ? 0.85 : 0.6,
      metadata: { riskTrigger, proposedLimit: proposedLimit.toString() }
    };
  }
}
```

### Step 4: Modify Existing Routes to Use SDK

```typescript
// agent-service/src/routes/agents.ts (MODIFIED)
import { Router } from 'express';
import { getSDK } from '../config/sdk';
import { WithdrawalRiskSentinelSDK } from '../agents/withdrawal-risk-sentinel/sdk-adapter';
import { EmergencyBrakeSDK } from '../agents/emergency-brake/sdk-adapter';

const router = Router();

// Initialize SDK agents (once)
let initialized = false;
async function ensureSDKInitialized() {
  if (initialized) return;

  const sdk = await getSDK();
  sdk.registerAgent('withdrawal-risk-sentinel', new WithdrawalRiskSentinelSDK());
  sdk.registerAgent('emergency-brake', new EmergencyBrakeSDK());

  // Add policies
  sdk.addPolicy({
    id: 'max-withdrawal-limit',
    validate: (decision: any, context: any) => {
      const balance = BigInt(context.customData.balanceWei);
      const limit = BigInt(decision.action.value || '0');
      return limit <= (balance * 80n) / 100n;
    },
    enforce: (decision: any, context: any) => {
      const balance = BigInt(context.customData.balanceWei);
      const maxAllowed = (balance * 80n) / 100n;
      const proposedLimit = BigInt(decision.action.value || '0');

      if (proposedLimit > maxAllowed) {
        return {
          ...decision,
          action: { ...decision.action, value: maxAllowed.toString() }
        };
      }
      return decision;
    }
  });

  initialized = true;
}

// POST /agents/apply - SAME API, SDK-powered internally
router.post('/apply', async (req, res) => {
  try {
    await ensureSDKInitialized();
    const sdk = await getSDK();

    const { agentId, user, riskTrigger } = req.body;

    // Get vault state using SDK
    const contract = await sdk.getContract('simple-vault');
    const balance = await contract.call('balances', [user]);
    const currentLimit = await contract.call('recommendedWithdrawLimit', [user]);

    // Execute agent via SDK (includes policy enforcement)
    const decision = await sdk.executeAgent(agentId, {
      contractId: 'simple-vault',
      user,
      customData: {
        balanceWei: balance,
        currentLimitWei: currentLimit,
        riskTrigger
      }
    });

    // Apply decision on-chain
    if (decision.action.type === 'LIMIT') {
      const tx = await contract.send('agentSetWithdrawLimit', [
        user,
        decision.action.value,
        decision.reason.substring(0, 200)
      ]);
      await tx.wait();
    }

    // Return response in SAME format as before
    res.json({
      success: true,
      agent: agentId,
      decision: {
        proposedLimitWei: decision.action.value,
        reason: decision.reason,
        confidence: decision.confidence
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /agents - SAME API
router.get('/', async (req, res) => {
  await ensureSDKInitialized();
  const sdk = await getSDK();

  res.json({
    agents: sdk.listAgents().map((agent: any) => ({
      id: agent.id,
      name: agent.name,
      description: agent.description
    }))
  });
});

export default router;
```

### Step 5: Update Server (Minimal Changes)

```typescript
// agent-service/src/server.ts (MODIFIED)
import express from 'express';
import agentRoutes from './routes/agents';
import { getSDK } from './config/sdk';

const app = express();
app.use(express.json());

// Mount existing routes (NO CHANGE to API)
app.use('/agents', agentRoutes);

// Optional: Set up SDK event monitoring
async function setupEventMonitoring() {
  const sdk = await getSDK();

  sdk.onContractEvent('simple-vault', 'Deposited', async (event: any) => {
    console.log('💰 Deposit detected (SDK):', event.args.user);
    // SDK handles agent execution automatically if configured
  });

  await sdk.start();
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`🚀 Agent Service running on port ${PORT}`);
  await setupEventMonitoring();
  console.log('📡 SDK event monitoring active');
});
```

### Step 6: Run the Hybrid System

```bash
cd agent-service
npm run dev
```

**Result:**
- ✅ Frontend unchanged (same API)
- ✅ Routes unchanged (same endpoints)
- ✅ SDK powers everything internally
- ✅ Policy enforcement via SDK
- ✅ Audit logging via SDK
- ✅ Can gradually migrate more features

---

## Comparison: Option 1 vs Option 2

| Aspect | Option 1 (Replace) | Option 2 (Hybrid) |
|--------|-------------------|-------------------|
| **Frontend Changes** | Optional (can enhance) | None required |
| **API Changes** | Simplified routes | No changes |
| **Agent Code** | Rewrite for SDK | Adapt with wrappers |
| **Event Monitoring** | SDK only | SDK + optional custom |
| **Policy Enforcement** | SDK PolicyEngine | SDK PolicyEngine |
| **Migration Risk** | Higher (big bang) | Lower (incremental) |
| **Code Complexity** | Lower (SDK handles all) | Higher (dual layer) |
| **Demo Impact** | Clear "before/after" | Less visible change |
| **Production Ready** | Requires full testing | Can A/B test |
| **Maintenance** | Less code | More code |

---

## Recommendation by Use Case

### For Hackathon Demo: **Option 1** ✅
**Why:**
- Shows SDK's full capabilities
- Clear architectural improvement
- Minimal code to present
- "We built it, then made it better with SDK"

### For Production Deployment: **Option 2** 🔄
**Why:**
- Zero downtime migration
- Can run both systems in parallel
- Gradual rollout (10% → 50% → 100%)
- Rollback capability
- Existing integrations keep working

### For New Projects: **Option 1** ✅
**Why:**
- Start with best practices
- No legacy code
- Full SDK feature set from day 1

---

## Migration Path: Standalone → Hybrid → Full SDK

### Phase 1: Add SDK Layer (Option 2)
```
Week 1-2: Install SDK, create adapters
Week 3-4: Route 10% of traffic through SDK
Week 5-6: Monitor, compare outputs
```

### Phase 2: Increase SDK Usage
```
Week 7-8: Route 50% through SDK
Week 9-10: Deprecate custom event monitoring
Week 11-12: Route 100% through SDK
```

### Phase 3: Remove Legacy Code (→ Option 1)
```
Week 13-14: Remove custom agent implementations
Week 15-16: Simplify routes
Week 17-18: Full SDK-only architecture
```

---

## Testing Both Options

### Option 1 Testing
```bash
# Deploy SimpleVault
cd contracts && npx hardhat run scripts/deploy.ts --network cronos-testnet

# Start SDK-only service
cd examples/simplevault-sdk
npm install
npm run dev

# Test agent execution
curl -X POST http://localhost:3000/agents/apply \
  -H "Content-Type: application/json" \
  -d '{"agentId": "withdrawal-risk-sentinel", "user": "0x..."}'
```

### Option 2 Testing
```bash
# Keep existing deployment
cd agent-service
npm install @sentinel/ai-agent-sdk
npm run dev

# Same API works (no frontend changes needed)
curl -X POST http://localhost:3000/agents/apply \
  -H "Content-Type: application/json" \
  -d '{"agentId": "withdrawal-risk-sentinel", "user": "0x..."}'
```

---

## Conclusion

Both options are valid integration strategies:

- **Option 1 (Replace)**: Best for demos, new projects, and showcasing SDK capabilities
- **Option 2 (Hybrid)**: Best for production migrations, risk mitigation, and backward compatibility

The **smart contract (SimpleVault.sol) remains unchanged** in both cases - only the off-chain agent infrastructure changes.

Choose based on your priorities:
- **Speed to demo** → Option 1
- **Production safety** → Option 2
- **Long-term vision** → Start with Option 2, migrate to Option 1


