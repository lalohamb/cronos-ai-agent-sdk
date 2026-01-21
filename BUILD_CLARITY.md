# Build Clarity - Understanding What You're Running

## 🎯 Core Concept

This SDK has **3 distinct layers**. Understanding them is critical:

```
┌─────────────────────────────────────────┐
│  Layer 3: UI Components (React)         │  ← Visual dashboards
│  @cronos/ai-agent-ui                    │
├─────────────────────────────────────────┤
│  Layer 2: SDK Core (TypeScript)         │  ← Agent logic & blockchain
│  @sentinel/ai-agent-sdk                   │
├─────────────────────────────────────────┤
│  Layer 1: Blockchain (Cronos EVM)       │  ← Smart contracts & events
└─────────────────────────────────────────┘
```

---

## Layer 1: Blockchain - Cronos Smart Contracts

**What it is:** The foundation - your deployed smart contracts on Cronos EVM.

**What it does:**
- Executes business logic (vault deposits, DEX swaps, lending, etc.)
- Emits events when state changes (Deposited, Withdrawn, PriceUpdate)
- Stores state on-chain (balances, positions, configurations)
- Enforces rules via Solidity code

**Purpose:**
- SDK monitors these contracts for events
- Agents react to contract state changes
- SDK can call contract functions based on agent decisions

**Usage:**
```typescript
// Register your contract with SDK
await sdk.registerContract('my-vault', {
  address: '0x123...',
  abi: vaultABI,
  network: 'cronos-testnet'
});

// Listen for contract events
sdk.onContractEvent('my-vault', 'Deposited', async (event) => {
  // Agent executes when event fires
  await sdk.executeAgent('risk-monitor', {
    contractId: 'my-vault',
    user: event.args.user
  });
});
```

**Customizations:**

1. **Any EVM Contract Works:**
   - Vaults, DEXs, lending protocols, NFT marketplaces
   - No SDK-specific contract code required
   - Just provide address + ABI

2. **Custom Events:**
   ```solidity
   // Your contract
   event CustomRiskEvent(address user, uint256 riskScore);
   
   // SDK listens
   sdk.onContractEvent('my-contract', 'CustomRiskEvent', handler);
   ```

3. **Multiple Contracts:**
   ```typescript
   await sdk.registerContract('vault', {...});
   await sdk.registerContract('dex', {...});
   await sdk.registerContract('lending', {...});
   ```

4. **Cross-Contract Agents:**
   ```typescript
   // Agent monitors vault + DEX together
   sdk.onContractEvent('vault', 'Deposited', async (event) => {
     const dexPrice = await sdk.getContract('dex').getPrice();
     // Make decision based on both contracts
   });
   ```

**Requirements:**
- Contract deployed on Cronos (testnet or mainnet)
- RPC URL to connect: `https://evm-t3.cronos.org`
- Contract ABI (JSON interface)
- Optional: Private key if agents need to call contract functions

**No blockchain needed for:**
- Standalone tests (mock data)
- UI demo (mock data)

**Blockchain required for:**
- Vault automation (monitors real events)
- DEX liquidity (monitors real events)

---

## Layer 2: SDK Core (`packages/core`)

**What it is:** The brain of the system - agent logic, blockchain connection, event monitoring.

**What it does:**
- Executes AI agents (RiskMonitor, LiquidityOptimizer, etc.)
- Connects to blockchain via RPC
- Monitors smart contract events
- Makes automated decisions

**Build requirement:**
```bash
cd packages/core
npm install
npm run build  # Compiles TypeScript → JavaScript (dist/)
```

**Output:** `packages/core/dist/` - compiled JavaScript that other packages import

**When you need it:**
- ✅ Always (everything depends on this)
- ✅ Before running any example
- ✅ Before building UI

---

## Layer 3: UI Components (`packages/ui`)

**What it is:** React components for visualizing agent activity.

**What it does:**
- Dashboard with metrics
- Agent execution console
- Event monitor display
- Contract registry UI
- Policy manager interface

**Build requirement:**
```bash
cd packages/ui
npm install
npm run build  # Compiles React components → JavaScript (dist/)
```

**Output:** `packages/ui/dist/` - compiled React components

**When you need it:**
- ✅ Only if running UI demo (`packages/examples/ui-demo`)
- ❌ NOT needed for standalone tests
- ❌ NOT needed for vault/DEX automation

---

## Examples (Different Types)

### Type A: Manual Execution (No Background Process)

**1. Standalone Test** (`packages/examples/standalone-test`)
```bash
cd packages/examples/standalone-test
npm install
npm test
```

**What happens:**
- Calls agents directly in code
- Gets immediate response
- Exits when done
- **No blockchain connection**
- **No event monitoring**

**Use case:** Quick test that SDK works

---

**2. UI Demo** (`packages/examples/ui-demo`)
```bash
cd packages/examples/ui-demo
npm install
npm run dev  # Opens http://localhost:5173
```

**What happens:**
- Starts web server
- Shows dashboard in browser
- User clicks buttons to execute agents
- **No automatic execution**
- **No event monitoring**

**Use case:** Visual demo of SDK capabilities

---

### Type B: Background Monitoring (Continuous Process)

**3. Vault Automation** (`packages/examples/vault-automation`)
```bash
cd packages/examples/vault-automation
npm install
npm start  # Runs until you Ctrl+C
```

**What happens:**
- ✅ Connects to blockchain RPC
- ✅ Listens for contract events (Deposited, Withdrawn)
- ✅ Auto-executes agents when events fire
- ✅ Keeps running in background
- ✅ Logs activity to console

**Use case:** Production-like automation

---

**4. DEX Liquidity** (`packages/examples/dex-liquidity`)
```bash
cd packages/examples/dex-liquidity
npm install
npm start  # Runs until you Ctrl+C
```

**What happens:**
- ✅ Connects to blockchain RPC
- ✅ Listens for DEX events (PriceUpdate, Swap)
- ✅ Auto-executes liquidity optimizer
- ✅ Keeps running in background
- ✅ Logs activity to console

**Use case:** Production-like DEX automation

---

## Quick Decision Tree

**Q: Do I need to build anything?**

```
Are you running standalone-test?
├─ YES → No build needed, just `npm install && npm test`
└─ NO → Build core SDK first

Are you running UI demo?
├─ YES → Build core + UI
└─ NO → Just build core

Are you running vault/DEX automation?
└─ Build core only
```

---

## Execution Modes Comparison

| Example | Blockchain Connection | Event Monitoring | Background Process | User Interaction |
|---------|----------------------|------------------|-------------------|------------------|
| **standalone-test** | ❌ No | ❌ No | ❌ No | ❌ None (automated) |
| **ui-demo** | ❌ No* | ❌ No | ✅ Yes (web server) | ✅ Click buttons |
| **vault-automation** | ✅ Yes | ✅ Yes | ✅ Yes (event loop) | ❌ None (automated) |
| **dex-liquidity** | ✅ Yes | ✅ Yes | ✅ Yes (event loop) | ❌ None (automated) |

*UI demo can be configured to connect to blockchain, but default is mock data

---

## Build Dependencies

```
standalone-test
└─ (no build needed, uses SDK directly)

ui-demo
├─ packages/core (must build first)
└─ packages/ui (must build second)

vault-automation
└─ packages/core (must build first)

dex-liquidity
└─ packages/core (must build first)
```

---

## Common Mistakes

### ❌ Mistake 1: Running UI demo without building UI
```bash
cd packages/examples/ui-demo
npm run dev
# ERROR: Cannot find module '@cronos/ai-agent-ui'
```

**Fix:**
```bash
cd packages/ui
npm install && npm run build
```

---

### ❌ Mistake 2: Expecting standalone-test to monitor events
```bash
cd packages/examples/standalone-test
npm test
# Runs once and exits - no background monitoring
```

**Fix:** Use vault-automation or dex-liquidity instead

---

### ❌ Mistake 3: Thinking UI demo auto-executes agents
```bash
npm run dev
# Opens dashboard, but agents only run when you click buttons
```

**Fix:** Use vault-automation for automatic execution

---

## What "Background" Actually Means

### Not Background:
- **standalone-test**: Runs 5 agent tests, prints results, exits
- **ui-demo**: Web server runs, but agents execute on button click

### Background:
- **vault-automation**: Infinite loop listening for blockchain events
- **dex-liquidity**: Infinite loop listening for blockchain events

**Key difference:** Event monitoring requires:
1. Active RPC connection
2. Event listener loop
3. Process stays alive (doesn't exit)

---

## Environment Requirements

### Standalone Test
```bash
# No .env needed
```

### UI Demo
```bash
# No .env needed (uses mock data)
```

### Vault/DEX Automation
```bash
# .env REQUIRED
CRONOS_RPC_URL=https://evm-t3.cronos.org
AGENT_PRIVATE_KEY=0x...
VAULT_CONTRACT_ADDRESS=0x...
```

---

## Build Order (When Starting Fresh)

```bash
# Step 1: Core SDK (always first)
cd packages/core
npm install
npm run build

# Step 2a: If running UI demo
cd ../ui
npm install
npm run build

# Step 2b: If running vault/DEX (skip UI build)
cd ../examples/vault-automation
npm install
npm start

# Step 3: Run your chosen example
cd ../examples/ui-demo
npm run dev
```

---

## Testing vs Production

| Mode | Example | Purpose |
|------|---------|---------|
| **Testing** | standalone-test | Verify SDK works |
| **Demo** | ui-demo | Show capabilities |
| **Production** | vault-automation, dex-liquidity | Real automation |

---

## Summary

**SDK Core** = The engine (always build first)  
**UI Components** = The dashboard (only if using UI)  
**Standalone Test** = Quick verification (no build, no blockchain)  
**UI Demo** = Visual demo (manual execution)  
**Vault/DEX** = Real automation (background monitoring)

**To run agents in background:** Use vault-automation or dex-liquidity, NOT standalone-test or ui-demo.
