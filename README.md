# Cronos AI Agent SDK

Production-ready, protocol-agnostic AI Agent SDK for Cronos EVM that enables developers to add intelligent automation to any smart contract protocol.

## Features

- 🔌 **Protocol Agnostic**: Works with any EVM smart contract
- 🤖 **Built-in Agents**: Risk monitoring, liquidity optimization, emergency brakes, and more
- 🎨 **Custom Agents**: Easy to create your own intelligent agents
- 📡 **Event Monitoring**: Automatic response to on-chain events
- 🛡️ **Policy Enforcement**: Safety policies applied automatically
- 🧠 **AI Integration**: Optional OpenAI integration for intelligent decisions
- 📘 **Type Safe**: Full TypeScript support with intellisense

## Quick Start

```bash
npm install @sentinel/ai-agent-sdk
```

### Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit with your keys
nano .env
```

See [ENVIRONMENT_CONFIG.md](./ENVIRONMENT_CONFIG.md) for detailed configuration guide.

```typescript
import { SentinelAgentSDK, RiskMonitor } from '@sentinel/ai-agent-sdk';

const sdk = new SentinelAgentSDK({
  network: 'cronos-testnet',
  rpcUrl: 'https://evm-t3.cronos.org',
  privateKey: process.env.AGENT_PRIVATE_KEY
});

await sdk.registerContract('my-vault', {
  address: '0x123...',
  abi: vaultABI,
  network: 'cronos-testnet'
});

sdk.registerAgent('risk-monitor', new RiskMonitor());

const result = await sdk.executeAgent('risk-monitor', {
  contractId: 'my-vault',
  user: '0xabc...',
  customData: {
    balance: ethers.parseEther('100'),
    threshold: ethers.parseEther('10')
  }
});
```

## Architecture

```
cronos-agent-sdk/
├── packages/
│   ├── core/              # @sentinel/ai-agent-sdk
│   └── examples/          # Example implementations
└── docs/                  # Documentation
```

## Built-in Agents

- **RiskMonitor**: Monitors risk metrics and recommends protective actions
- **LiquidityOptimizer**: Optimizes liquidity allocation based on market conditions
- **EmergencyBrake**: Triggers emergency stops when critical thresholds are breached
- **ThresholdGuard**: Enforces threshold limits on operations
- **AnomalyDetector**: Detects unusual patterns in contract behavior

## Documentation

- [Getting Started](./docs/getting-started.md)
- [Contract System](./docs/CONTRACT_SYSTEM.md) - **Contract management & adapters**
- [SimpleVault Tutorial](./docs/CONTRACT_SIMPLEVAULT_TUTORIAL.md) - **Hands-on contract example**
- [Adding New Agents](./docs/ADDING_NEW_AGENTS.md) - **Step-by-step agent development**
- [UI Implementation Guide](./UI_IMPLEMENTATION_GUIDE.md) - **File structure & placement guide**
- [Custom Agents](./docs/custom-agents.md)
- [API Reference](./docs/api-reference.md)
- [x402 Payment Standard](./X402_README.md) - **HTTP 402 implementation**
- [x402 Testing Guide](./X402_TESTING_README.md) - **Complete testing framework**
- [Examples](./packages/examples)

## Examples

### Vault Automation
```typescript
sdk.onContractEvent('vault', 'Deposited', async (event) => {
  const result = await sdk.executeAgent('risk-monitor', {
    contractId: 'vault',
    user: event.args.user,
    customData: {
      balance: event.args.newBalance,
      threshold: ethers.parseEther('10')
    }
  });
  
  if (result.action.type === 'BLOCK') {
    console.warn('⚠️ Risk level critical');
  }
});
```

### DEX Liquidity Management
```typescript
sdk.onContractEvent('dex', 'PriceUpdate', async (event) => {
  const result = await sdk.executeAgent('liquidity-optimizer', {
    contractId: 'dex',
    user: event.args.pool,
    customData: {
      currentPrice: event.args.price,
      liquidity: event.args.liquidity,
      targetRatio: 0.8
    }
  });
});
```

## 🎯 Commercial Demo

**NEW**: Check out our production-ready sales demo showcasing the SDK's commercial value!

```bash
cd packages/examples02/defi-dashboard
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) to see:

- **Sales Landing Page**: Complete with pricing tiers ($199-$3,000/month)
- **Agent-as-a-Service Dashboard**: Revenue metrics, customer analytics
- **Merchant AI Ops Copilot**: Payment insights, fraud detection, liquidity forecasting
- **DeFi Portfolio Demo**: Real-time risk monitoring and automation

See [SALES_DEMO_GUIDE.md](packages/examples02/defi-dashboard/SALES_DEMO_GUIDE.md) for the full demo script and monetization strategy.

## Examples

### UI Demo (React Components)
```bash
cd packages/examples/ui-demo
npm install
npm run dev
```

Showcases all React components from `@cronos/ai-agent-ui`:
- Dashboard with metrics
- Agent console for manual execution
- Event monitor
- Contract registry
- Policy manager

### Vault Automation
```bash
cd packages/examples/vault-automation
npm install
npm start
```

### DEX Liquidity Management
```bash
cd packages/examples/dex-liquidity
npm install
npm start
```

## Testing

### x402 Payment Testing

The SDK includes comprehensive x402 (HTTP 402 Payment Required) testing:

```bash
# Navigate to core package
cd packages/core

# Run all x402 tests
npm run test:x402

# Run payment system tests
npm run test:payments

# Run with coverage
npm run test:coverage
```

**Test Coverage:**
- Payment Manager retry logic
- Error handler 402 mapping
- Usage tracking for billing
- API server payment endpoints
- End-to-end payment flows

See [X402_TESTING_README.md](../../X402_TESTING_README.md) for complete testing guide.

## Development

This is a **monorepo** using npm workspaces. The root `package.json` manages all packages:

```json
{
  "workspaces": ["packages/*"],
  "scripts": {
    "build": "npm run build --workspaces",
    "test": "npm run test --workspaces",
    "clean": "rm -rf packages/*/dist"
  }
}
```

### Why `--workspaces` is Required

**Without `--workspaces`**: Running `npm run build` from root would only look for a build script in the root package.json (which doesn't exist).

**With `--workspaces`**: npm automatically runs the build script in ALL workspace packages that have one:

```bash
# This command from root:
npm run build --workspaces
# Automatically executes:
# cd packages/core && npm run build
# cd packages/ui && npm run build  
# cd packages/examples/ui-demo && npm run build

# This command from root:
npm run test --workspaces
# Automatically executes:
# cd packages/core && npm run test
# cd packages/ui && npm run test
# cd packages/examples && npm run test

# This command from root:
npm run clean
# Removes all dist/ folders: packages/*/dist
```

**The Alternative** (without workspaces) would be manual:
```bash
cd packages/core && npm run build
cd ../ui && npm run build
cd ../examples/ui-demo && npm run build
# ... repeat for each package
```

### Setup
```bash
# Install all workspace dependencies
npm install

# Build all packages (core, ui, examples)
npm run build

# Run all tests across workspaces
npm test

# Run x402 payment tests
cd packages/core && npm run test:x402

# Clean all build artifacts (removes packages/*/dist)
npm run clean

# Clean everything including all node_modules folders
npm run clean:all
```

### Workspace Structure
- `packages/core/` - Main SDK (`@sentinel/ai-agent-sdk`)
- `packages/ui/` - React components (`@cronos/ai-agent-ui`) 
- `packages/examples/` - Usage examples
- `packages/examples02/` - Commercial demos

### Individual Package Development
```bash
# Work on specific package
cd packages/core
npm run build
npm test

# Install package-specific dependency
npm install --workspace=packages/core some-package
```

## License

MIT
