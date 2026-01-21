# @sentinel/ai-agent-sdk

Production-ready AI Agent SDK for Cronos EVM that enables developers to add intelligent automation to any smart contract protocol.

## Installation

```bash
npm install @sentinel/ai-agent-sdk
```

## Quick Start

```typescript
import { SentinelAgentSDK, RiskMonitor } from '@sentinel/ai-agent-sdk';

const sdk = new SentinelAgentSDK({
  network: 'cronos-testnet',
  rpcUrl: 'https://evm-t3.cronos.org',
  privateKey: process.env.AGENT_PRIVATE_KEY,
  aiProvider: 'openai',
  aiApiKey: process.env.OPENAI_API_KEY
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

console.log(result);
```

## Features

- **Protocol Agnostic**: Works with any EVM smart contract
- **Built-in Agents**: Risk monitoring, liquidity optimization, emergency brakes, and more
- **Custom Agents**: Easy to create your own agents
- **Event Monitoring**: Automatic response to on-chain events
- **Policy Enforcement**: Safety policies applied automatically
- **AI Integration**: Optional OpenAI integration for intelligent decisions
- **Control Plane**: Optional centralized configuration and audit trail
- **Type Safe**: Full TypeScript support

## Control Plane Integration

The SDK supports optional Control Plane integration for centralized configuration management and audit trails. The Control Plane is non-custodial and never handles private keys.

### Basic Usage

```typescript
import { SentinelAgentSDK, MockControlPlaneClient } from '@sentinel/ai-agent-sdk';

const controlPlane = new MockControlPlaneClient();

const sdk = new SentinelAgentSDK({
  network: 'cronos-testnet',
  rpcUrl: 'https://evm-t3.cronos.org',
  controlPlane,
  runtime: {
    appName: 'my-dapp',
    env: 'production',
    version: '1.0.0'
  },
  audit: {
    enabled: true,
    redact: (context) => ({ ...context, sensitiveData: '[REDACTED]' })
  }
});
```

### Features

- **Runtime Identification**: Automatically identifies your application instance
- **Policy Management**: Pulls policy configurations from control plane
- **Decision Auditing**: Records all agent decisions with cryptographic hashes
- **Telemetry**: Optional metrics and event collection
- **Local Mode**: Works offline when control plane is disabled

## Policy Pack System

The SDK includes a Policy Pack system for versioned, centralized policy management with optional signature verification.

### Basic Usage

```typescript
import { SentinelAgentSDK, MockControlPlaneClient, MockPolicyPackVerifier } from '@sentinel/ai-agent-sdk';

const sdk = new SentinelAgentSDK({
  network: 'cronos-testnet',
  rpcUrl: 'https://evm-t3.cronos.org',
  controlPlane: new MockControlPlaneClient(),
  policyPack: {
    enabled: true,
    strict: false, // Set to true to fail startup on verification errors
    verifier: new MockPolicyPackVerifier({ expectedSignature: 'my-signature' }),
    refreshMs: 60000 // Refresh every minute
  }
});
```

### Policy Pack Features

- **Versioned Bundles**: Policy packs include version tracking and issuer information
- **Signature Verification**: Optional cryptographic verification (mockable for testing)
- **Scoped Rules**: Global, agent-specific, or contract-specific rule enforcement
- **Priority System**: Higher priority rules override lower priority ones
- **Rule Types**:
  - `clamp`: Limit numeric values to min/max ranges
  - `denyIf`: Block decisions based on conditions
  - `requireTag`: Require specific metadata tags
- **Backward Compatible**: Existing policies continue to work
- **Safe Runtime Loading**: Policies loaded from Control Plane at startup
- **Periodic Refresh**: Optional automatic policy updates

### Example Policy Pack

```typescript
const policyPack = {
  packVersion: '2025.12.17.1',
  issuedAt: Date.now(),
  issuer: 'cronos-agent-control-plane',
  signature: 'base64-signature',
  rulesets: [
    {
      id: 'global-limits',
      scope: 'global',
      priority: 100,
      enabled: true,
      rules: [
        { type: 'clamp', field: 'action.value', max: 1000 },
        { type: 'requireTag', tag: 'approved' }
      ],
      reason: 'Global safety limits'
    },
    {
      id: 'high-risk-agent',
      scope: 'agent',
      agentId: 'risk-monitor',
      priority: 200,
      enabled: true,
      rules: [
        { type: 'denyIf', field: 'metadata.riskScore', op: '>', value: 80 }
      ],
      reason: 'Block high-risk decisions'
    }
  ]
};
```

### Strict vs Non-Strict Mode

- **Strict Mode** (`strict: true`): SDK startup fails if policy pack verification fails
- **Non-Strict Mode** (`strict: false`): Verification failures are logged as warnings, SDK continues

### Custom Verifiers

```typescript
import { PolicyPackVerifier } from '@sentinel/ai-agent-sdk';

class CustomVerifier implements PolicyPackVerifier {
  async verify(pack: PolicyPack): Promise<{ ok: boolean; reason?: string }> {
    // Implement your verification logic
    return { ok: true };
  }
}
```

## Built-in Agents

- **RiskMonitor**: Monitors risk metrics and recommends protective actions
- **LiquidityOptimizer**: Optimizes liquidity allocation
- **EmergencyBrake**: Triggers emergency stops
- **ThresholdGuard**: Enforces threshold limits
- **AnomalyDetector**: Detects unusual patterns

## Policy System

The SDK includes both traditional policies and the new Policy Pack system:

- **Traditional Policies**: Function-based policies for custom logic
- **Policy Packs**: Declarative, versioned policy bundles from Control Plane
- **Enforcement Order**: Traditional policies apply first, then Policy Pack rules
- **Backward Compatibility**: Existing code continues to work unchanged

## Testing

```bash
npm test              # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## Documentation

See the [docs](../../docs) folder for complete documentation.

## Testing

```bash
# Run all tests
npm test

# Run x402 payment tests
npm run test:x402

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### x402 Payment Testing

Comprehensive HTTP 402 Payment Required testing:
- ✅ PaymentManager retry logic
- ✅ Error handler 402 mapping  
- ✅ Usage tracking for billing
- ✅ End-to-end payment flows

See [X402_TESTING_README.md](../../../X402_TESTING_README.md) for details.

## License

MIT
