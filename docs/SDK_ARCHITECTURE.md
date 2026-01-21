# Cronos AI Agent SDK - Complete Architecture

## 🏗️ System Overview

The Cronos AI Agent SDK is a **protocol-agnostic AI automation toolkit** for Cronos EVM that consists of two main categories:

1. **Agents** (Decision-Making Layer) - 5 built-in + unlimited custom
2. **Components** (Infrastructure Layer) - 8 core systems

---

## 📐 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Your Application                           │
│                  (DeFi Protocol, DEX, NFT, etc.)                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SentinelAgentSDK                               │
│                   (Main Orchestrator)                           │
│                                                                 │
│  - Registers agents and contracts                              │
│  - Executes agent decisions                                    │
│  - Applies policies                                            │
│  - Handles payments                                            │
│  - Audits decisions                                            │
└─────────────────────────────────────────────────────────────────┘
          │                   │                   │
          ▼                   ▼                   ▼
  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
  │   AGENTS     │    │  COMPONENTS  │    │ INTEGRATIONS │
  │ (Decision)   │    │ (Infra)      │    │ (External)   │
  └──────────────┘    └──────────────┘    └──────────────┘
  │                   │                   │
  ├─ RiskMonitor     ├─ PolicyEngine     ├─ Cronos EVM
  ├─ Liquidity...    ├─ PaymentManager   ├─ OpenAI
  ├─ Emergency...    ├─ ControlPlane     ├─ External APIs
  ├─ Threshold...    ├─ ContractRegistry ├─ Webhooks
  ├─ Anomaly...      ├─ EventListener    └─ Mobile Wallets
  └─ Custom Agents   ├─ APIServer
                     ├─ AuditSystem
                     └─ AI Provider
```

---

## 🤖 Agent Layer (Decision-Making)

### Purpose
Agents analyze data and return recommendations. They **do not** execute transactions.

### 5 Built-in Agents

| Agent | File | Purpose | Actions |
|-------|------|---------|---------|
| RiskMonitor | `packages/core/src/agents/builtin/RiskMonitor.ts` | Risk assessment | ALLOW, LIMIT, BLOCK |
| LiquidityOptimizer | `packages/core/src/agents/builtin/LiquidityOptimizer.ts` | Liquidity management | ADD, REMOVE, HOLD |
| EmergencyBrake | `packages/core/src/agents/builtin/EmergencyBrake.ts` | Circuit breaker | PAUSE, RESUME |
| ThresholdGuard | `packages/core/src/agents/builtin/ThresholdGuard.ts` | Limit enforcement | APPROVE, REJECT |
| AnomalyDetector | `packages/core/src/agents/builtin/AnomalyDetector.ts` | Pattern detection | NORMAL, ANOMALY_DETECTED |

### Example Custom Agent

**GeniusActComplianceAgent** (`packages/core/src/agents/GeniusActComplianceAgent.ts`)
- Validates token transactions against Genius Act regulations
- Shows how to build custom agents
- Extends BaseAgent class

### Custom Agent Framework

Developers can build unlimited custom agents using the framework. See `CUSTOM_AGENT_TYPES.md` for 10 patterns:

1. BasicCustomAgent
2. ThresholdAgent
3. AIAgent (OpenAI-powered)
4. StatefulAgent
5. MultiConditionAgent
6. TimeBasedAgent
7. ExternalAPIAgent
8. CompositeAgent
9. MLAgent (Machine Learning)
10. EventDrivenAgent

### Agent Base Class

All agents extend `BaseAgent`:

```typescript
export abstract class BaseAgent {
  abstract config: AgentConfig;
  abstract decide(context: AgentContext): Promise<AgentDecision>;
  
  getId(): string { return this.config.id; }
  getName(): string { return this.config.name; }
  getVersion(): string { return this.config.version; }
  protected validateContext(context: AgentContext): void { ... }
}
```

### Decision Flow

```
┌──────────────┐
│ Agent Input  │ AgentContext { contractId, user, timestamp, customData }
└──────────────┘
       │
       ▼
┌──────────────┐
│ Agent Logic  │ analyze(context) → decision logic
└──────────────┘
       │
       ▼
┌──────────────┐
│ Agent Output │ AgentDecision { action, reason, confidence, metadata }
└──────────────┘
       │
       ▼
┌──────────────┐
│ Your Code    │ Interprets decision → Executes (or not)
└──────────────┘
```

**Key Principle:** Agents are **advisory** (recommend), not **executive** (execute).

---

## 🏗️ Component Layer (Infrastructure)

### Purpose
Components provide services to agents and applications. They are part of the SDK core.

### 8 Core Components

#### 1. Policy System
**Location:** `packages/core/src/policies/`

**Classes:**
- `PolicyEngine` - Enforces rules on agent decisions
- `Policy` - Individual validation rules
- `PolicyPack` - Versioned policy bundles

**Responsibilities:**
- Validate agent decisions against rules
- Enforce constraints (min/max values, etc.)
- Apply centralized governance policies
- Support both traditional policies and policy packs

---

#### 2. Control Plane
**Location:** `packages/core/src/control-plane/`

**Classes:**
- `ControlPlaneClient` - Interface for centralized management
- `MockControlPlaneClient` - Testing implementation

**Responsibilities:**
- Identify runtime instances
- Pull policy packs from central server
- Push decision records for audit
- Collect telemetry and metrics

---

#### 3. Payment System (x402)
**Location:** `packages/core/src/payments/`

**Classes:**
- `PaymentManager` - Handles payment processing
- `UsageTracker` - Tracks API usage
- `MobileWalletManager` - Apple Pay & Google Pay
- `EnterpriseConnector` - SAP, QuickBooks, Oracle ERP
- `CronosProvider` - Native CRO payments
- `ErrorHandler` - Automatic 402 error handling

**Responsibilities:**
- Process payments with multiple providers
- Retry failed payments (exponential backoff)
- Track usage for billing
- Verify payment transactions
- Handle 402 Payment Required errors

**Test Coverage:** 9/12 tests passing (75%)

---

#### 4. Contract System
**Location:** `packages/core/src/contracts/`

**Classes:**
- `ContractRegistry` - Manages smart contract connections
- `ContractAdapter` - Interfaces with blockchain contracts

**Responsibilities:**
- Register smart contracts with the SDK
- Provide ethers.js integration
- Manage contract instances
- Validate contract configurations

---

#### 5. Event System
**Location:** `packages/core/src/events/`

**Classes:**
- `EventListener` - Monitors blockchain events
- `WebhookHandler` - Handles incoming webhooks

**Responsibilities:**
- Listen to smart contract events
- Trigger agent execution on events
- Process webhooks from external services
- Provide event filtering and routing

---

#### 6. API Server
**Location:** `packages/core/src/api/`

**Classes:**
- `APIServer` - REST API endpoints
- `ExpressAdapter` - Express.js integration

**Responsibilities:**
- Expose SDK functionality via REST API
- Provide endpoints for agent execution
- Handle HTTP requests/responses
- Support webhook endpoints

**Endpoints:**
- `POST /agents/:agentId/execute` - Execute an agent
- `GET /agents` - List registered agents
- `POST /webhooks/:contractId/:eventName` - Receive webhook

---

#### 7. AI Integration
**Location:** `packages/core/src/ai/`

**Classes:**
- `OpenAIProvider` - OpenAI API integration

**Responsibilities:**
- Integrate with OpenAI GPT models
- Provide AI-powered analysis
- Support custom prompts
- Optional feature (not required)

---

#### 8. Audit System
**Location:** `packages/core/src/audit/`

**Types:**
- `DecisionRecord` - Cryptographic audit trail
- `AuditConfig` - Audit configuration

**Responsibilities:**
- Record all agent decisions
- Create cryptographic hashes (SHA-256)
- Support data redaction
- Enable compliance auditing
- Push records to Control Plane

---

## 🔄 Complete Execution Flow

### 1. Setup Phase
```
Application → SentinelAgentSDK.constructor()
  ├─ Initialize PolicyEngine
  ├─ Initialize PaymentManager
  ├─ Initialize ContractRegistry
  ├─ Initialize EventListener
  ├─ Initialize AuditSystem
  └─ Connect to ControlPlane
```

### 2. Registration Phase
```
Application → sdk.registerAgent('risk', new RiskMonitor())
  └─ Agent stored in internal registry

Application → sdk.registerContract('vault', { address, abi })
  └─ Contract stored in ContractRegistry
```

### 3. Execution Phase
```
Application → sdk.executeAgent('risk', context)
  │
  ├─ 1. Validate context
  │
  ├─ 2. Agent.decide(context)
  │    └─ Returns AgentDecision
  │
  ├─ 3. PolicyEngine.enforce(decision)
  │    └─ Applies policies, returns modified decision
  │
  ├─ 4. PaymentManager.processPayment() [if enabled]
  │    └─ Handles 402 errors, retries
  │
  ├─ 5. AuditSystem.recordDecision() [if enabled]
  │    ├─ Create cryptographic hashes
  │    └─ Push to ControlPlane
  │
  └─ 6. Return final decision to application
```

### 4. Event-Driven Phase
```
Blockchain → Contract emits event
  │
  ├─ EventListener detects event
  │
  ├─ Triggers registered callback
  │
  └─ Application → sdk.executeAgent()
       └─ (Goes through Execution Phase)
```

---

## 📊 Data Flow Diagram

```
┌─────────────┐
│ Blockchain  │
│   Events    │
└─────────────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Event     │────▶│ Application │────▶│    Agent    │
│  Listener   │     │    Code     │     │   decide()  │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │   Policy    │
                                        │   Engine    │
                                        └─────────────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │   Payment   │
                                        │   Manager   │
                                        └─────────────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │    Audit    │
                                        │   System    │
                                        └─────────────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │ Application │
                                        │   Receives  │
                                        │  Decision   │
                                        └─────────────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │ Application │
                                        │  Executes   │
                                        │ Transaction │
                                        └─────────────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │ Blockchain  │
                                        │    State    │
                                        │   Change    │
                                        └─────────────┘
```

---

## 🔐 Security Architecture

### Separation of Concerns

```
┌─────────────────────────────────────────────────────────┐
│                    Security Layers                      │
├─────────────────────────────────────────────────────────┤
│ Layer 1: Agent Decision (Read-Only)                    │
│   - Agents analyze data                                │
│   - No wallet access                                   │
│   - No transaction execution                           │
├─────────────────────────────────────────────────────────┤
│ Layer 2: Policy Enforcement (Validation)               │
│   - Validates decisions                                │
│   - Enforces constraints                               │
│   - Applies governance rules                           │
├─────────────────────────────────────────────────────────┤
│ Layer 3: Application Logic (Decision Point)            │
│   - Interprets agent recommendations                   │
│   - Decides whether to execute                         │
│   - Can require human approval                         │
├─────────────────────────────────────────────────────────┤
│ Layer 4: Transaction Execution (Write)                 │
│   - Application code executes                          │
│   - Wallet signs transaction                           │
│   - Blockchain state changes                           │
└─────────────────────────────────────────────────────────┘
```

### Key Security Features

1. **Agents are Read-Only**
   - No private key access
   - No transaction signing
   - Only data analysis

2. **Policy Enforcement**
   - Centralized governance
   - Versioned policy packs
   - Cryptographic signatures

3. **Audit Trail**
   - All decisions recorded
   - Cryptographic hashes (SHA-256)
   - Tamper-evident

4. **Payment Security**
   - Retry logic prevents double-spending
   - Transaction verification
   - Multiple provider support

---

## 📦 Package Structure

```
cronos-ai-agent-sdk/
├── packages/
│   ├── core/                          # Main SDK
│   │   ├── src/
│   │   │   ├── agents/
│   │   │   │   ├── builtin/          # 5 built-in agents
│   │   │   │   ├── BaseAgent.ts      # Agent base class
│   │   │   │   └── GeniusActComplianceAgent.ts
│   │   │   ├── policies/             # Policy System
│   │   │   ├── control-plane/        # Control Plane
│   │   │   ├── payments/             # Payment System
│   │   │   ├── contracts/            # Contract System
│   │   │   ├── events/               # Event System
│   │   │   ├── api/                  # API Server
│   │   │   ├── ai/                   # AI Integration
│   │   │   ├── audit/                # Audit System
│   │   │   └── SentinelAgentSDK.ts     # Main orchestrator
│   │   └── package.json
│   ├── ui/                            # React components
│   └── examples/                      # Working demos
└── docs/                              # Documentation
```

---

## 🎯 Design Principles

### 1. Protocol-Agnostic
Works with any smart contract protocol on Cronos EVM.

### 2. Type-Safe
Fully typed with TypeScript for compile-time safety.

### 3. Modular
Each component can be used independently or together.

### 4. Extensible
Build unlimited custom agents using the framework.

### 5. Production-Ready
80%+ test coverage, comprehensive error handling.

### 6. Developer-Friendly
Simple API, clear documentation, working examples.

---

## 📚 Related Documentation

- **[Agents vs Components](./AGENTS_VS_COMPONENTS.md)** - Understanding the distinction
- **[Built-in Agents](./agents/README.md)** - All 5 agents documented
- **[SDK Components Guide](./SDK_COMPONENTS_GUIDE.md)** - All 8 components
- **[Quick Reference](./QUICK_REFERENCE.md)** - Cheat sheet
- **[Custom Agent Types](../CUSTOM_AGENT_TYPES.md)** - 10 custom agent patterns
- **[Policy Guide](../PolicyGuide.md)** - Policy system details
- **[X402 Payment System](../X402_README.md)** - Payment component details

---

## 💡 Summary

The Cronos AI Agent SDK is a complete DeFi automation platform with:

- **5 built-in agents** + unlimited custom agents
- **8 core components** providing infrastructure
- **Protocol-agnostic** design for any Cronos EVM protocol
- **Production-ready** with 80%+ test coverage
- **Type-safe** TypeScript implementation
- **Extensible** framework for custom agents

**Get Started:** `npm install @sentinel/ai-agent-sdk`

