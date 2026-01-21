# Mock Data Inventory - simplevault-landing-v1

## Overview
This document catalogs all mock/sample data used in the simplevault-landing-v1 application for demonstration and UI purposes.

---

## 1. Agent Dashboard Mock Data

### File: `src/components/AgentDashboard.tsx`

#### Built-in Agents (5 agents)
**Lines 36-366**

Mock data for 5 AI agents with full details:
1. **Risk Monitor** (Deterministic)
2. **Liquidity Optimizer** (Deterministic)
3. **Emergency Brake** (Deterministic)
4. **Threshold Guard** (Deterministic)
5. **Anomaly Detector** (Statistical)

Each agent includes:
- `id`, `name`, `type`
- `purpose`, `description`
- `controls` (array of control names)
- `codeExplanation` (text)
- `code` (full TypeScript code example)

#### Future Agents (14 agents)
**Lines 19-34**

Mock data for upcoming agents:
- AI Reasoning Agent
- x402 Payment Agent
- Withdrawal Risk Sentinel
- Settlement Batch Optimizer
- Yield Farming Strategist
- Gas Price Predictor
- MEV Protection Agent
- Cross-Chain Bridge Monitor
- Compliance Checker
- Portfolio Rebalancer
- Staking Optimizer
- Liquidation Protector
- Treasury Diversifier
- Smart Contract Auditor

#### Mock Execution Results
**Lines 368-390**

Function: `executeAgent()`
- Generates random action types (ALLOW/BLOCK)
- Random confidence scores
- Random execution times
- Simulated agent responses

---

## 2. Vault Features Mock Data

### File: `src/components/VaultFeatures.tsx`

**Lines 3-38**

Mock data for 5 vault types:
1. **Base Vault**
   - Tagline, description, features array
2. **Fee Vault**
   - Tagline, description, features array
3. **Yield Vault**
   - Tagline, description, features array
4. **Governance Vault**
   - Tagline, description, features array
5. **Multi-Sig Vault**
   - Tagline, description, features array

Each vault includes:
- Icon component
- Name
- Tagline
- Description
- Features array (4 items each)

---

## 3. AI Agents Marketing Data

### File: `src/components/AIAgents.tsx`

**Lines 3-70**

Mock data for 7 AI agents (marketing descriptions):
1. **Withdrawal Risk Sentinel**
2. **Emergency Brake**
3. **Liquidity Optimizer**
4. **Gas Fee Optimizer**
5. **Anomaly Detector**
6. **Compliance Monitor**
7. **Yield Maximizer**

Each agent includes:
- Icon, name, type
- Confidence percentage
- Description
- How it works
- Example scenario
- Use case

---

## 4. Solutions Mock Data

### File: `src/components/Solutions.tsx`

**Lines 3-56**

Mock data for 5 business solutions:
1. **Agent-as-a-Service**
   - Features array, pricing, highlight
2. **Transaction & Automation Fees**
   - Features array, pricing, highlight
3. **White-Label Partnership**
   - Features array, pricing, highlight
4. **Premium SDK License**
   - Features array, pricing, highlight
5. **Merchant Copilot**
   - Features array, pricing, highlight

Each solution includes:
- Icon, title, description
- Features array (4 items)
- Pricing string
- Highlight text

---

## 5. Pricing Tiers Mock Data

### File: `src/components/Pricing.tsx`

**Lines 3-57**

Mock data for 3 pricing tiers:
1. **Starter** - $0/month
2. **Professional** - $499/month (Popular)
3. **Enterprise** - Custom pricing

Each tier includes:
- Name, price, period
- Description
- Features array (6-8 items)
- CTA button text
- Popular flag

**Additional Revenue Models (Lines 124-140):**
- Transaction Fees
- White-Label Partnership
- Premium SDK License
- Merchant Copilot

---

## 6. Use Cases Mock Data

### File: `src/components/UseCases.tsx`

Mock data for use case examples:
- DeFi protocols
- DAOs
- Merchants
- Enterprises

Each includes:
- Icon, title, description
- Example scenarios

---

## 7. User Stories Mock Data

### File: `src/pages/UserStoriesPage.tsx`

**Lines 5-414**

Mock data for 5 detailed user stories:
1. **DeFi Protocol Developer - Risk Management**
2. **DAO Treasury Manager - Automated Governance**
3. **Merchant - Payment Automation**
4. **DeFi Aggregator - Multi-Protocol Monitoring**
5. **Enterprise Treasury - Compliance & Reporting**

Each story includes:
- Title, role, want, soThat
- Context paragraph
- Full code example (TypeScript)
- Expected outcome
- Business impact

---

## 8. SDK Health Checker Mock Data

### File: `src/utils/sdkHealthChecker.ts`

**Configuration (Lines 16-22):**
```typescript
const CONFIG = {
  rpcUrl: 'https://evm-t3.cronos.org',
  testContractAddress: '0x656a4D09f53ab82f6B291082cb3159F7c14424dE',
  timeout: 10000
};
```

**Mock Agent Registration (Lines 103-122):**
- Simulates 5 agents: RiskMonitor, LiquidityOptimizer, EmergencyBrake, ThresholdGuard, AnomalyDetector
- Uses setTimeout to simulate async registration

---

## 9. Platform Capabilities Mock Data

### File: `src/components/PlatformCapabilities.tsx`

Mock data for platform features:
- Security features
- Integration capabilities
- Monitoring tools
- Developer tools

---

## 10. Contact Form Mock Data

### File: `src/components/Contact.tsx`

Mock contact options:
- Email support
- Live chat
- Schedule demo

---

## Summary Statistics

| Category | Count | Location |
|----------|-------|----------|
| **Built-in Agents** | 5 | AgentDashboard.tsx |
| **Future Agents** | 14 | AgentDashboard.tsx |
| **Vault Types** | 5 | VaultFeatures.tsx |
| **Marketing Agents** | 7 | AIAgents.tsx |
| **Solutions** | 5 | Solutions.tsx |
| **Pricing Tiers** | 3 | Pricing.tsx |
| **User Stories** | 5 | UserStoriesPage.tsx |
| **Use Cases** | 4+ | UseCases.tsx |

---

## Mock vs Real Data

### Currently Mock (Demo Only)
- ✅ All agent definitions and code examples
- ✅ Agent execution results
- ✅ Vault feature descriptions
- ✅ Pricing information
- ✅ User stories and code examples
- ✅ Agent registration simulation

### Real Data (Actual Functionality)
- ✅ RPC health checks (connects to real Cronos Testnet)
- ✅ Gas price fetching (real network data)
- ✅ Contract address validation

---

## How to Replace Mock Data

### To Connect Real Agents
1. Install actual SDK: `npm install @sentinel/ai-agent-sdk`
2. Update `App.tsx` to initialize real SDK
3. Update `AgentDashboard.tsx` executeAgent() function
4. Replace mock results with real SDK calls

### To Use Real Vault Data
1. Connect to smart contracts
2. Fetch vault balances and stats
3. Replace static vault data with dynamic queries

### To Implement Real Pricing
1. Connect to payment/subscription system
2. Update pricing tiers from database
3. Implement actual checkout flow

---

## Notes

- All mock data is **hardcoded** in component files
- No external JSON files or API calls for mock data
- Mock data is **static** and doesn't change at runtime
- Agent execution uses **random values** for demonstration
- SDK health checker uses **real RPC** but simulates agent registration

