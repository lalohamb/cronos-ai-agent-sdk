# @cronos/ai-agent-ui

React UI components for the Cronos AI Agent SDK. Provides ready-to-use components for building agent management dashboards and monitoring interfaces.

## Installation

```bash
npm install @cronos/ai-agent-ui @sentinel/ai-agent-sdk
```

## Quick Start

```tsx
import React from 'react';
import { Dashboard, AgentConsole, PolicyManager, useAgentSDK } from '@cronos/ai-agent-ui';
import { MockControlPlaneClient } from '@sentinel/ai-agent-sdk';

function App() {
  const { sdk, isReady } = useAgentSDK({
    network: 'cronos-testnet',
    rpcUrl: 'https://evm-t3.cronos.org',
    controlPlane: new MockControlPlaneClient(),
    policyPack: {
      enabled: true,
      strict: false
    }
  });

  if (!isReady || !sdk) {
    return <div>Loading SDK...</div>;
  }

  return (
    <div>
      <Dashboard sdk={sdk} />
      <AgentConsole sdk={sdk} />
      <PolicyManager sdk={sdk} />
    </div>
  );
}
```

## Components

### Dashboard
Main dashboard showing SDK status and overview.

```tsx
import { Dashboard } from '@cronos/ai-agent-ui';

<Dashboard sdk={sdk} />
```

### AgentConsole
Interface for managing and executing agents.

```tsx
import { AgentConsole } from '@cronos/ai-agent-ui';

<AgentConsole sdk={sdk} />
```

### PolicyManager
**NEW**: Displays Policy Pack information including:
- Policy pack version and metadata
- Active rulesets with priorities
- Rule details and enforcement status
- Real-time policy updates

```tsx
import { PolicyManager } from '@cronos/ai-agent-ui';

<PolicyManager sdk={sdk} />
```

### ContractRegistry
Interface for managing smart contract registrations.

```tsx
import { ContractRegistry } from '@cronos/ai-agent-ui';

<ContractRegistry sdk={sdk} />
```

### EventMonitor
Real-time monitoring of blockchain events.

```tsx
import { EventMonitor } from '@cronos/ai-agent-ui';

<EventMonitor sdk={sdk} />
```

## Hooks

### useAgentSDK
Hook for initializing and managing the SDK instance.

```tsx
import { useAgentSDK } from '@cronos/ai-agent-ui';

const { sdk, isReady } = useAgentSDK({
  network: 'cronos-testnet',
  rpcUrl: 'https://evm-t3.cronos.org',
  controlPlane: new MockControlPlaneClient(),
  policyPack: {
    enabled: true,
    strict: false,
    refreshMs: 60000 // Refresh every minute
  }
});
```

### useAgentExecution
Hook for executing agents with state management.

```tsx
import { useAgentExecution } from '@cronos/ai-agent-ui';

const { execute, isExecuting, result, error } = useAgentExecution(sdk);
```

## Testing the UI

### Running the Demo

1. **Start the demo application:**
   ```bash
   cd packages/examples/ui-demo
   npm install
   npm run dev
   ```

2. **Open your browser to** `http://localhost:5173`

### Demo Features

The UI demo showcases:

- **Policy Pack Integration**: Live policy pack display with mock data
- **Agent Management**: Built-in agents (RiskMonitor, LiquidityOptimizer, etc.)
- **Real-time Updates**: Policy enforcement and decision tracking
- **Control Plane**: Mock control plane with audit trails

### Test Data

The demo uses `MockControlPlaneClient` which provides:

```typescript
// Policy Pack Test Data
{
  packVersion: '2025.12.17.1',
  issuedAt: Date.now(),
  issuer: 'cronos-agent-control-plane',
  signature: 'mock-signature',
  rulesets: [
    {
      id: 'global-clamp-rules',
      scope: 'global',
      priority: 100,
      enabled: true,
      rules: [
        { type: 'clamp', field: 'maxWithdrawal', max: 1000 }
      ],
      reason: 'Global withdrawal limits'
    }
  ]
}
```

### Testing Policy Enforcement

1. **View Policy Pack**: Check the PolicyManager component for active rules
2. **Execute Agents**: Use AgentConsole to trigger decisions
3. **Monitor Enforcement**: Watch how policy rules modify agent decisions
4. **Audit Trail**: View decision records in the Dashboard

## Policy Pack UI Features

The PolicyManager component displays:

- ✅ **Policy Version Tracking**: Shows current policy pack version
- ✅ **Ruleset Overview**: Lists all active and inactive rulesets
- ✅ **Rule Details**: Shows rule types (clamp, denyIf, requireTag)
- ✅ **Scope Information**: Global, agent-specific, or contract-specific rules
- ✅ **Priority Display**: Visual indication of rule priority
- ✅ **Real-time Updates**: Automatically refreshes when policies change

## Styling

Components use inline styles for simplicity. For production use, consider:

```tsx
// Custom styling
<PolicyManager 
  sdk={sdk} 
  style={{ 
    backgroundColor: '#f8f9fa',
    border: '2px solid #007bff',
    borderRadius: '12px'
  }} 
/>
```

## Development

### Building the UI Package

```bash
npm run build
```

### Type Checking

```bash
npm run type-check
```

## Examples

### Complete Dashboard

```tsx
import React from 'react';
import {
  Dashboard,
  AgentConsole,
  EventMonitor,
  ContractRegistry,
  PolicyManager,
  useAgentSDK
} from '@cronos/ai-agent-ui';
import { MockControlPlaneClient } from '@sentinel/ai-agent-sdk';

function AgentDashboard() {
  const { sdk, isReady } = useAgentSDK({
    network: 'cronos-testnet',
    rpcUrl: 'https://evm-t3.cronos.org',
    controlPlane: new MockControlPlaneClient(),
    policyPack: {
      enabled: true,
      strict: false,
      refreshMs: 30000
    },
    audit: {
      enabled: true
    }
  });

  if (!isReady || !sdk) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Agent SDK...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '1400px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Cronos AI Agent Dashboard</h1>
      
      <Dashboard sdk={sdk} />
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '20px', 
        marginTop: '20px' 
      }}>
        <AgentConsole sdk={sdk} />
        <EventMonitor sdk={sdk} />
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '20px', 
        marginTop: '20px' 
      }}>
        <ContractRegistry sdk={sdk} />
        <PolicyManager sdk={sdk} />
      </div>
    </div>
  );
}

export default AgentDashboard;
```

### Policy Pack Testing

```tsx
import { MockPolicyPackVerifier } from '@sentinel/ai-agent-sdk';

// Test with signature verification
const { sdk } = useAgentSDK({
  network: 'cronos-testnet',
  rpcUrl: 'https://evm-t3.cronos.org',
  controlPlane: new MockControlPlaneClient(),
  policyPack: {
    enabled: true,
    strict: true, // Fail on verification errors
    verifier: new MockPolicyPackVerifier({ 
      expectedSignature: 'mock-signature' 
    })
  }
});
```

## License

MIT