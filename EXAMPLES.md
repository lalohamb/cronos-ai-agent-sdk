# Examples Documentation

Complete guide to all SDK examples - UI demos, automation scripts, and testing tools.

---

## 📁 Example Categories

```
packages/
├── examples/          # Core examples
│   ├── ui-demo/              ← UI component showcase
│   ├── standalone-test/      ← Quick SDK test
│   ├── vault-automation/     ← Background monitoring
│   ├── dex-liquidity/        ← DEX automation
│   └── genius-act-compliance/← Compliance agent
│
├── examples02/        # Commercial demos
│   └── defi-dashboard/       ← Production sales demo
│
├── exampleboltdemo/   # Marketing site
│   └── (Live demo with mock agents)
│
├── examplebuildingui/ # Real agent execution
│   └── (Direct agent logic calls)
│
└── ui/                # UI component library
    └── @cronos/ai-agent-ui (React components)
```

---

## 🎨 UI Examples

### 1. UI Component Library (`packages/ui`)

**Purpose:** React component library for building agent dashboards

**What it provides:**
- Dashboard component
- AgentConsole component
- EventMonitor component
- ContractRegistry component
- PolicyManager component
- useAgentSDK hook
- useAgentExecution hook

**Tech Stack:**
- React 18 + TypeScript
- Inline styles (customizable)

**Installation:**
```bash
npm install @cronos/ai-agent-ui @sentinel/ai-agent-sdk
```

**Usage:**
```tsx
import { Dashboard, AgentConsole, useAgentSDK } from '@cronos/ai-agent-ui';

const { sdk, isReady } = useAgentSDK({
  network: 'cronos-testnet',
  rpcUrl: 'https://evm-t3.cronos.org'
});

return (
  <>
    <Dashboard sdk={sdk} />
    <AgentConsole sdk={sdk} />
  </>
);
```

**Build requirement:**
```bash
cd packages/ui
npm install
npm run build
```

**Use case:** Building custom dashboards, integrating SDK into existing apps

---

### 2. UI Demo (`packages/examples/ui-demo`)

**Purpose:** Showcase all React components from `@cronos/ai-agent-ui`

**What it demonstrates:**
- Dashboard with metrics overview
- Agent Console for manual execution
- Event Monitor for real-time events
- Contract Registry for managing contracts
- Policy Manager for configuring policies

**Tech Stack:**
- React 18 + TypeScript
- Vite dev server
- `@cronos/ai-agent-ui` components
- `@sentinel/ai-agent-sdk` core

**How to run:**
```bash
# Step 1: Build dependencies
cd packages/core
npm install && npm run build

cd ../ui
npm install && npm run build

# Step 2: Run demo
cd ../examples/ui-demo
npm install
npm run dev
```

**Access:** http://localhost:5173

**Features:**
- ✅ Component showcase
- ✅ Manual agent execution
- ✅ Mock data (no blockchain needed)
- ✅ Interactive UI testing
- ❌ No background monitoring
- ❌ No real blockchain connection

**Use case:** Testing UI components, visual demos, integration examples

---

### 3. Real Agent UI (`packages/examplebuildingui`)

**Purpose:** Demonstrates REAL agent execution (not mock)

**What it demonstrates:**
- Direct calls to actual agent logic
- Real data processing
- Actual decision algorithms
- Live calculations

**Tech Stack:**
- React 18 + TypeScript
- Vite dev server
- Direct agent imports (no mocks)

**How to run:**
```bash
cd packages/examplebuildingui
npm install
npm run dev
```

**Access:** http://localhost:3002

**Features:**
- ✅ Real agent execution
- ✅ Actual decision logic
- ✅ Live data processing
- ✅ Dynamic calculations
- ❌ No blockchain connection
- ❌ No event monitoring

**Key difference from ui-demo:**
- ui-demo = Mock data, simulated responses
- examplebuildingui = Real agent logic, actual calculations

**Example:**
```typescript
// Real LiquidityOptimizer execution
const result = await liquidityOptimizer.execute({
  currentPrice: "1800000000000000000",
  liquidity: "500000000000000000000",
  targetRatio: 0.8
});
// Returns actual decision: REMOVE 100 ETH
```

**Use case:** Testing real agent behavior, validating decision logic

---

### 4. Marketing Demo (`packages/exampleboltdemo`)

**Purpose:** Professional marketing site with live agent dashboard

**What it demonstrates:**
- Marketing homepage with SDK status
- Interactive agent dashboard
- Technical documentation pages
- User stories and use cases

**Tech Stack:**
- React 18 + TypeScript
- React Router (multi-page)
- Tailwind CSS
- Lucide React icons

**How to run:**
```bash
cd packages/exampleboltdemo
npm install
npm run dev
```

**Access:** http://localhost:5173

**Pages:**
- `/` - Marketing homepage
- `/dashboard` - Live agent execution
- `/user-stories` - Technical documentation

**Features:**
- ✅ Professional design
- ✅ Multi-page navigation
- ✅ SDK status indicators
- ✅ Mock agent execution
- ✅ Marketing content
- ❌ No real SDK integration (mock mode)

**Use case:** Sales presentations, marketing material, developer onboarding

---

### 5. DeFi Dashboard (`packages/examples02/defi-dashboard`)

**Purpose:** Production-ready commercial demo showcasing SDK's business value

**What it demonstrates:**
- **Sales Landing Page** - Pricing tiers ($199-$3,000/month)
- **Agent-as-a-Service Dashboard** - MRR tracking, customer analytics
- **Merchant AI Ops Copilot** - Payment insights, fraud detection
- **DeFi Portfolio Demo** - Risk monitoring, portfolio performance

**Tech Stack:**
- React 18 + TypeScript
- Framer Motion (animations)
- Recharts (data visualization)
- Tailwind CSS
- Lucide React (icons)

**How to run:**
```bash
cd packages/examples02/defi-dashboard
npm install
npm run dev
```

**Access:** http://localhost:3001

**Features:**
- ✅ 4 complete dashboards
- ✅ Revenue-focused design
- ✅ Beautiful animations
- ✅ Real-time charts
- ✅ Pricing tiers
- ✅ Commercial positioning
- ❌ No blockchain connection (demo data)

**Monetization pillars shown:**
1. **Agent-as-a-Service (AaaS)** - Subscription tiers
2. **Transaction Fees** - 5-30 bps per automation
3. **Enterprise Licenses** - Custom pricing
4. **Merchant Copilot** - $99-299/month
5. **White-Label** - Revenue share model

**Use case:** Sales demos, investor pitches, commercial presentations

**Documentation:**
- [SALES_DEMO_GUIDE.md](packages/examples02/defi-dashboard/SALES_DEMO_GUIDE.md)
- [COMMERCIALIZATION_SUMMARY.md](packages/examples02/defi-dashboard/COMMERCIALIZATION_SUMMARY.md)

---

## 🤖 Automation Examples

### 3. Vault Automation (`packages/examples/vault-automation`)

**Purpose:** Real-world vault monitoring with background event processing

**What it demonstrates:**
- Blockchain event monitoring
- Automatic agent execution on deposits/withdrawals
- Risk assessment automation
- Emergency brake triggers

**Tech Stack:**
- TypeScript + Node.js
- ethers.js (blockchain connection)
- `@sentinel/ai-agent-sdk` core

**How to run:**
```bash
# Step 1: Build core SDK
cd packages/core
npm install && npm run build

# Step 2: Configure environment
cd ../examples/vault-automation
cp .env.example .env
# Edit .env with your keys

# Step 3: Run automation
npm install
npm start
```

**Environment required:**
```bash
CRONOS_RPC_URL=https://evm-t3.cronos.org
AGENT_PRIVATE_KEY=0x...
VAULT_CONTRACT_ADDRESS=0x...
```

**Features:**
- ✅ Background process (runs continuously)
- ✅ Real blockchain connection
- ✅ Event monitoring (Deposited, Withdrawn)
- ✅ Automatic agent execution
- ✅ Risk monitoring
- ✅ Emergency actions

**Agents used:**
- RiskMonitor
- EmergencyBrake
- ThresholdGuard

**Use case:** Production vault automation, risk management, automated responses

---

### 4. DEX Liquidity (`packages/examples/dex-liquidity`)

**Purpose:** Automated liquidity optimization for DEX protocols

**What it demonstrates:**
- DEX event monitoring (PriceUpdate, Swap)
- Liquidity rebalancing automation
- Market condition responses
- Multi-pool management

**Tech Stack:**
- TypeScript + Node.js
- ethers.js
- `@sentinel/ai-agent-sdk` core

**How to run:**
```bash
# Step 1: Build core SDK
cd packages/core
npm install && npm run build

# Step 2: Run automation
cd ../examples/dex-liquidity
npm install
npm start
```

**Features:**
- ✅ Background process
- ✅ Real blockchain connection
- ✅ DEX event monitoring
- ✅ Automatic liquidity optimization
- ✅ Price-based decisions

**Agents used:**
- LiquidityOptimizer
- AnomalyDetector

**Use case:** DEX automation, liquidity management, market making

---

### 5. Genius Act Compliance (`packages/examples/genius-act-compliance`)

**Purpose:** Regulatory compliance automation for Genius Act requirements

**What it demonstrates:**
- Compliance rule enforcement
- Transaction monitoring
- Regulatory reporting
- Policy-based automation

**Tech Stack:**
- TypeScript + Node.js
- `@sentinel/ai-agent-sdk` core

**How to run:**
```bash
cd packages/examples/genius-act-compliance
npm install
npm start
```

**Features:**
- ✅ Compliance monitoring
- ✅ Rule enforcement
- ✅ Automated reporting

**Use case:** Regulatory compliance, transaction monitoring, policy enforcement

---

## 🧪 Testing Examples

### 6. Standalone Test (`packages/examples/standalone-test`)

**Purpose:** Quick verification that SDK works without blockchain

**What it demonstrates:**
- All 5 built-in agents
- Agent execution patterns
- Mock data testing
- SDK API usage

**Tech Stack:**
- TypeScript + Node.js
- `@sentinel/ai-agent-sdk` core

**How to run:**
```bash
cd packages/examples/standalone-test
npm install
npm test
```

**Expected output:**
```
🚀 Testing Cronos AI Agent SDK

1️⃣ Testing RiskMonitor...
   Result: LIMIT - Balance below threshold
   Confidence: 85%

2️⃣ Testing LiquidityOptimizer...
   Result: REMOVE - Excess liquidity detected
   Confidence: 80%

3️⃣ Testing EmergencyBrake...
   Result: EMERGENCY_STOP - Critical threshold breached
   Confidence: 95%

4️⃣ Testing ThresholdGuard...
   Result: BLOCK - Amount exceeds threshold
   Confidence: 90%

5️⃣ Testing AnomalyDetector...
   Result: ALERT - Unusual pattern detected
   Confidence: 75%

✅ All agents tested successfully!
```

**Features:**
- ✅ No build required
- ✅ No blockchain needed
- ✅ Tests all agents
- ✅ Fast execution (exits immediately)
- ❌ No event monitoring
- ❌ No background process

**Use case:** Quick SDK verification, CI/CD testing, development sanity checks

---

## 📊 Comparison Matrix

| Example | Type | Blockchain | Background | Build Required | Port | Use Case |
|---------|------|------------|------------|----------------|------|----------|
| **ui (library)** | Library | N/A | N/A | ✅ Yes | - | Component library |
| **ui-demo** | UI | ❌ No | ❌ No | ✅ Yes (core+ui) | 5173 | Component showcase |
| **examplebuildingui** | UI | ❌ No | ❌ No | ❌ No | 3002 | Real agent logic |
| **exampleboltdemo** | UI | ❌ No | ❌ No | ❌ No | 5173 | Marketing site |
| **defi-dashboard** | UI | ❌ No | ❌ No | ❌ No | 3001 | Sales demo |
| **vault-automation** | Script | ✅ Yes | ✅ Yes | ✅ Yes (core) | - | Production vault |
| **dex-liquidity** | Script | ✅ Yes | ✅ Yes | ✅ Yes (core) | - | DEX automation |
| **genius-act-compliance** | Script | ✅ Yes | ✅ Yes | ✅ Yes (core) | - | Compliance |
| **standalone-test** | Test | ❌ No | ❌ No | ❌ No | - | Quick test |

---

## 🎯 Quick Start Guide

### Just want to see it work?
```bash
cd packages/examples/standalone-test
npm install && npm test
```

### Want to see the UI?
```bash
# Option 1: Marketing site (fastest)
cd packages/exampleboltdemo
npm install && npm run dev
# Open http://localhost:5173

# Option 2: Sales demo
cd packages/examples02/defi-dashboard
npm install && npm run dev
# Open http://localhost:3001

# Option 3: Real agent execution
cd packages/examplebuildingui
npm install && npm run dev
# Open http://localhost:3002
```

### Want real automation?
```bash
# Build core first
cd packages/core && npm install && npm run build

# Run vault automation
cd ../examples/vault-automation
cp .env.example .env
# Edit .env with your keys
npm install && npm start
```

---

## 🔧 Build Dependencies

### No Build Needed:
- standalone-test
- defi-dashboard
- exampleboltdemo
- examplebuildingui

### Core SDK Only:
- vault-automation
- dex-liquidity
- genius-act-compliance

### Core + UI:
- ui-demo

### UI Library (for custom apps):
- ui (component library)

---

## 🌐 Environment Requirements

### No .env needed:
- standalone-test
- ui-demo
- defi-dashboard
- exampleboltdemo
- examplebuildingui

### .env required:
- vault-automation
- dex-liquidity
- genius-act-compliance

**Required variables:**
```bash
CRONOS_RPC_URL=https://evm-t3.cronos.org
AGENT_PRIVATE_KEY=0x...
CONTRACT_ADDRESS=0x...
```

---

## 📚 Related Documentation

- [BUILD_CLARITY.md](BUILD_CLARITY.md) - Understanding SDK layers
- [BUILD_AND_RUN.md](BUILD_AND_RUN.md) - Step-by-step build guide
- [UI_IMPLEMENTATION_GUIDE.md](UI_IMPLEMENTATION_GUIDE.md) - UI component guide
- [SALES_DEMO_GUIDE.md](packages/examples02/defi-dashboard/SALES_DEMO_GUIDE.md) - Commercial demo script
- [packages/ui/README.md](packages/ui/README.md) - Component library docs

---

## 🎨 UI Examples Summary

**Component Library (`ui`):**
- Reusable React components
- Build once, use anywhere
- Full TypeScript support

**For developers:**
- Use `ui-demo` to learn component integration
- Use `examplebuildingui` to test real agent logic
- Use `ui` library to build custom dashboards

**For sales/business:**
- Use `defi-dashboard` for revenue-focused demos
- Use `exampleboltdemo` for marketing presentations

**For testing:**
- Use `examplebuildingui` to validate agent decisions
- Use `ui-demo` to test component integration

**Key differences:**
- `ui` = Component library (build and import)
- `ui-demo` = Component showcase (mock data)
- `examplebuildingui` = Real agent execution (actual logic)
- `exampleboltdemo` = Marketing site (professional design)
- `defi-dashboard` = Sales demo (revenue focus)
