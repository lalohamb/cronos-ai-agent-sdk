# UI Component Integration Guide

## File Structure Overview

```
src/
├── components/           # Reusable UI components
│   ├── Navigation.tsx   # Main navigation bar
│   ├── Hero.tsx         # Landing page hero section
│   ├── Solutions.tsx    # Monetization pillars display
│   ├── Contact.tsx      # Contact form with validation
│   ├── Footer.tsx       # Site footer
│   ├── AgentDashboard.tsx # Main agent control interface
│   └── ui/              # Basic UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       └── Modal.tsx
├── pages/               # Full page components
│   ├── HomePage.tsx     # Main landing page
│   ├── UserStoriesPage.tsx # Technical stories
│   └── DocumentationPage.tsx # API docs
├── utils/               # Utility functions
│   ├── sdkHealthChecker.ts # SDK health monitoring
│   └── agentHelpers.ts  # Agent execution helpers
├── hooks/               # Custom React hooks
│   ├── useAgent.ts      # Agent execution hook
│   ├── useSDK.ts        # SDK initialization hook
│   └── useHealthCheck.ts # Health monitoring hook
├── types/               # TypeScript definitions
│   ├── agent.types.ts   # Agent-related types
│   └── sdk.types.ts     # SDK types
├── styles/              # Styling files
│   ├── globals.css      # Global styles
│   └── components.css   # Component-specific styles
├── App.tsx              # Main app component
├── main.tsx             # App entry point
└── vite-env.d.ts        # Vite type definitions
```

## Where to Place Your Code

### 1. Creating New Components (`src/components/`)

**File: `src/components/MyAgentInterface.tsx`**
```tsx
import React, { useState } from 'react';
import { SentinelAgentSDK } from '@sentinel/ai-agent-sdk';

interface MyAgentInterfaceProps {
  sdk: SentinelAgentSDK;
  isReady: boolean;
}

export default function MyAgentInterface({ sdk, isReady }: MyAgentInterfaceProps) {
  // Component logic here
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      {/* Your UI here */}
    </div>
  );
}
```

### 2. Creating New Pages (`src/pages/`)

**File: `src/pages/AgentControlPage.tsx`**
```tsx
import React from 'react';
import Navigation from '../components/Navigation';
import MyAgentInterface from '../components/MyAgentInterface';
import Footer from '../components/Footer';

interface AgentControlPageProps {
  sdk: any;
  isReady: boolean;
}

export default function AgentControlPage({ sdk, isReady }: AgentControlPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation isReady={isReady} />
      <main className="max-w-7xl mx-auto py-6 px-4">
        <MyAgentInterface sdk={sdk} isReady={isReady} />
      </main>
      <Footer />
    </div>
  );
}
```

### 3. Adding Routes (`src/App.tsx`)

**Update your App.tsx:**
```tsx
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AgentControlPage from './pages/AgentControlPage'; // Your new page

function App() {
  const [sdk, setSdk] = useState(null);
  const [isReady, setIsReady] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage sdk={sdk} isReady={isReady} />} />
        <Route path="/agents" element={<AgentControlPage sdk={sdk} isReady={isReady} />} />
        {/* Add your new routes here */}
      </Routes>
    </Router>
  );
}
```

### 4. Custom Hooks (`src/hooks/`)

**File: `src/hooks/useAgent.ts`**
```tsx
import { useState, useCallback } from 'react';
import { SentinelAgentSDK } from '@sentinel/ai-agent-sdk';

export function useAgent(sdk: SentinelAgentSDK | null) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const executeAgent = useCallback(async (agentType: string, params: any) => {
    if (!sdk) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await sdk.executeAgent(agentType, params);
      setResult(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [sdk]);

  return { executeAgent, loading, result, error };
}
```

**Usage in component:**
```tsx
import { useAgent } from '../hooks/useAgent';

export default function MyComponent({ sdk, isReady }) {
  const { executeAgent, loading, result, error } = useAgent(sdk);
  
  const handleClick = () => {
    executeAgent('risk-monitor', {
      contractId: 'vault',
      user: '0x123...',
      customData: { balance: '1000' }
    });
  };
  
  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? 'Executing...' : 'Execute Agent'}
    </button>
  );
}
```

### 5. Utility Functions (`src/utils/`)

**File: `src/utils/agentHelpers.ts`**
```tsx
export const agentConfigs = {
  'risk-monitor': {
    name: 'Risk Monitor',
    description: 'Monitor and assess risk levels',
    requiredParams: ['contractId', 'user', 'balance', 'threshold']
  },
  'liquidity-optimizer': {
    name: 'Liquidity Optimizer', 
    description: 'Optimize liquidity allocation',
    requiredParams: ['contractId', 'user', 'currentPrice', 'liquidity']
  }
};

export function validateAgentParams(agentType: string, params: any): boolean {
  const config = agentConfigs[agentType];
  if (!config) return false;
  
  return config.requiredParams.every(param => 
    params.customData && params.customData[param] !== undefined
  );
}
```

### 6. Type Definitions (`src/types/`)

**File: `src/types/agent.types.ts`**
```tsx
export interface AgentExecutionParams {
  contractId: string;
  user: string;
  customData: Record<string, any>;
}

export interface AgentResult {
  action: {
    type: 'ALLOW' | 'BLOCK' | 'REQUIRE_APPROVAL';
    reason: string;
    confidence: number;
  };
  metadata: {
    executionTime: number;
    agentVersion: string;
  };
}

export type AgentType = 
  | 'risk-monitor'
  | 'liquidity-optimizer'
  | 'emergency-brake'
  | 'threshold-guard'
  | 'anomaly-detector';
```

## Step-by-Step Implementation

### Step 1: Create Your Component
1. Create file in `src/components/YourComponent.tsx`
2. Import necessary dependencies
3. Define props interface
4. Implement component logic

### Step 2: Add to a Page
1. Import your component in existing page OR
2. Create new page in `src/pages/YourPage.tsx`
3. Include Navigation and Footer components

### Step 3: Add Route (if new page)
1. Import your page in `src/App.tsx`
2. Add new Route in the Routes component
3. Update Navigation links if needed

### Step 4: Test Integration
1. Ensure SDK props are passed correctly
2. Test agent execution with valid parameters
3. Handle loading and error states

## Example: Complete Implementation

### 1. Component (`src/components/RiskMonitorPanel.tsx`)
```tsx
import React, { useState } from 'react';
import { useAgent } from '../hooks/useAgent';
import { AgentExecutionParams } from '../types/agent.types';

interface RiskMonitorPanelProps {
  sdk: any;
  isReady: boolean;
}

export default function RiskMonitorPanel({ sdk, isReady }: RiskMonitorPanelProps) {
  const { executeAgent, loading, result, error } = useAgent(sdk);
  const [formData, setFormData] = useState({
    contractId: '',
    userAddress: '',
    balance: '',
    threshold: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const params: AgentExecutionParams = {
      contractId: formData.contractId,
      user: formData.userAddress,
      customData: {
        balance: formData.balance,
        threshold: formData.threshold
      }
    };

    await executeAgent('risk-monitor', params);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Risk Monitor</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Contract ID"
          value={formData.contractId}
          onChange={(e) => setFormData({...formData, contractId: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />
        
        <input
          type="text"
          placeholder="User Address"
          value={formData.userAddress}
          onChange={(e) => setFormData({...formData, userAddress: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />
        
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Balance"
            value={formData.balance}
            onChange={(e) => setFormData({...formData, balance: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
          
          <input
            type="number"
            placeholder="Risk Threshold"
            value={formData.threshold}
            onChange={(e) => setFormData({...formData, threshold: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={!isReady || loading}
          className="w-full bg-cyan-600 text-white py-2 px-4 rounded hover:bg-cyan-700 disabled:bg-gray-400"
        >
          {loading ? 'Analyzing Risk...' : 'Check Risk Level'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-gray-50 border rounded">
          <h3 className="font-medium mb-2">Risk Analysis Result:</h3>
          <div className={`p-3 rounded ${
            result.action.type === 'ALLOW' ? 'bg-green-100 text-green-800' :
            result.action.type === 'BLOCK' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            <p><strong>Action:</strong> {result.action.type}</p>
            <p><strong>Reason:</strong> {result.action.reason}</p>
            <p><strong>Confidence:</strong> {(result.action.confidence * 100).toFixed(1)}%</p>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 2. Page (`src/pages/RiskManagementPage.tsx`)
```tsx
import React from 'react';
import Navigation from '../components/Navigation';
import RiskMonitorPanel from '../components/RiskMonitorPanel';
import Footer from '../components/Footer';

interface RiskManagementPageProps {
  sdk: any;
  isReady: boolean;
}

export default function RiskManagementPage({ sdk, isReady }: RiskManagementPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation isReady={isReady} />
      
      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Risk Management</h1>
          <p className="text-gray-600">Monitor and analyze risk levels for your contracts</p>
        </div>
        
        <RiskMonitorPanel sdk={sdk} isReady={isReady} />
      </main>
      
      <Footer />
    </div>
  );
}
```

### 3. Add Route (`src/App.tsx`)
```tsx
import RiskManagementPage from './pages/RiskManagementPage';

// In your Routes component:
<Route path="/risk-management" element={<RiskManagementPage sdk={sdk} isReady={isReady} />} />
```

### 4. Update Navigation (`src/components/Navigation.tsx`)
```tsx
// Add to navigation links:
<Link to="/risk-management" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">
  Risk Management
</Link>
```

This structure provides clear guidance on where each piece of code should be placed and how components connect together.

## Overview
This guide explains how to create new UIs that integrate with the Cronos AI Agent SDK components and call the underlying agent functionality.

## Quick Start

### 1. Basic Component Structure
```tsx
import React, { useState, useEffect } from 'react';
import { SentinelAgentSDK } from '@sentinel/ai-agent-sdk';

interface MyAgentUIProps {
  sdk: SentinelAgentSDK;
  isReady: boolean;
}

export default function MyAgentUI({ sdk, isReady }: MyAgentUIProps) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const executeAgent = async () => {
    if (!sdk || !isReady) return;
    
    setLoading(true);
    try {
      const result = await sdk.executeAgent('risk-monitor', {
        contractId: 'my-vault',
        user: '0x123...',
        customData: { balance: '1000', threshold: '100' }
      });
      setResult(result);
    } catch (error) {
      console.error('Agent execution failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">My Agent Interface</h2>
      <button 
        onClick={executeAgent}
        disabled={!isReady || loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? 'Executing...' : 'Execute Agent'}
      </button>
      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
```

### 2. Available Components

#### Navigation Component
```tsx
import Navigation from '../components/Navigation';

// Usage
<Navigation isReady={sdkReady} />
```

#### Agent Dashboard
```tsx
import AgentDashboard from '../components/AgentDashboard';

// Usage
<AgentDashboard 
  sdk={sdk} 
  isReady={isReady} 
  healthStatus={healthStatus} 
/>
```

#### Solutions Panel
```tsx
import Solutions from '../components/Solutions';

// Usage - Shows monetization pillars with expandable details
<Solutions />
```

#### Contact Form
```tsx
import Contact from '../components/Contact';

// Usage - Includes form validation and error handling
<Contact />
```

## SDK Integration Patterns

### 1. Agent Execution Pattern
```tsx
const executeRiskMonitor = async (contractData) => {
  try {
    const result = await sdk.executeAgent('risk-monitor', {
      contractId: contractData.id,
      user: contractData.userAddress,
      customData: {
        balance: contractData.balance,
        threshold: contractData.riskThreshold
      }
    });
    
    // Handle different action types
    switch (result.action.type) {
      case 'ALLOW':
        showSuccess('Transaction approved');
        break;
      case 'BLOCK':
        showWarning('Transaction blocked due to risk');
        break;
      case 'REQUIRE_APPROVAL':
        showApprovalDialog(result.action.reason);
        break;
    }
  } catch (error) {
    showError('Agent execution failed');
  }
};
```

### 2. Event Monitoring Pattern
```tsx
useEffect(() => {
  if (!sdk || !isReady) return;

  // Listen for contract events
  const unsubscribe = sdk.onContractEvent('vault', 'Deposited', async (event) => {
    const result = await sdk.executeAgent('risk-monitor', {
      contractId: 'vault',
      user: event.args.user,
      customData: {
        balance: event.args.newBalance,
        threshold: ethers.parseEther('10')
      }
    });
    
    updateUI(result);
  });

  return () => unsubscribe();
}, [sdk, isReady]);
```

### 3. Health Check Integration
```tsx
import { SDKHealthChecker } from '../utils/sdkHealthChecker';

const [healthStatus, setHealthStatus] = useState(null);

useEffect(() => {
  const checkHealth = async () => {
    const checker = new SDKHealthChecker();
    const results = await checker.runHealthCheck();
    setHealthStatus(results);
  };
  
  checkHealth();
}, []);

// Display health status
const HealthIndicator = () => (
  <div className="flex items-center gap-2">
    <div className={`w-3 h-3 rounded-full ${
      healthStatus?.overall === 'healthy' ? 'bg-green-500' : 'bg-red-500'
    }`} />
    <span>SDK Status: {healthStatus?.overall || 'checking...'}</span>
  </div>
);
```

## Built-in Agents

### 1. Risk Monitor
```tsx
const riskResult = await sdk.executeAgent('risk-monitor', {
  contractId: 'vault-contract',
  user: userAddress,
  customData: {
    balance: currentBalance,
    threshold: riskThreshold,
    timeWindow: '24h'
  }
});
```

### 2. Liquidity Optimizer
```tsx
const liquidityResult = await sdk.executeAgent('liquidity-optimizer', {
  contractId: 'dex-pool',
  user: poolAddress,
  customData: {
    currentPrice: marketPrice,
    liquidity: poolLiquidity,
    targetRatio: 0.8
  }
});
```

### 3. Emergency Brake
```tsx
const emergencyResult = await sdk.executeAgent('emergency-brake', {
  contractId: 'protocol-contract',
  user: adminAddress,
  customData: {
    triggerCondition: 'tvl_drop',
    threshold: '50%',
    action: 'pause_deposits'
  }
});
```

### 4. Threshold Guard
```tsx
const guardResult = await sdk.executeAgent('threshold-guard', {
  contractId: 'vault',
  user: userAddress,
  customData: {
    operation: 'withdraw',
    amount: withdrawAmount,
    dailyLimit: dailyWithdrawLimit
  }
});
```

### 5. Anomaly Detector
```tsx
const anomalyResult = await sdk.executeAgent('anomaly-detector', {
  contractId: 'trading-contract',
  user: traderAddress,
  customData: {
    transactionPattern: recentTxs,
    baselineWindow: '7d',
    sensitivity: 'medium'
  }
});
```

## UI Layout Patterns

### 1. Dashboard Layout
```tsx
export default function MyDashboard({ sdk, isReady }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation isReady={isReady} />
      
      <main className="max-w-7xl mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agent Controls */}
          <div className="lg:col-span-2">
            <AgentControlPanel sdk={sdk} isReady={isReady} />
          </div>
          
          {/* Status Sidebar */}
          <div>
            <HealthStatus sdk={sdk} />
            <RecentActivity sdk={sdk} />
          </div>
        </div>
      </main>
    </div>
  );
}
```

### 2. Form-based Agent Interface
```tsx
export default function AgentForm({ sdk, agentType }) {
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await sdk.executeAgent(agentType, {
      contractId: formData.contractId,
      user: formData.userAddress,
      customData: formData
    });
    setResult(result);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Contract ID"
        value={formData.contractId || ''}
        onChange={(e) => setFormData({...formData, contractId: e.target.value})}
        className="w-full p-2 border rounded"
      />
      
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Execute {agentType}
      </button>
      
      {result && <ResultDisplay result={result} />}
    </form>
  );
}
```

## Error Handling

### 1. SDK Error Handling
```tsx
const handleAgentExecution = async () => {
  try {
    const result = await sdk.executeAgent(agentType, params);
    return result;
  } catch (error) {
    if (error.code === 'SDK_NOT_READY') {
      showError('SDK is not initialized. Please wait...');
    } else if (error.code === 'AGENT_NOT_FOUND') {
      showError(`Agent '${agentType}' not found`);
    } else if (error.code === 'INVALID_PARAMS') {
      showError('Invalid parameters provided');
    } else {
      showError('Unexpected error occurred');
    }
    throw error;
  }
};
```

### 2. UI Error States
```tsx
const ErrorBoundary = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <h3 className="text-red-800 font-medium">Something went wrong</h3>
        <p className="text-red-600 text-sm mt-1">{fallback}</p>
        <button 
          onClick={() => setHasError(false)}
          className="mt-2 text-red-600 underline text-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  return children;
};
```

## Styling Guidelines

### 1. Consistent Color Scheme
```css
/* Primary Colors */
--primary-cyan: #0891b2;
--primary-cyan-light: #06b6d4;
--primary-cyan-dark: #0e7490;

/* Status Colors */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
--info: #3b82f6;

/* Neutral Colors */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-900: #111827;
```

### 2. Component Classes
```tsx
const componentClasses = {
  card: "bg-white rounded-lg shadow-md p-6 border border-gray-200",
  button: {
    primary: "bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors",
    secondary: "bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors",
    danger: "bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
  },
  input: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500",
  status: {
    success: "bg-green-50 text-green-800 border border-green-200",
    warning: "bg-yellow-50 text-yellow-800 border border-yellow-200",
    error: "bg-red-50 text-red-800 border border-red-200"
  }
};
```

## Best Practices

1. **Always check SDK readiness** before executing agents
2. **Handle all possible action types** returned by agents
3. **Provide loading states** during agent execution
4. **Show clear error messages** with actionable guidance
5. **Use consistent styling** across all components
6. **Implement proper error boundaries** for robust UIs
7. **Add loading indicators** for better user experience
8. **Validate user inputs** before sending to agents
9. **Cache agent results** when appropriate to avoid redundant calls
10. **Test with different network conditions** and error scenarios

## Example: Complete Agent Interface

```tsx
import React, { useState, useEffect } from 'react';
import { SentinelAgentSDK } from '@sentinel/ai-agent-sdk';

export default function CompleteAgentInterface({ sdk, isReady }) {
  const [selectedAgent, setSelectedAgent] = useState('risk-monitor');
  const [params, setParams] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const agents = [
    { id: 'risk-monitor', name: 'Risk Monitor', description: 'Monitor and assess risk levels' },
    { id: 'liquidity-optimizer', name: 'Liquidity Optimizer', description: 'Optimize liquidity allocation' },
    { id: 'emergency-brake', name: 'Emergency Brake', description: 'Emergency protocol controls' },
    { id: 'threshold-guard', name: 'Threshold Guard', description: 'Enforce operational limits' },
    { id: 'anomaly-detector', name: 'Anomaly Detector', description: 'Detect unusual patterns' }
  ];

  const executeAgent = async () => {
    if (!sdk || !isReady) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await sdk.executeAgent(selectedAgent, {
        contractId: params.contractId,
        user: params.userAddress,
        customData: params.customData
      });
      setResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Agent Interface</h1>
      
      {/* Agent Selection */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Select Agent</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map(agent => (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent.id)}
              className={`p-4 rounded-lg border-2 text-left transition-colors ${
                selectedAgent === agent.id
                  ? 'border-cyan-500 bg-cyan-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h3 className="font-medium">{agent.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{agent.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Parameters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Parameters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Contract ID"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            onChange={(e) => setParams({...params, contractId: e.target.value})}
          />
          <input
            type="text"
            placeholder="User Address"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            onChange={(e) => setParams({...params, userAddress: e.target.value})}
          />
        </div>
        <textarea
          placeholder="Custom Data (JSON)"
          className="w-full mt-4 px-3 py-2 border border-gray-300 rounded-lg"
          rows={4}
          onChange={(e) => {
            try {
              setParams({...params, customData: JSON.parse(e.target.value)});
            } catch {}
          }}
        />
      </div>

      {/* Execute Button */}
      <button
        onClick={executeAgent}
        disabled={!isReady || loading || !params.contractId}
        className="w-full bg-cyan-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Executing Agent...' : `Execute ${selectedAgent}`}
      </button>

      {/* Results */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Result</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
```

This guide provides everything needed to create new UIs that effectively integrate with the Cronos AI Agent SDK components.