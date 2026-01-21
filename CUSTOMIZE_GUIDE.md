# White Label Customization Guide

Build your own branded AI agent platform using the Cronos AI Agent SDK.

## Quick Setup

### 1. Install SDK
```bash
npm install @sentinel/ai-agent-sdk @cronos/ai-agent-ui
```

### 2. Environment Configuration
```bash
cp .env.example .env
```

Edit `.env`:
```env
AGENT_PRIVATE_KEY=your_private_key
CRONOS_RPC_URL=https://evm-t3.cronos.org
OPENAI_API_KEY=your_openai_key  # Optional
```

### 3. Basic White Label App

```typescript
// app.ts
import { SentinelAgentSDK, RiskMonitor } from '@sentinel/ai-agent-sdk';
import { Dashboard, AgentConsole } from '@cronos/ai-agent-ui';

const sdk = new SentinelAgentSDK({
  network: 'cronos-testnet',
  rpcUrl: process.env.CRONOS_RPC_URL,
  privateKey: process.env.AGENT_PRIVATE_KEY
});

// Register your contracts
await sdk.registerContract('vault', {
  address: '0x123...',
  abi: vaultABI,
  network: 'cronos-testnet'
});

// Add built-in agents
sdk.registerAgent('risk-monitor', new RiskMonitor());
```

## Customization Options

### Brand Identity
```typescript
const config = {
  branding: {
    name: 'Your Platform Name',
    logo: '/assets/logo.png',
    colors: {
      primary: '#your-color',
      secondary: '#your-accent'
    }
  }
};
```

### Custom Agents
```typescript
class CustomAgent extends BaseAgent {
  async execute(context) {
    // Your business logic
    return {
      action: { type: 'ALLOW' },
      confidence: 0.95,
      reasoning: 'Custom logic applied'
    };
  }
}

sdk.registerAgent('custom-agent', new CustomAgent());
```

### UI Components
```jsx
import { Dashboard, AgentConsole } from '@cronos/ai-agent-ui';

function YourApp() {
  return (
    <div className="your-theme">
      <Dashboard 
        sdk={sdk}
        title="Your Platform"
        theme="custom"
      />
      <AgentConsole sdk={sdk} />
    </div>
  );
}
```

## Deployment Templates

### 1. SaaS Platform
```typescript
// Multi-tenant setup
const createTenantSDK = (tenantConfig) => {
  return new SentinelAgentSDK({
    ...tenantConfig,
    namespace: tenantConfig.tenantId
  });
};
```

### 2. Enterprise Solution
```typescript
// Single-tenant with custom policies
const enterpriseSDK = new SentinelAgentSDK({
  network: 'cronos-mainnet',
  policies: customPolicies,
  monitoring: advancedMonitoring
});
```

### 3. DeFi Protocol Integration
```typescript
// Protocol-specific agents
sdk.registerAgent('yield-optimizer', new YieldOptimizer());
sdk.registerAgent('liquidation-guard', new LiquidationGuard());

sdk.onContractEvent('protocol', 'Deposit', async (event) => {
  await sdk.executeAgent('yield-optimizer', {
    contractId: 'protocol',
    user: event.args.user,
    customData: event.args
  });
});
```

## Revenue Models

### Subscription Tiers
```typescript
const pricingTiers = {
  starter: { agents: 3, contracts: 5, price: 199 },
  pro: { agents: 10, contracts: 20, price: 799 },
  enterprise: { agents: 'unlimited', contracts: 'unlimited', price: 3000 }
};
```

### Usage-Based Billing
```typescript
// Track agent executions
sdk.on('agentExecuted', (data) => {
  billingService.recordUsage(data.tenantId, data.agentType);
});
```

## Production Checklist

- [ ] Environment variables configured
- [ ] Custom branding applied
- [ ] Agents registered and tested
- [ ] UI components integrated
- [ ] Error handling implemented
- [ ] Monitoring setup
- [ ] Security policies defined
- [ ] Billing integration (if applicable)

## Examples

### Complete White Label Setup
```bash
# Clone starter template
git clone https://github.com/cronos/agent-white-label-template
cd agent-white-label-template

# Install and configure
npm install
cp .env.example .env
# Edit .env with your keys

# Customize branding
nano src/config/branding.ts

# Deploy
npm run build
npm run deploy
```

### Demo Applications
- **DeFi Dashboard**: `packages/examples02/defi-dashboard`
- **Vault Manager**: `packages/examples/vault-automation`
- **UI Components**: `packages/examples/ui-demo`

## Support

- [API Reference](./docs/api-reference.md)
- [Contract System](./docs/CONTRACT_SYSTEM.md)
- [Adding Agents](./docs/ADDING_NEW_AGENTS.md)
- [Examples](./packages/examples)

Start building your AI-powered DeFi platform in minutes!