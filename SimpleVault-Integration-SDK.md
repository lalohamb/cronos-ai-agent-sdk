# SimpleVault + Cronos AI Agent SDK Integration Guide

## Overview

This guide demonstrates how to wrap the **SimpleVault.sol** contract with the **Cronos AI Agent SDK** to create an intelligent, policy-controlled vault management system.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                        │
│              Dashboard + Agent Console UI                    │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Agent Service (Express + SDK)                   │
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

---

## Step 1: Deploy SimpleVault Contract

The SimpleVault contract is already designed with agent integration in mind:

### Key Features:
- ✅ **Agent Hook**: `agentSetWithdrawLimit(user, newLimit, reason)` - allows authorized agent to set advisory limits
- ✅ **Events**: `Deposited`, `Withdrawn`, `AgentRecommendation` - enable event-driven automation
- ✅ **Advisory Model**: Limits are NOT enforced on-chain (preserves user freedom)
- ✅ **Governance**: Owner can set authorized agent address

### Deployment:
```bash
cd /path/to/v3\ v001\ SimpleVaultsol/contracts
npx hardhat compile
npx hardhat run scripts/deploy.ts --network cronos-testnet
```

**Result**: You get a deployed contract address (e.g., `0x123...`)

---

## Step 2: Install and Configure the SDK

### Installation:
```bash
npm install @sentinel/ai-agent-sdk
```

### Initialize SDK:
```typescript
import { SentinelAgentSDK, RiskMonitor, EmergencyBrake } from '@sentinel/ai-agent-sdk';
import { ethers } from 'ethers';

const sdk = new SentinelAgentSDK({
  network: 'cronos-testnet',
  rpcUrl: 'https://evm-t3.cronos.org',
  privateKey: process.env.AGENT_PRIVATE_KEY, // Agent's private key
  
  // Optional: Enable AI-powered agents
  aiProvider: 'openai',
  aiApiKey: process.env.OPENAI_API_KEY,
  aiModel: 'gpt-4o-mini',
  
  // Optional: Enable audit logging
  audit: {
    enabled: true
  },
  
  logLevel: 'INFO'
});
```

---

## Step 3: Register SimpleVault Contract

The SDK wraps your deployed contract using a `ContractAdapter`:

```typescript
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

await sdk.registerContract('simple-vault', {
  address: '0x123...', // Your deployed SimpleVault address
  abi: SIMPLE_VAULT_ABI,
  network: 'cronos-testnet'
});
```

**What this does**:
- Creates a standardized interface to your contract
- Enables the SDK to read contract state
- Allows agents to call contract methods
- Sets up event monitoring infrastructure

---

## Step 4: Create Custom Agents (SDK-Compatible)

The SDK uses a different agent interface than the standalone SimpleVault agents. Here's how to adapt them:

### SDK Agent Interface:
```typescript
interface AgentContext {
  contractId: string;      // 'simple-vault'
  user: string;            // User address
  blockNumber?: number;
  timestamp?: number;
  customData: Record<string, any>;  // Your custom data
}

interface AgentDecision {
  action: {
    type: string;          // 'ALLOW' | 'LIMIT' | 'BLOCK' | 'PAUSE'
    value?: any;
    reason?: string;
    severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  };
  reason: string;
  confidence: number;      // 0..1
  metadata?: Record<string, any>;
}
```

### Example: Withdrawal Risk Sentinel (SDK Version)

```typescript
import { BaseAgent } from '@sentinel/ai-agent-sdk';
import { AgentContext, AgentDecision } from '@sentinel/ai-agent-sdk';

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

### Example: Emergency Brake (SDK Version)

```typescript
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

---

## Step 5: Register Agents with SDK

```typescript
// Register built-in SDK agents
sdk.registerAgent('risk-monitor', new RiskMonitor());
sdk.registerAgent('emergency-brake-builtin', new EmergencyBrake());

// Register custom SimpleVault-specific agents
sdk.registerAgent('withdrawal-risk-sentinel', new WithdrawalRiskSentinel());
sdk.registerAgent('emergency-brake', new EmergencyBrakeAgent());
```

---

## Step 6: Subscribe to Vault Events

The SDK's `EventListener` automatically monitors on-chain events:

```typescript
// Monitor deposits and automatically run risk assessment
sdk.onContractEvent('simple-vault', 'Deposited', async (event) => {
  console.log('💰 Deposit detected:', {
    user: event.args.user,
    amount: event.args.amount.toString()
  });

  // Read current vault state
  const contract = await sdk.getContract('simple-vault');
  const balance = await contract.call('balances', [event.args.user]);
  const currentLimit = await contract.call('recommendedWithdrawLimit', [event.args.user]);

  // Execute agent decision
  const decision = await sdk.executeAgent('withdrawal-risk-sentinel', {
    contractId: 'simple-vault',
    user: event.args.user,
    customData: {
      balanceWei: balance,
      currentLimitWei: currentLimit
    }
  });

  console.log('🤖 Agent decision:', decision);

  // Apply decision to contract (if action required)
  if (decision.action.type === 'LIMIT') {
    await applyLimitToVault(event.args.user, decision.action.value, decision.reason);
  }
});

// Monitor withdrawals
sdk.onContractEvent('simple-vault', 'Withdrawn', async (event) => {
  console.log('💸 Withdrawal detected:', {
    user: event.args.user,
    amount: event.args.amount.toString()
  });

  // Re-evaluate limits after withdrawal
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
    await applyLimitToVault(event.args.user, decision.action.value, decision.reason);
  }
});
```

---

## Step 7: Apply Agent Decisions to SimpleVault

Helper function to write agent decisions back to the contract:

```typescript
async function applyLimitToVault(
  user: string,
  newLimit: string,
  reason: string
): Promise<void> {
  try {
    const contract = await sdk.getContract('simple-vault');

    // Call agentSetWithdrawLimit on SimpleVault
    const tx = await contract.send('agentSetWithdrawLimit', [
      user,
      newLimit,
      reason.substring(0, 200) // Ensure reason fits on-chain
    ]);

    await tx.wait();

    console.log('✅ Limit applied on-chain:', {
      user,
      newLimit,
      txHash: tx.hash
    });
  } catch (error) {
    console.error('❌ Failed to apply limit:', error);
    throw error;
  }
}
```

---

## Step 8: Add Policy Enforcement (Clamping)

The SDK's `PolicyEngine` ensures safety even if agents make bad decisions:

```typescript
// Add global clamping policy: never exceed 80% of balance
sdk.addPolicy({
  id: 'max-withdrawal-limit',
  name: 'Maximum Withdrawal Limit Policy',
  description: 'Ensures withdrawal limits never exceed 80% of balance',
  validate: (decision, context) => {
    const balance = BigInt(context.customData.balanceWei.toString());
    const proposedLimit = BigInt(decision.action.value?.toString() || '0');
    const maxAllowed = (balance * 80n) / 100n;

    return proposedLimit <= maxAllowed;
  },
  enforce: (decision, context) => {
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

// Add minimum confidence policy
sdk.addPolicy({
  id: 'min-confidence',
  name: 'Minimum Confidence Policy',
  description: 'Requires minimum 0.6 confidence for all decisions',
  validate: (decision) => decision.confidence >= 0.6,
  enforce: (decision) => ({
    ...decision,
    confidence: Math.max(decision.confidence, 0.6)
  })
});
```

---

## Step 9: Start the SDK

```typescript
// Start event monitoring
await sdk.start();
console.log('🚀 SimpleVault SDK integration active');
console.log('📡 Monitoring events: Deposited, Withdrawn');
console.log('🤖 Agents registered:', sdk.listAgents());
```

---

## Complete Integration Example

Here's a complete Express server integrating SimpleVault with the SDK:

```typescript
// server.ts
import express from 'express';
import { SentinelAgentSDK } from '@sentinel/ai-agent-sdk';
import { WithdrawalRiskSentinel, EmergencyBrakeAgent } from './agents';

const app = express();
app.use(express.json());

// Initialize SDK
const sdk = new SentinelAgentSDK({
  network: 'cronos-testnet',
  rpcUrl: process.env.CRONOS_RPC_URL!,
  privateKey: process.env.AGENT_PRIVATE_KEY!,
  aiProvider: 'openai',
  aiApiKey: process.env.OPENAI_API_KEY,
  audit: { enabled: true },
  logLevel: 'INFO'
});

// Register SimpleVault
await sdk.registerContract('simple-vault', {
  address: process.env.SIMPLE_VAULT_ADDRESS!,
  abi: SIMPLE_VAULT_ABI,
  network: 'cronos-testnet'
});

// Register agents
sdk.registerAgent('withdrawal-risk-sentinel', new WithdrawalRiskSentinel());
sdk.registerAgent('emergency-brake', new EmergencyBrakeAgent());

// Add policies
sdk.addPolicy({
  id: 'max-withdrawal-limit',
  name: 'Maximum Withdrawal Limit Policy',
  description: 'Ensures withdrawal limits never exceed 80% of balance',
  validate: (decision, context) => {
    const balance = BigInt(context.customData.balanceWei.toString());
    const proposedLimit = BigInt(decision.action.value?.toString() || '0');
    return proposedLimit <= (balance * 80n) / 100n;
  },
  enforce: (decision, context) => {
    const balance = BigInt(context.customData.balanceWei.toString());
    const proposedLimit = BigInt(decision.action.value?.toString() || '0');
    const maxAllowed = (balance * 80n) / 100n;

    if (proposedLimit > maxAllowed) {
      return {
        ...decision,
        action: { ...decision.action, value: maxAllowed.toString() }
      };
    }
    return decision;
  }
});

// Set up event listeners
sdk.onContractEvent('simple-vault', 'Deposited', async (event) => {
  const contract = await sdk.getContract('simple-vault');
  const balance = await contract.call('balances', [event.args.user]);
  const currentLimit = await contract.call('recommendedWithdrawLimit', [event.args.user]);

  const decision = await sdk.executeAgent('withdrawal-risk-sentinel', {
    contractId: 'simple-vault',
    user: event.args.user,
    customData: { balanceWei: balance, currentLimitWei: currentLimit }
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

// API Endpoints
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/agents', (req, res) => {
  res.json({ agents: sdk.listAgents() });
});

app.listen(3000, () => {
  console.log('🚀 SimpleVault SDK server running on port 3000');
});
```

---

## Key Differences: Standalone vs SDK Integration

| Aspect | Standalone SimpleVault | SDK-Wrapped SimpleVault |
|--------|------------------------|-------------------------|
| **Agent Interface** | Custom `AgentContext` & `AgentDecision` | SDK's standardized `AgentContext` & `AgentDecision` |
| **Event Monitoring** | Manual WebSocket setup | SDK's `EventListener` (automatic) |
| **Policy Enforcement** | Custom `clamp.ts` function | SDK's `PolicyEngine` (configurable) |
| **Contract Interaction** | Direct ethers.js calls | SDK's `ContractAdapter` (abstracted) |
| **Audit Trail** | Manual logging | SDK's built-in audit system |
| **AI Integration** | Custom OpenAI client | SDK's `AIProvider` (pluggable) |
| **Testing** | Manual test scripts | SDK's comprehensive test suite |
| **Reusability** | Vault-specific | Works with ANY contract |

---

## Benefits of SDK Integration

### 1. **Standardization**
- Consistent agent interface across all contracts
- Reusable agents for different protocols
- Unified event monitoring system

### 2. **Enterprise Features**
- Policy Pack system for versioned governance
- Control Plane integration for centralized management
- Comprehensive audit logging
- x402 payment integration

### 3. **Developer Experience**
- Type-safe TypeScript interfaces
- Extensive documentation
- Built-in testing framework
- React UI components

### 4. **Safety & Compliance**
- Multi-layer policy enforcement
- Cryptographic audit trail
- Configurable risk controls
- Fail-safe defaults

### 5. **Ecosystem Integration**
- NPM installable
- Works with any Cronos contract
- Extensible architecture
- Community-driven agent library

---

## Migration Path

### Phase 1: Parallel Operation
Run both standalone and SDK-wrapped systems side-by-side:
- Standalone handles production traffic
- SDK integration validates decisions
- Compare outputs for consistency

### Phase 2: Gradual Cutover
- Route 10% of traffic to SDK
- Monitor performance and accuracy
- Increase gradually to 100%

### Phase 3: Full SDK
- Deprecate standalone agent service
- Use SDK as primary system
- Maintain backward compatibility

---

## Testing the Integration

```bash
# 1. Deploy SimpleVault
cd /path/to/v3\ v001\ SimpleVaultsol/contracts
npx hardhat run scripts/deploy.ts --network cronos-testnet

# 2. Set environment variables
export SIMPLE_VAULT_ADDRESS=0x123...
export AGENT_PRIVATE_KEY=0xabc...
export CRONOS_RPC_URL=https://evm-t3.cronos.org
export OPENAI_API_KEY=sk-...

# 3. Install SDK
npm install @sentinel/ai-agent-sdk

# 4. Run integration server
npm run dev

# 5. Test agent execution
curl -X POST http://localhost:3000/agents/apply \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "withdrawal-risk-sentinel",
    "user": "0xYourAddress",
    "riskTrigger": "NONE"
  }'
```

---

## Conclusion

Wrapping SimpleVault with the Cronos AI Agent SDK provides:

✅ **Enterprise-grade infrastructure** for agent management
✅ **Reusable architecture** that works with any contract
✅ **Advanced features** like policy packs and control plane
✅ **Better developer experience** with standardized interfaces
✅ **Ecosystem compatibility** for broader adoption

The SDK transforms SimpleVault from a standalone application into a reference implementation that demonstrates best practices for AI agent integration on Cronos.
```

