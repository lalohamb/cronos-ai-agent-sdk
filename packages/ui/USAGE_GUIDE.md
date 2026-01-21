# Cronos AI Agent UI Components

React component library for building AI agent management interfaces with the Cronos AI Agent SDK.

## Installation

```bash
npm install @cronos/ai-agent-ui @sentinel/ai-agent-sdk react react-dom
```

## Quick Start

```tsx
import React from 'react';
import { Dashboard, AgentConsole } from '@cronos/ai-agent-ui';
import { SentinelAgentSDK } from '@sentinel/ai-agent-sdk';

const App = () => {
  const sdk = new SentinelAgentSDK({
    network: 'cronos-testnet',
    rpcUrl: 'https://evm-t3.cronos.org',
    privateKey: process.env.REACT_APP_PRIVATE_KEY
  });

  return (
    <div>
      <Dashboard sdk={sdk} />
      <AgentConsole sdk={sdk} />
    </div>
  );
};
```

## Components

### Dashboard
Displays SDK metrics and activity overview.

```tsx
import { Dashboard } from '@cronos/ai-agent-ui';

<Dashboard sdk={sdk} />
```

**Features:**
- Active agents count
- Registered contracts count  
- Recent activity feed
- Real-time stats from SDK

### AgentConsole
Interactive console for executing agents manually.

```tsx
import { AgentConsole } from '@cronos/ai-agent-ui';

<AgentConsole sdk={sdk} />
```

**Features:**
- Agent execution form
- JSON input validation
- Decision result display
- Confidence visualization

### PolicyManager
Manage and view policy packs and rulesets.

```tsx
import { PolicyManager } from '@cronos/ai-agent-ui';

<PolicyManager sdk={sdk} />
```

**Features:**
- Policy pack status
- Expandable rulesets
- Rule type visualization
- Priority and scope display

### ContractRegistry
View and manage registered contracts.

```tsx
import { ContractRegistry } from '@cronos/ai-agent-ui';

<ContractRegistry sdk={sdk} />
```

### EventMonitor
Monitor contract events in real-time.

```tsx
import { EventMonitor } from '@cronos/ai-agent-ui';

<EventMonitor sdk={sdk} />
```

## Hooks

### useAgentSDK
Initialize and manage SDK instance.

```tsx
import { useAgentSDK } from '@cronos/ai-agent-ui';

const MyComponent = () => {
  const { sdk, isReady, error } = useAgentSDK({
    network: 'cronos-testnet',
    rpcUrl: 'https://evm-t3.cronos.org',
    privateKey: process.env.REACT_APP_PRIVATE_KEY
  });

  if (!isReady) return <div>Loading SDK...</div>;
  if (error) return <div>Error: {error}</div>;

  return <Dashboard sdk={sdk} />;
};
```

### useAgentExecution
Execute agents with loading states.

```tsx
import { useAgentExecution } from '@cronos/ai-agent-ui';

const MyComponent = ({ sdk }) => {
  const { executeAgent, loading, result, error } = useAgentExecution(sdk);

  const handleExecute = () => {
    executeAgent('risk-monitor', {
      contractId: 'vault',
      user: '0x123...',
      customData: { balance: '1000' }
    });
  };

  return (
    <div>
      <button onClick={handleExecute} disabled={loading}>
        {loading ? 'Executing...' : 'Execute Agent'}
      </button>
      {result && <div>Result: {result.action.type}</div>}
      {error && <div>Error: {error}</div>}
    </div>
  );
};
```

## Complete Example

```tsx
import React from 'react';
import { 
  Dashboard, 
  AgentConsole, 
  PolicyManager,
  useAgentSDK 
} from '@cronos/ai-agent-ui';

const AgentApp = () => {
  const { sdk, isReady, error } = useAgentSDK({
    network: 'cronos-testnet',
    rpcUrl: 'https://evm-t3.cronos.org',
    privateKey: process.env.REACT_APP_PRIVATE_KEY
  });

  if (!isReady) return <div>Initializing SDK...</div>;
  if (error) return <div>SDK Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>AI Agent Management</h1>
      
      <div style={{ display: 'grid', gap: '20px' }}>
        <Dashboard sdk={sdk} />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <AgentConsole sdk={sdk} />
          <PolicyManager sdk={sdk} />
        </div>
      </div>
    </div>
  );
};

export default AgentApp;
```

## Styling

Components use inline styles for portability. Override with CSS classes:

```css
/* Custom styling */
.cronos-dashboard {
  background: #f8f9fa;
  border-radius: 12px;
}

.cronos-agent-console {
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
```

## TypeScript Support

Full TypeScript support with SDK types:

```tsx
import { SentinelAgentSDK, AgentDecision } from '@sentinel/ai-agent-sdk';
import { Dashboard } from '@cronos/ai-agent-ui';

interface AppProps {
  sdk: SentinelAgentSDK;
}

const App: React.FC<AppProps> = ({ sdk }) => {
  return <Dashboard sdk={sdk} />;
};
```

## Demo

See working examples:
- Basic demo: `packages/examples/ui-demo/`
- Commercial demo: `packages/examples02/defi-dashboard/`

```bash
cd packages/examples/ui-demo
npm install && npm run dev
```