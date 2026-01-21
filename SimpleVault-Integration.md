# SimpleVault + SDK Integration Overview

> **📘 For complete implementation details, see [SimpleVault-Integration-SDK.md](./SimpleVault-Integration-SDK.md)**

This document provides a high-level overview of integrating the **SimpleVault.sol** contract with the **Cronos AI Agent SDK**.

---

## Architecture

```
Frontend (Next.js) → Agent Service (Express + SDK) → SimpleVault.sol (Cronos)
```

The SDK wraps SimpleVault and provides:
- ✅ Standardized agent interface
- ✅ Automatic event monitoring
- ✅ Policy enforcement engine
- ✅ Audit logging
- ✅ AI integration (optional)

---

## Integration Steps

### 1. Deploy SimpleVault
```bash
cd contracts
npx hardhat run scripts/deploy.ts --network cronos-testnet
```

### 2. Install SDK
```bash
npm install @sentinel/ai-agent-sdk
```

### 3. Initialize SDK
```typescript
const sdk = new SentinelAgentSDK({
  network: 'cronos-testnet',
  rpcUrl: 'https://evm-t3.cronos.org',
  privateKey: process.env.AGENT_PRIVATE_KEY
});
```

### 4. Register Contract
```typescript
await sdk.registerContract('simple-vault', {
  address: '0x123...',
  abi: SIMPLE_VAULT_ABI,
  network: 'cronos-testnet'
});
```

### 5. Register Agents
```typescript
sdk.registerAgent('withdrawal-risk-sentinel', new WithdrawalRiskSentinel());
sdk.registerAgent('emergency-brake', new EmergencyBrakeAgent());
```

### 6. Subscribe to Events
```typescript
sdk.onContractEvent('simple-vault', 'Deposited', async (event) => {
  const decision = await sdk.executeAgent('withdrawal-risk-sentinel', {
    contractId: 'simple-vault',
    user: event.args.user,
    customData: { balanceWei, currentLimitWei }
  });
  
  if (decision.action.type === 'LIMIT') {
    await applyLimitToVault(user, decision.action.value, decision.reason);
  }
});
```

### 7. Add Policies
```typescript
sdk.addPolicy({
  id: 'max-withdrawal-limit',
  validate: (decision, context) => {
    const balance = BigInt(context.customData.balanceWei);
    const limit = BigInt(decision.action.value || '0');
    return limit <= (balance * 80n) / 100n;
  },
  enforce: (decision, context) => {
    // Clamp to 80% if exceeded
  }
});
```

### 8. Start SDK
```typescript
await sdk.start();
console.log('🚀 SimpleVault SDK integration active');
```

---

## Key Benefits

| Feature | Standalone | SDK-Wrapped |
|---------|-----------|-------------|
| **Agent Interface** | Custom | Standardized |
| **Event Monitoring** | Manual | Automatic |
| **Policy Enforcement** | Custom clamp | PolicyEngine |
| **Audit Trail** | Manual logs | Built-in |
| **Reusability** | Vault-specific | Any contract |
| **Testing** | Manual | Test suite |

---

## Next Steps

1. **Read the full guide**: [SimpleVault-Integration-SDK.md](./SimpleVault-Integration-SDK.md)
2. **Review code examples**: See complete agent implementations
3. **Test integration**: Follow testing guide
4. **Deploy**: Use migration path in full guide

---

## Quick Links

- �� **[Full Integration Guide](./SimpleVault-Integration-SDK.md)** - Complete implementation
- 🏗️ **[SDK Architecture](./docs/SDK_ARCHITECTURE.md)** - Component overview
- 🤖 **[Custom Agents](./docs/custom-agents.md)** - Creating agents
- 🧪 **[Testing Guide](./TESTING_Guide.md)** - Testing your integration
- 📦 **[SimpleVault Project](../v3%20v001%20SimpleVaultsol/)** - Standalone implementation

---

## Summary

The SDK transforms SimpleVault from a standalone application into a reference implementation demonstrating best practices for AI agent integration on Cronos.

**Benefits:**
- ✅ Enterprise-grade infrastructure
- ✅ Reusable architecture
- ✅ Advanced features (policy packs, control plane)
- ✅ Better developer experience
- ✅ Ecosystem compatibility
