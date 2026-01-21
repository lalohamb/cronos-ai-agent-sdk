# UI Implementation Guide - Cronos AI Agent SDK

## File Structure Overview

```
your-project/
├── src/
│   ├── components/           # Your UI components
│   │   ├── AgentDashboard.tsx
│   │   └── ContractManager.tsx
│   ├── hooks/               # Custom React hooks
│   │   └── useAgentSDK.ts
│   ├── services/            # SDK integration layer
│   │   └── agentService.ts
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── package.json
└── tsconfig.json
```

## 1. Package Installation

```bash
npm install @sentinel/ai-agent-sdk @cronos/ai-agent-ui
```

## 2. Main App Setup (`src/App.tsx`)

```typescript
import React from 'react';
import { Dashboard, AgentConsole, useAgentSDK } from '@cronos/ai-agent-ui';
import { RiskMonitor, LiquidityOptimizer } from '@sentinel/ai-agent-sdk';

function App() {
  const { sdk, isReady } = useAgentSDK({
    network: 'cronos-testnet',
    rpcUrl: 'https://evm-t3.cronos.org',
    privateKey: process.env.REACT_APP_AGENT_PRIVATE_KEY
  });

  React.useEffect(() => {
    if (sdk && isReady) {
      // Register your agents here
      sdk.registerAgent('risk-monitor', new RiskMonitor());
      sdk.registerAgent('liquidity-optimizer', new LiquidityOptimizer());
    }
  }, [sdk, isReady]);

  if (!isReady) return <div>Loading SDK...</div>;

  return (
    <div>
      <Dashboard sdk={sdk} />
      <AgentConsole sdk={sdk} />
    </div>
  );
}

export default App;
```

## 3. Service Layer (`src/services/agentService.ts`)

```typescript
import { SentinelAgentSDK, RiskMonitor } from '@sentinel/ai-agent-sdk';

export class AgentService {
  private sdk: SentinelAgentSDK;

  constructor() {
    this.sdk = new SentinelAgentSDK({
      network: 'cronos-testnet',
      rpcUrl: 'https://evm-t3.cronos.org',
      privateKey: process.env.REACT_APP_AGENT_PRIVATE_KEY
    });
  }

  async registerContract(id: string, address: string, abi: any) {
    await this.sdk.registerContract(id, {
      address,
      abi,
      network: 'cronos-testnet'
    });
  }

  async executeAgent(agentId: string, params: any) {
    return await this.sdk.executeAgent(agentId, params);
  }
}
```

## 4. Custom Hook (`src/hooks/useAgentSDK.ts`)

```typescript
import { useState, useEffect } from 'react';
import { SentinelAgentSDK } from '@sentinel/ai-agent-sdk';

export function useAgentSDK(config: any) {
  const [sdk, setSdk] = useState<SentinelAgentSDK | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initSDK = async () => {
      const newSdk = new SentinelAgentSDK(config);
      setSdk(newSdk);
      setIsReady(true);
    };
    
    initSDK();
  }, []);

  return { sdk, isReady };
}
```

## 5. Contract Integration Component (`src/components/ContractManager.tsx`)

```typescript
import React, { useState } from 'react';
import { SentinelAgentSDK } from '@sentinel/ai-agent-sdk';

interface Props {
  sdk: SentinelAgentSDK;
}

export function ContractManager({ sdk }: Props) {
  const [contractAddress, setContractAddress] = useState('');

  const handleRegisterContract = async () => {
    await sdk.registerContract('my-vault', {
      address: contractAddress,
      abi: [], // Your contract ABI
      network: 'cronos-testnet'
    });
  };

  return (
    <div>
      <input 
        value={contractAddress}
        onChange={(e) => setContractAddress(e.target.value)}
        placeholder="Contract Address"
      />
      <button onClick={handleRegisterContract}>
        Register Contract
      </button>
    </div>
  );
}
```

## 6. Event Monitoring Setup

```typescript
// In your main component or service
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

## 7. Environment Setup (`.env`)

```env
REACT_APP_AGENT_PRIVATE_KEY=your_private_key_here
REACT_APP_RPC_URL=https://evm-t3.cronos.org
```

## 8. Package.json Dependencies

```json
{
  "dependencies": {
    "@sentinel/ai-agent-sdk": "^5.2.0",
    "@cronos/ai-agent-ui": "^1.0.0",
    "react": "^18.0.0",
    "ethers": "^6.0.0"
  }
}
```

## Implementation Flow

1. **Install packages** → SDK core + UI components
2. **Setup App.tsx** → Initialize SDK with useAgentSDK hook
3. **Register agents** → Add built-in or custom agents in useEffect
4. **Add UI components** → Use pre-built Dashboard, AgentConsole, etc.
5. **Register contracts** → Connect your smart contracts
6. **Setup event listeners** → Monitor contract events
7. **Execute agents** → Trigger agents based on events or manually

## Key Integration Points

- **SDK Initialization**: Always in App.tsx or main component
- **Agent Registration**: In useEffect after SDK is ready
- **Contract Registration**: In service layer or component
- **Event Monitoring**: Setup after contract registration
- **UI Components**: Import from @cronos/ai-agent-ui package

This structure separates concerns while maintaining clear relationships between the SDK, your business logic, and UI components.