# Agents vs. Components - Complete Guide

## 🎯 Quick Summary

The Cronos AI Agent SDK consists of two distinct categories:

| Category | Count | Purpose | Can You Build More? |
|----------|-------|---------|-------------------|
| **Agents** | 5 built-in + unlimited custom | Make decisions and recommendations | ✅ Yes - extend BaseAgent |
| **Components** | 8 core systems | Provide infrastructure and services | ❌ No - part of SDK core |

---

## 🤖 AGENTS (Decision-Making Entities)

**Definition:** Agents are intelligent decision-makers that analyze data and return recommendations. They extend the `BaseAgent` class and implement the `decide()` method.

### 5 Built-in Agents (Production-Ready)

#### 1. RiskMonitor
- **Purpose:** Risk assessment and collateral monitoring
- **Actions:** ALLOW, LIMIT, BLOCK
- **Use Case:** DeFi lending, vault protection
- **File:** `packages/core/src/agents/builtin/RiskMonitor.ts`

#### 2. LiquidityOptimizer
- **Purpose:** Liquidity allocation optimization
- **Actions:** ADD, REMOVE, HOLD
- **Use Case:** DEX pools, AMM rebalancing
- **File:** `packages/core/src/agents/builtin/LiquidityOptimizer.ts`

#### 3. EmergencyBrake
- **Purpose:** Emergency circuit breaker
- **Actions:** PAUSE, RESUME
- **Use Case:** Protocol-wide emergency stops
- **File:** `packages/core/src/agents/builtin/EmergencyBrake.ts`

#### 4. ThresholdGuard
- **Purpose:** Min/max limit enforcement
- **Actions:** APPROVE, REJECT
- **Use Case:** Transaction limits, caps
- **File:** `packages/core/src/agents/builtin/ThresholdGuard.ts`

#### 5. AnomalyDetector
- **Purpose:** Statistical pattern detection
- **Actions:** NORMAL, ANOMALY_DETECTED (LOW/MEDIUM/HIGH)
- **Use Case:** Fraud detection, wash trading
- **File:** `packages/core/src/agents/builtin/AnomalyDetector.ts`

### Example Custom Agent

#### GeniusActComplianceAgent
- **Purpose:** Regulatory compliance validation
- **Actions:** ALLOW, BLOCK
- **Use Case:** Token transaction compliance
- **File:** `packages/core/src/agents/GeniusActComplianceAgent.ts`
- **Note:** Example showing how to build custom agents

### Custom Agent Framework (Unlimited)

You can build unlimited custom agents using the framework. See `CUSTOM_AGENT_TYPES.md` for 10 detailed patterns:

1. **BasicCustomAgent** - Simple validation logic
2. **ThresholdAgent** - Multi-level threshold validation
3. **AIAgent** - OpenAI-powered decisions
4. **StatefulAgent** - Tracks user behavior over time
5. **MultiConditionAgent** - Complex business rules
6. **TimeBasedAgent** - Time-aware decisions
7. **ExternalAPIAgent** - Integrates external services
8. **CompositeAgent** - Combines multiple agents
9. **MLAgent** - Machine learning predictions
10. **EventDrivenAgent** - Reacts to blockchain events

**How to create:**
```typescript
import { BaseAgent } from '@sentinel/ai-agent-sdk';

export class MyCustomAgent extends BaseAgent {
  config = {
    id: 'my-agent',
    name: 'My Custom Agent',
    description: 'Does something useful',
    version: '1.0.0'
  };

  async decide(context) {
    // Your decision logic here
    return {
      action: { type: 'ALLOW' },
      reason: 'Custom logic passed',
      confidence: 0.9
    };
  }
}
```

---

## 🏗️ COMPONENTS (Infrastructure Systems)

**Definition:** Components are SDK infrastructure systems that provide services to agents and applications. They are NOT decision-makers.

### 1. Policy System
**Location:** `packages/core/src/policies/`

**Purpose:** Governance and compliance layer that validates/modifies agent decisions

**Key Classes:**
- `PolicyEngine` - Enforces rules on agent decisions
- `Policy` - Individual validation rules
- `PolicyPack` - Versioned policy bundles

**What it does:**
- Validates agent decisions against rules
- Enforces constraints (min/max values, etc.)
- Applies centralized governance policies
- Supports both traditional policies and policy packs

**Example:**
```typescript
sdk.policyEngine.addPolicy({
  id: 'max-withdrawal',
  validate: (decision) => decision.action.value <= 1000,
  enforce: (decision) => ({ ...decision, action: { ...decision.action, value: Math.min(decision.action.value, 1000) }})
});
```

---

### 2. Control Plane
**Location:** `packages/core/src/control-plane/`

**Purpose:** Centralized management, policy distribution, and decision auditing

**Key Classes:**
- `ControlPlaneClient` - Connects to centralized management
- `MockControlPlaneClient` - Testing implementation

**What it does:**
- Identifies runtime instances
- Pulls policy packs from central server
- Pushes decision records for audit
- Collects telemetry and metrics

**Example:**
```typescript
const controlPlane = new MockControlPlaneClient();
const sdk = new SentinelAgentSDK({
  network: 'cronos-testnet',
  controlPlane,
  runtime: {
    appName: 'my-dapp',
    env: 'production',
    version: '1.0.0'
  }
});
```

---

### 3. Payment System (x402)
**Location:** `packages/core/src/payments/`

**Purpose:** Monetization and pay-per-use functionality with HTTP 402 support

**Key Classes:**
- `PaymentManager` - Handles payment processing with retry logic
- `UsageTracker` - Tracks API usage and billing metrics
- `MobileWalletManager` - Apple Pay & Google Pay integration
- `EnterpriseConnector` - SAP, QuickBooks, Oracle ERP integration
- `CronosProvider` - Native CRO payments on Cronos Network
- `ErrorHandler` - Automatic 402 error detection and handling

**What it does:**
- Processes payments with multiple providers
- Automatically retries failed payments (exponential backoff)
- Tracks usage for billing
- Verifies payment transactions
- Handles 402 Payment Required errors

**Example:**
```typescript
const sdk = new SentinelAgentSDK({
  network: 'cronos-mainnet',
  payments: {
    enabled: true,
    providers: [
      new CronosProvider({ apiKey: 'your-key' }),
      new MobileWalletManager({ applePay: true, googlePay: true })
    ],
    defaultProvider: 'cronos',
    retryConfig: { maxAttempts: 3, baseDelay: 1000 }
  }
});
```

**Test Coverage:** 9/12 tests passing (75% coverage)

---

### 4. Contract System
**Location:** `packages/core/src/contracts/`

**Purpose:** Blockchain integration and smart contract interaction

**Key Classes:**
- `ContractRegistry` - Manages smart contract connections
- `ContractAdapter` - Interfaces with blockchain contracts

**What it does:**
- Registers smart contracts with the SDK
- Provides ethers.js integration
- Manages contract instances
- Validates contract configurations

**Example:**
```typescript
await sdk.registerContract('vault', {
  address: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
  abi: vaultABI,
  network: 'cronos-mainnet'
});
```

---

### 5. Event System
**Location:** `packages/core/src/events/`

**Purpose:** Real-time blockchain event monitoring and webhook handling

**Key Classes:**
- `EventListener` - Monitors blockchain events
- `WebhookHandler` - Handles incoming webhooks

**What it does:**
- Listens to smart contract events
- Triggers agent execution on events
- Processes webhooks from external services
- Provides event filtering and routing

**Example:**
```typescript
sdk.onContractEvent('vault', 'Deposited', async (event) => {
  const decision = await sdk.executeAgent('risk-monitor', {
    contractId: 'vault',
    user: event.args.user,
    customData: { balance: event.args.amount }
  });
});
```

---

### 6. API Server
**Location:** `packages/core/src/api/`

**Purpose:** HTTP REST API for external integrations

**Key Classes:**
- `APIServer` - REST API endpoints
- `ExpressAdapter` - Express.js integration

**What it does:**
- Exposes SDK functionality via REST API
- Provides endpoints for agent execution
- Handles HTTP requests/responses
- Supports webhook endpoints

**Example:**
```typescript
await sdk.startAPIServer({ port: 3000 });

// POST http://localhost:3000/agents/risk-monitor/execute
// Body: { contractId: 'vault', user: '0x...', customData: {...} }
```

---

### 7. AI Integration
**Location:** `packages/core/src/ai/`

**Purpose:** Optional AI-powered decision making with OpenAI

**Key Classes:**
- `OpenAIProvider` - OpenAI API integration

**What it does:**
- Integrates with OpenAI GPT models
- Provides AI-powered analysis
- Supports custom prompts
- Optional feature (not required)

**Example:**
```typescript
const sdk = new SentinelAgentSDK({
  network: 'cronos-testnet',
  aiProvider: 'openai',
  aiApiKey: process.env.OPENAI_API_KEY,
  aiModel: 'gpt-4'
});
```

---

### 8. Audit System
**Location:** `packages/core/src/audit/`

**Purpose:** Compliance and cryptographic decision tracking

**Key Types:**
- `DecisionRecord` - Cryptographic audit trail
- `AuditConfig` - Audit configuration

**What it does:**
- Records all agent decisions
- Creates cryptographic hashes
- Supports data redaction
- Enables compliance auditing
- Pushes records to Control Plane

**Example:**
```typescript
const sdk = new SentinelAgentSDK({
  network: 'cronos-testnet',
  audit: {
    enabled: true,
    redact: (context) => ({
      ...context,
      sensitiveData: '[REDACTED]'
    })
  }
});
```

---

## 📐 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      SentinelAgentSDK                             │
│                   (Main Orchestrator)                           │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
  │   AGENTS     │    │  COMPONENTS  │    │ INTEGRATIONS │
  │ (Decision)   │    │ (Infra)      │    │ (External)   │
  └──────────────┘    └──────────────┘    └──────────────┘
  │                   │                   │
  ├─ RiskMonitor     ├─ PolicyEngine     ├─ Blockchain
  ├─ Liquidity...    ├─ PaymentManager   ├─ OpenAI
  ├─ Emergency...    ├─ ControlPlane     ├─ External APIs
  ├─ Threshold...    ├─ ContractRegistry └─ Webhooks
  ├─ Anomaly...      ├─ EventListener
  └─ Custom Agents   ├─ APIServer
                     ├─ AuditSystem
                     └─ AI Provider
```

---

## 🎭 Key Differences

| Aspect | Agents | Components |
|--------|--------|------------|
| **Purpose** | Make decisions | Provide services |
| **Base Class** | Extend `BaseAgent` | Part of SDK core |
| **Main Method** | `decide()` | Various service methods |
| **Output** | `AgentDecision` | Service-specific |
| **Registration** | `sdk.registerAgent()` | Always available |
| **Customizable** | ✅ Yes - build unlimited | ❌ No - use as-is |
| **Examples** | RiskMonitor, ThresholdGuard | PolicyEngine, PaymentManager |

---

## ✅ Correct Terminology

### Use "Agents" for:
- RiskMonitor
- LiquidityOptimizer
- EmergencyBrake
- ThresholdGuard
- AnomalyDetector
- GeniusActComplianceAgent
- Any custom decision-makers you build

### Use "Components" or "SDK Systems" for:
- Policy System
- Control Plane
- Payment System (x402)
- Contract System
- Event System
- API Server
- AI Integration
- Audit System

### ❌ Don't Say:
- "Policy Agent" → Say "Policy System" or "Policy Component"
- "Payment Agent" → Say "Payment System" or "Payment Manager"
- "Control Plane Agent" → Say "Control Plane Client"

---

## 📚 Related Documentation

- **[Built-in Agents](./agents/README.md)** - Complete guide to all 5 built-in agents
- **[Custom Agent Types](../CUSTOM_AGENT_TYPES.md)** - 10 patterns for building custom agents
- **[Policy Guide](../PolicyGuide.md)** - Policy System documentation
- **[X402 Payment System](../X402_README.md)** - Payment component documentation
- **[Architecture Guide](../ARCHITECTURE_GUIDE.md)** - Complete SDK architecture

---

## 💡 Summary

**Agents = Decision-Makers (5 built-in + unlimited custom)**
- Analyze data
- Return recommendations
- Are advisory (don't execute)
- Can be custom-built

**Components = Infrastructure (8 core systems)**
- Provide services
- Support agents
- Part of SDK core
- Can't be customized (use as-is)

**Total SDK Capabilities:**
- 5 production-ready agents
- 8 infrastructure components
- Unlimited custom agent framework
- Complete DeFi automation toolkit

