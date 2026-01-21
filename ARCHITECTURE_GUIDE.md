# Architecture Guide - Understanding the File Structure

## 📁 Project Overview

```
v5/                                    ← ROOT (You are here)
├── package.json                       ← Root config (manages all packages)
├── package-lock.json                  ← Dependency lock file
├── README.md                          ← Main documentation
├── .gitignore                         ← Git ignore rules
│
├── packages/                          ← All code lives here
│   ├── core/                          ← 🎯 THE SDK (main package)
│   ├── ui/                            ← 🎨 React components (optional)
│   ├── examples/                      ← 📚 Example apps
│   │   ├── standalone-test/           ← Agent testing without contracts
│   │   ├── vault-automation/          ← DeFi vault example
│   │   ├── dex-liquidity/             ← DEX liquidity management
│   │   └── ui-demo/                   ← React UI showcase
│   ├── examples02/                    ← 💼 Commercial demos
│   │   └── defi-dashboard/            ← Revenue-focused dashboard
│   └── exampleboltdemo/               ← 🚀 Marketing demo site
│
├── docs/                              ← 📖 Additional documentation
│   ├── getting-started.md
│   ├── api-reference.md
│   ├── custom-agents.md
│   └── wiki/                          ← Documentation wiki
│
├── 📋 Documentation Files (Root Level)
├── AGENTS_SDK.md                      ← Complete agent inventory
├── AGENTS_FEATURES.md                 ← Future agent roadmap
├── ARCHITECTURE_GUIDE.md              ← This file
├── CUSTOM_AGENT_TYPES.md              ← Custom agent development
├── UIDifferences.md                   ← UI implementation comparison
├── HOW_IT_WORKS.md                    ← SDK functionality explained
├── HOW_IT_WORKS_SIMPLE.md             ← Simplified explanation
├── USER_STORIES.md                    ← Real-world examples
├── QUICK_START.md                     ← Fast setup guide
├── SETUP_GUIDE.md                     ← Detailed setup instructions
├── INSTALL_GUIDE.md                   ← Installation guide
├── BUILD_AND_RUN.md                   ← Build process guide
├── BUILD_TEST_STEPS.md                ← Testing procedures
├── TESTING_WIKI.md                    ← Testing documentation
├── UI_TESTING_GUIDE.md                ← UI testing guide
├── SYSTEM_STATUS.md                   ← Current system status
├── COMMERCIALIZATION_SUMMARY.md       ← Business model overview
├── system-test.js                     ← System testing script
├── test-all.js                        ← Comprehensive test runner
├── test-core-ui.js                    ← Core UI testing
└── 📊 Status & Analysis Files
    ├── q-dev-chat-*.md                ← Development chat logs
    ├── TEST_RESULTS*.md               ← Test result summaries
    └── possdomainnames.md             ← Domain name options
```

---

## 🎯 Package 1: Core SDK (The Brain)

**Location:** `packages/core/`  
**What it is:** The main SDK that developers install via NPM  
**Published as:** `@sentinel/ai-agent-sdk`

```
packages/core/
├── package.json                       ← Dependencies & scripts
├── tsconfig.json                      ← TypeScript config
├── jest.config.js                     ← Test config
│
├── src/                               ← SOURCE CODE
│   ├── index.ts                       ← 🚪 MAIN ENTRY (exports everything)
│   ├── SentinelAgentSDK.ts             ← 🧠 MAIN CLASS (the SDK itself)
│   │
│   ├── agents/                        ← Agent system
│   │   ├── BaseAgent.ts              ← Abstract class for all agents
│   │   ├── AgentRegistry.ts          ← Manages registered agents
│   │   ├── types.ts                  ← TypeScript types
│   │   ├── builtin/                  ← 5 pre-built agents
│   │   │   ├── RiskMonitor.ts
│   │   │   ├── LiquidityOptimizer.ts
│   │   │   ├── EmergencyBrake.ts
│   │   │   ├── ThresholdGuard.ts
│   │   │   └── AnomalyDetector.ts
│   │   └── __tests__/                ← Agent tests
│   │
│   ├── contracts/                     ← Contract management
│   │   ├── ContractRegistry.ts       ← Manages registered contracts
│   │   ├── ContractAdapter.ts        ← Wraps ethers.js Contract
│   │   └── types.ts
│   │
│   ├── events/                        ← Event listening system
│   │   ├── EventListener.ts          ← Listens to blockchain events
│   │   └── types.ts
│   │
│   ├── policies/                      ← Policy enforcement
│   │   ├── PolicyEngine.ts           ← Validates & enforces policies
│   │   └── types.ts
│   │
│   ├── ai/                            ← AI integration (optional)
│   │   ├── OpenAIProvider.ts         ← OpenAI integration
│   │   └── types.ts
│   │
│   ├── api/                           ← REST API server
│   │   ├── APIServer.ts              ← Express-based API server
│   │   ├── ExpressAdapter.ts         ← Express middleware adapter
│   │   ├── WebhookHandler.ts         ← Webhook event processing
│   │   ├── example.ts                ← API usage examples
│   │   └── types.ts                  ← API request/response types
│   │
│   ├── payments/                      ← Payment processing system
│   │   ├── PaymentManager.ts         ← Main payment orchestrator
│   │   ├── MobileWalletManager.ts    ← Apple/Google Pay integration
│   │   ├── EnterpriseConnector.ts    ← SAP/Oracle/QuickBooks integration
│   │   ├── UsageTracker.ts           ← Usage-based billing
│   │   ├── ErrorHandler.ts           ← Payment error handling
│   │   ├── providers/
│   │   │   └── CronosProvider.ts     ← Cronos blockchain payments
│   │   └── types.ts                  ← Payment interfaces
│   │
│   ├── control-plane/                 ← Enterprise management
│   │   ├── ControlPlaneClient.ts     ← Remote policy management
│   │   └── MockControlPlaneClient.ts ← Testing mock
│   │
│   ├── policy-pack/                   ← Advanced policy system
│   │   ├── verifier.ts               ← Policy pack verification
│   │   ├── MockPolicyPackVerifier.ts ← Testing mock
│   │   ├── NoopPolicyPackVerifier.ts ← Disabled verification
│   │   └── types.ts                  ← Policy pack interfaces
│   │
│   ├── audit/                         ← Audit and compliance
│   │   └── types.ts                  ← Audit trail interfaces
│   │
│   └── utils/                         ← Utilities
│       ├── logger.ts                 ← Logging system
│       ├── hash.ts                   ← Cryptographic hashing
│       └── stableStringify.ts        ← Deterministic JSON serialization
│
└── dist/                              ← 📦 COMPILED OUTPUT (after build)
    └── index.js                       ← What gets published to NPM
```

### How Core SDK Works:

```typescript
// 1. Import from index.ts
import { SentinelAgentSDK, RiskMonitor } from '@sentinel/ai-agent-sdk';

// 2. SentinelAgentSDK.ts creates instance
const sdk = new SentinelAgentSDK({ /* config */ });

// 3. AgentRegistry.ts stores agents
sdk.registerAgent('risk', new RiskMonitor());

// 4. ContractRegistry.ts stores contracts
await sdk.registerContract('vault', { /* config */ });

// 5. EventListener.ts monitors blockchain
sdk.onContractEvent('vault', 'Deposited', handler);

// 6. PolicyEngine.ts validates decisions
sdk.addPolicy({ /* policy */ });

// 7. APIServer.ts exposes REST endpoints
sdk.startAPIServer({ port: 3000 });

// 8. PaymentManager.ts handles transactions
sdk.processPayment({ amount: 100, currency: 'CRO' });

// 9. ControlPlaneClient.ts syncs enterprise policies
sdk.syncPolicies();
```

### Enterprise Features:

**API Server Module (`api/`)**
- REST API endpoints for agent execution
- Webhook handlers for external integrations
- Express.js adapter for custom middleware
- Request/response validation

**Payment System (`payments/`)**
- Multi-provider payment processing
- Mobile wallet integration (Apple Pay, Google Pay)
- Enterprise ERP connectors (SAP, Oracle, QuickBooks)
- Usage-based billing and tracking
- Automatic retry and error handling

**Control Plane (`control-plane/`)**
- Remote policy management
- Runtime identification and registration
- Decision record auditing
- Telemetry collection
- Enterprise governance

**Policy Packs (`policy-pack/`)**
- Signed policy bundles
- Cryptographic verification
- Version management
- Scope-based rule enforcement
- Priority-based rule resolution

**Audit System (`audit/`)**
- Decision trail logging
- Compliance reporting
- Immutable audit records
- Regulatory compliance support

---

## 🎨 Package 2: UI Components (Optional)

**Location:** `packages/ui/`  
**What it is:** React components for visual management  
**Published as:** `@cronos/ai-agent-ui`

```
packages/ui/
├── package.json
├── tsconfig.json
│
├── src/
│   ├── index.ts                       ← Exports all components
│   │
│   ├── components/                    ← React components
│   │   ├── Dashboard/
│   │   │   └── Dashboard.tsx         ← Metrics overview
│   │   ├── AgentConsole/
│   │   │   └── AgentConsole.tsx      ← Execute agents manually
│   │   ├── EventMonitor/
│   │   │   └── EventMonitor.tsx      ← Real-time event feed
│   │   ├── ContractRegistry/
│   │   │   └── ContractRegistry.tsx  ← Register contracts
│   │   └── PolicyManager/
│   │       └── PolicyManager.tsx     ← Manage policies
│   │
│   └── hooks/                         ← React hooks
│       ├── useAgentSDK.ts            ← Initialize SDK
│       └── useAgentExecution.ts      ← Execute agents
│
└── dist/                              ← Compiled React components
```

### How UI Works:

```typescript
// 1. Import components
import { Dashboard, AgentConsole, useAgentSDK } from '@cronos/ai-agent-ui';

// 2. useAgentSDK hook creates SDK instance
const { sdk, isReady } = useAgentSDK({ /* config */ });

// 3. Pass SDK to components
<Dashboard sdk={sdk} />
<AgentConsole sdk={sdk} />
```

---

## 📚 Package 3: Examples

**Location:** `packages/examples/`  
**What it is:** Working examples showing how to use the SDK

```
packages/examples/
│
├── standalone-test/                   ← ✅ Test without contracts
│   ├── package.json
│   ├── test-agents.ts                ← Tests all 5 agents
│   └── README.md
│
├── vault-automation/                  ← DeFi vault example
│   ├── package.json
│   ├── index.ts                      ← Monitors vault deposits
│   └── README.md
│
├── dex-liquidity/                     ← DEX liquidity example
│   ├── package.json
│   ├── index.ts                      ← Optimizes liquidity
│   └── README.md
│
└── ui-demo/                           ← ✅ UI demo (works immediately)
    ├── package.json
    ├── index.html
    ├── vite.config.ts
    └── src/
        ├── main.tsx
        └── App.tsx                    ← Uses all UI components
```

---

## 📖 Documentation Files

```
v5/
├── README.md                          ← Main overview
├── HOW_IT_WORKS.md                   ← Explains SDK functionality
├── HOW_IT_WORKS_SIMPLE.md           ← Simplified explanation
├── USER_STORIES.md                   ← Real-world examples
├── QUICK_START.md                    ← Fast setup guide
├── SETUP_GUIDE.md                    ← Detailed setup
├── INSTALL_GUIDE.md                  ← Installation instructions
├── BUILD_AND_RUN.md                  ← Build process guide
├── BUILD_TEST_STEPS.md               ← Testing procedures
├── TESTING_WIKI.md                   ← Testing documentation
├── UI_TESTING_GUIDE.md               ← UI testing guide
├── AGENTS_SDK.md                     ← Complete agent inventory
├── AGENTS_FEATURES.md                ← Future agent roadmap
├── CUSTOM_AGENT_TYPES.md             ← Custom agent development
├── ARCHITECTURE_GUIDE.md             ← This file
├── UIDifferences.md                  ← UI implementation comparison
├── SYSTEM_STATUS.md                  ← Current system status
├── COMMERCIALIZATION_SUMMARY.md      ← Business model overview
└── docs/                             ← Additional documentation
    ├── getting-started.md
    ├── api-reference.md
    └── custom-agents.md

---

## 🔄 Data Flow Architecture

### 1. Agent Execution Flow
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Input    │───▶│   SDK Instance   │───▶│  Agent Registry │
│ (executeAgent)  │    │ (SentinelAgentSDK) │    │ (finds agent)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Policy Engine   │◀───│  Context Builder │───▶│  Agent Execute  │
│ (validates)     │    │ (prepares data)  │    │ (decide method) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Audit Trail   │◀───│  Decision Result │◀───│ Agent Decision  │
│ (logs decision) │    │ (formatted)      │    │ (raw output)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### 2. Event Monitoring Flow
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Blockchain     │───▶│  Event Listener  │───▶│ Event Handler   │
│  (emits events) │    │ (monitors chain) │    │ (processes)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Agent Execution │◀───│ Event Processor  │───▶│ Policy Check    │
│ (auto-trigger)  │    │ (maps to agents) │    │ (validates)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### 3. API Server Flow
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ HTTP Request    │───▶│  Express Router  │───▶│ Request Handler │
│ (REST API)      │    │ (routes)         │    │ (validates)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ HTTP Response   │◀───│  Response Format │◀───│ SDK Execution   │
│ (JSON result)   │    │ (standardized)   │    │ (internal call) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

---

## 🏗️ Component Dependencies

### Core Dependencies
```typescript
// External dependencies
"ethers": "^6.0.0"           // Blockchain interaction
"express": "^4.18.0"         // API server (optional)
"winston": "^3.8.0"          // Logging

// Internal dependencies
BaseAgent ──▶ AgentRegistry ──▶ SentinelAgentSDK
ContractAdapter ──▶ ContractRegistry ──▶ SentinelAgentSDK
EventListener ──▶ SentinelAgentSDK
PolicyEngine ──▶ SentinelAgentSDK
```

### UI Dependencies
```typescript
// External dependencies
"react": "^18.0.0"           // React framework
"@sentinel/ai-agent-sdk"       // Core SDK (peer dependency)

// Internal dependencies
useAgentSDK ──▶ Dashboard
useAgentSDK ──▶ AgentConsole
useAgentSDK ──▶ EventMonitor
```

---

## 🔧 Build & Development Architecture

### Monorepo Structure
```
Root package.json (workspace manager)
├── packages/core/package.json      (main SDK)
├── packages/ui/package.json        (React components)
├── packages/examples/*/package.json (example apps)
└── packages/examples02/*/package.json (commercial demos)
```

### Build Process
```bash
# 1. Install all dependencies
npm install                    # Root workspace

# 2. Build core SDK first
cd packages/core
npm run build                  # TypeScript → JavaScript

# 3. Build UI components (depends on core)
cd packages/ui
npm run build                  # TypeScript → JavaScript

# 4. Run examples (uses built packages)
cd packages/examples/ui-demo
npm run dev                    # Development server
```

### Testing Architecture
```
packages/core/src/__tests__/           # Unit tests
├── SentinelAgentSDK.test.ts            # Main SDK tests
├── agents/
│   ├── AgentRegistry.test.ts         # Registry tests
│   ├── RiskMonitor.test.ts           # Agent tests
│   └── *.test.ts                     # Other agent tests
└── setup.ts                          # Test configuration

packages/examples/standalone-test/     # Integration tests
└── test-agents.ts                    # End-to-end agent testing
```

---

## 🚀 Deployment Architecture

### NPM Package Distribution
```
@sentinel/ai-agent-sdk              # Core SDK package
├── dist/index.js                 # Main entry point
├── dist/types/                   # TypeScript definitions
├── package.json                  # Package metadata
└── README.md                     # Package documentation

@cronos/ai-agent-ui               # UI components package
├── dist/index.js                 # React components
├── dist/types/                   # TypeScript definitions
└── package.json                  # Package metadata
```

### Example Deployment Patterns
```typescript
// 1. Node.js Backend Service
import { SentinelAgentSDK } from '@sentinel/ai-agent-sdk';
const sdk = new SentinelAgentSDK({ /* config */ });
sdk.startAPIServer({ port: 3000 });

// 2. React Frontend Application
import { useAgentSDK, Dashboard } from '@cronos/ai-agent-ui';
const { sdk } = useAgentSDK({ /* config */ });

// 3. Serverless Function
export const handler = async (event) => {
  const sdk = new SentinelAgentSDK({ /* config */ });
  return await sdk.executeAgent('risk-monitor', event.data);
};

// 4. Docker Container
FROM node:18
COPY package.json .
RUN npm install @sentinel/ai-agent-sdk
COPY app.js .
CMD ["node", "app.js"]
```

---

## 📊 Performance & Scalability

### Memory Usage
```
SentinelAgentSDK instance:     ~5-10 MB
Agent Registry:              ~1-2 MB per 100 agents
Contract Registry:           ~1-2 MB per 100 contracts
Event Listener:              ~2-5 MB (depends on event volume)
Policy Engine:               ~1-3 MB (depends on policy count)
```

### Execution Performance
```
Agent execution:             ~1-10ms per agent
Policy validation:           ~0.1-1ms per policy
Event processing:            ~1-5ms per event
API request handling:        ~10-50ms per request
```

### Scalability Patterns
```typescript
// Horizontal scaling with multiple SDK instances
const workers = Array.from({ length: 4 }, () => 
  new SentinelAgentSDK({ /* config */ })
);

// Load balancing agent execution
const workerIndex = hash(context.user) % workers.length;
const result = await workers[workerIndex].executeAgent(agentId, context);

// Event processing with queues
sdk.onContractEvent('vault', 'Deposited', async (event) => {
  await queue.add('process-deposit', event);
});
```

---

## 🔒 Security Architecture

### Access Control
```typescript
// Policy-based access control
sdk.addPolicy({
  scope: 'agent:risk-monitor',
  condition: 'user.role === "admin"',
  action: 'allow'
});

// API authentication
sdk.startAPIServer({
  port: 3000,
  auth: {
    type: 'bearer',
    secret: process.env.API_SECRET
  }
});
```

### Data Protection
```typescript
// Sensitive data handling
const context = {
  contractId: 'vault-001',
  user: hash(actualUser),        // Hash PII
  customData: {
    balance: encrypt(balance),    // Encrypt sensitive data
    threshold: threshold
  }
};
```

### Audit Trail
```typescript
// Immutable decision logging
sdk.onDecision((decision) => {
  auditLog.append({
    timestamp: Date.now(),
    agentId: decision.agentId,
    userId: hash(decision.userId),
    decision: decision.result,
    signature: sign(decision)
  });
});
```

This architecture provides a robust, scalable, and secure foundation for AI-powered blockchain automation while maintaining flexibility for custom implementations and enterprise requirements.cedures
├── WORKS_NOW.md                      ← What works immediately
├── SYSTEM_STATUS.md                  ← Current system status
├── TEST_RESULTS.md                   ← Detailed test results
├── TEST_RESULTS_SUMMARY.md          ← Test summary
├── TESTING_WIKI.md                   ← Testing documentation
├── UI_TESTING_GUIDE.md               ← UI testing procedures
├── AI_HANDOFF.md                     ← AI development handoff
├── ARCHITECTURE_GUIDE.md             ← This file!
└── q*-dev-chat-*.md                  ← Development chat logs

docs/
├── getting-started.md                ← Beginner guide
├── custom-agents.md                  ← Create custom agents
├── api-reference.md                  ← Complete API docs
└── wiki/                             ← Interactive documentation
    ├── index.html                    ← Wiki homepage
    ├── script.js                     ← Wiki functionality
    └── styles.css                    ← Wiki styling
```

---

## 🔄 How Everything Connects

```
┌─────────────────────────────────────────────────────────┐
│  Your App (examples/vault-automation/index.ts)          │
│  ┌───────────────────────────────────────────────────┐  │
│  │ import { SentinelAgentSDK } from '@sentinel/ai-agent-sdk'│
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  Core SDK (packages/core/src/index.ts)                  │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Exports: SentinelAgentSDK, RiskMonitor, etc.        │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  SentinelAgentSDK (packages/core/src/SentinelAgentSDK.ts)   │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Uses: AgentRegistry, ContractRegistry, etc.       │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  Blockchain (Cronos EVM)                                │
│  Smart Contracts: Vaults, DEXs, NFTs, etc.              │
└─────────────────────────────────────────────────────────┘
```

---

## 🌐 Enterprise API Usage Examples

### REST API Integration
```typescript
// Execute agent via REST API
POST /api/agents/execute
{
  "agentId": "risk-monitor",
  "context": {
    "contractId": "vault",
    "user": "0xabc...",
    "customData": { "balance": "100" }
  }
}

// Process payment
POST /api/payments/process
{
  "amount": 100,
  "currency": "CRO",
  "recipient": "0x123...",
  "providerId": "cronos-provider"
}

// Handle webhook events
POST /api/webhooks/contract-event
{
  "contractId": "vault",
  "eventName": "Deposited",
  "data": { "user": "0xabc...", "amount": "100" },
  "blockNumber": 12345,
  "transactionHash": "0xdef..."
}
```

### Enterprise Integration Flow
```
┌────────────────────────────────────────────────────────────┐
│  External Systems (SAP/Oracle/Mobile Apps)                 │
│  ┌────────────────────────────────────────────────────────┐│
│  │ REST API │ Webhooks │ Direct SDK Import                ││
│  └────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Cronos AI Agent SDK (Enterprise Features)                  │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ API Server │ Payment System │ Control Plane             ││
│  │ Agent Engine │ Policy Packs │ Audit System              ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
            ↓                    ↓                    ↓
┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐
│ Cronos Blockchain  │ │ Enterprise Systems │ │ External Services  │
│ Smart Contracts    │ │ SAP/Oracle/ERP     │ │ OpenAI/Payment APIs│
│ DeFi Protocols     │ │ Mobile Wallets     │ │ Control Plane      │
└────────────────────┘ └────────────────────┘ └────────────────────┘
```

---

## 🚀 Build & Run Guide

### Step 1: Build Core SDK

```bash
cd v5/packages/core
npm install          # Install dependencies
npm run build        # Compile TypeScript → dist/
npm test             # Run tests (optional)
```

**Output:** `packages/core/dist/` folder with compiled JavaScript

### Step 2: Test Without Contracts

```bash
cd v5/packages/examples/standalone-test
npm install          # Installs core SDK from ../core
npm test             # Runs test-agents.ts
```

**Output:** See all 5 agents working!

### Step 3: Run UI Demo

```bash
# Build UI package first
cd v5/packages/ui
npm install
npm run build

# Run demo
cd v5/packages/examples/ui-demo
npm install
npm run dev
```

**Output:** Browser opens at http://localhost:5173

### Step 4: Use in Your Project

```bash
# Option A: Install from local
npm install /path/to/v5/packages/core

# Option B: After publishing to NPM
npm install @sentinel/ai-agent-sdk
```

---

## 🎯 Key Files to Understand

### 1. **SentinelAgentSDK.ts** - The Main Class
```typescript
// This is the SDK users interact with
export class SentinelAgentSDK {
  registerContract()    // Add contracts
  registerAgent()       // Add agents
  executeAgent()        // Run agents
  onContractEvent()     // Listen to events
  startAPIServer()      // Start REST API
  processPayment()      // Handle payments
  syncPolicies()        // Sync enterprise policies
  start()              // Start monitoring
}
```

### 2. **BaseAgent.ts** - Agent Template
```typescript
// All agents extend this
export abstract class BaseAgent {
  abstract config: AgentConfig;
  abstract decide(context): Promise<AgentDecision>;
}
```

### 3. **APIServer.ts** - REST API Server
```typescript
// Express-based API server
export class APIServer {
  start(port: number)           // Start server
  addRoute(path, handler)       // Add custom routes
  enableWebhooks()              // Enable webhook handling
  addMiddleware(middleware)     // Add Express middleware
}
```

### 4. **PaymentManager.ts** - Payment Processing
```typescript
// Multi-provider payment system
export class PaymentManager {
  processPayment(request)       // Process payment
  addProvider(provider)         // Add payment provider
  trackUsage(record)           // Track usage for billing
  retryFailedPayment(id)       // Retry failed payments
}
```

### 5. **ControlPlaneClient.ts** - Enterprise Management
```typescript
// Remote policy and governance
export interface ControlPlaneClient {
  identifyRuntime(info)         // Register runtime
  pullPolicyPack()             // Get enterprise policies
  pushDecisionRecord(record)    // Send audit records
  pushTelemetry(event)         // Send telemetry data
}
```

### 6. **index.ts** - What Gets Exported
```typescript
// This is what users import
export { SentinelAgentSDK } from './SentinelAgentSDK';
export { RiskMonitor } from './agents/builtin/RiskMonitor';
export { APIServer } from './api/APIServer';
export { PaymentManager } from './payments/PaymentManager';
// ... etc
```

---

## 📦 NPM Package Structure

When published to NPM, users get:

```
@sentinel/ai-agent-sdk/
├── package.json
├── dist/
│   ├── index.js              ← Compiled code
│   ├── index.d.ts            ← TypeScript types
│   ├── SentinelAgentSDK.js
│   ├── agents/
│   │   ├── BaseAgent.js
│   │   └── builtin/
│   │       ├── RiskMonitor.js
│   │       └── ...
│   └── ...
└── README.md
```

Users import like:
```typescript
import { SentinelAgentSDK, RiskMonitor } from '@sentinel/ai-agent-sdk';
```

---

## 🧪 Testing Flow

```
1. Write code in packages/core/src/
2. Write tests in packages/core/src/**/__tests__/
3. Run: npm test
4. Tests use Jest to verify functionality
5. Coverage report shows what's tested
```

---

## 💡 Quick Reference

| I want to...           | Go to... |
|------------------------|----------------------------------------------------------|
| Understand the SDK     | `packages/core/src/SentinelAgentSDK.ts`                    |
| See built-in agents    | `packages/core/src/agents/builtin/`                      |
| Create custom agent    | Extend `packages/core/src/agents/BaseAgent.ts`           |
| Add REST API endpoints | `packages/core/src/api/APIServer.ts`                     |
| Handle payments        | `packages/core/src/payments/PaymentManager.ts`           |
| Enterprise governance  | `packages/core/src/control-plane/ControlPlaneClient.ts`  |
| Policy management      | `packages/core/src/policy-pack/verifier.ts`              |
| Audit and compliance   | `packages/core/src/audit/types.ts`                       |
| Test without contracts | `packages/examples/standalone-test/`                     |
| See UI components      | `packages/ui/src/components/`                            |
| Run working demo       | `packages/examples/ui-demo/`                             |
| Read documentation     | `docs/` or root `.md` files                              |
| Interactive wiki       | `docs/wiki/index.html`                                   |

---

## 🎓 Learning Path

1. **Read:** `README.md` - Overview
2. **Read:** `HOW_IT_WORKS.md` - Understand concepts
3. **Run:** `standalone-test` - See it work
4. **Read:** `packages/core/src/SentinelAgentSDK.ts` - Main class
5. **Read:** `packages/core/src/agents/builtin/RiskMonitor.ts` - Example agent
6. **Create:** Your own agent extending `BaseAgent`
7. **Run:** `ui-demo` - See visual interface
8. **Read:** `USER_STORIES.md` - Real-world examples

---

## Summary

- **packages/core/** = The SDK (what users install)
- **packages/ui/** = React components (optional)
- **packages/examples/** = Working examples
- **docs/** = Documentation

**To test immediately:** Run `standalone-test`  
**To see UI:** Run `ui-demo`  
**To use in project:** Build core, then import it
