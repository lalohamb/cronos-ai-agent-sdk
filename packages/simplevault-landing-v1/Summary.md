# SDK & SimpleVault Landing Integration Summary

## How They're Related

### Dependency
- The `simplevault-landing-v1` app **imports and uses** the `@sentinal/ai-agent-sdk` package from `packages/core`
- Defined in `package.json`: `"@sentinal/ai-agent-sdk": "file:../core"`
- This is a **monorepo setup** with local package linking

### Architecture
- **SDK (packages/core)**: Core library with agents, contract management, policy engine
- **Landing App**: React frontend that consumes the SDK to provide a UI

---

## Dashboard Contract Connection

### ✅ YES - The dashboard loads with a fully connected contract!

### Initialization Flow

1. `App.tsx` loads → SDK initializes
2. Connects to Cronos testnet RPC (`https://evm-t3.cronos.org`)
3. Registers 5 built-in agents
4. **Registers SimpleVault contract** (`0x656a4D09f53ab82f6B291082cb3159F7c14424dE`)
5. Passes SDK instance to Dashboard component
6. Dashboard is ready with contract pre-registered

### When User Executes an Agent

1. Dashboard builds context with `contractId: 'simple-vault'`
2. Calls `sdk.executeAgent(agentId, context)`
3. SDK looks up both the agent AND contract from registries
4. Agent executes with contract context
5. Results displayed to user

---

## Key Files

- ✅ `.env` - Environment configuration with contract details
- ✅ `.env.example` - Template for sharing
- ✅ `SDK_INTEGRATION_EXPLAINED.md` - Detailed documentation
- ✅ Two interactive diagrams showing the flow

---

## Important Note

**The contract is already connected when the dashboard loads - no additional connection needed!**