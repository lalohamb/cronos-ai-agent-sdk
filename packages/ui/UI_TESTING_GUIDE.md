# UI Components Testing Guide

This guide explains how to test React UI components in the `@cronos/ai-agent-ui` package.

## Testing Stack

- **Jest** - Test runner and assertion library
- **React Testing Library** - Component testing utilities
- **jsdom** - DOM environment for Node.js
- **ts-jest** - TypeScript support for Jest

## Setup

### Install Dependencies
```bash
cd packages/ui
npm install
```

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Structure

```
packages/ui/src/
├── components/
│   ├── Dashboard/
│   │   ├── Dashboard.tsx
│   │   └── __tests__/
│   │       └── Dashboard.test.tsx
│   ├── AgentConsole/
│   │   ├── AgentConsole.tsx
│   │   └── __tests__/
│   │       └── AgentConsole.test.tsx
│   └── ...
├── hooks/
│   ├── useAgentSDK.ts
│   └── __tests__/
│       └── useAgentSDK.test.ts
├── test-setup.ts
└── test-utils.tsx
```

## Testing Patterns

### 1. Component Testing

```typescript
import React from 'react';
import { screen } from '@testing-library/react';
import { Dashboard } from '../Dashboard';
import { renderWithSDK, createMockSDK } from '../../test-utils';

describe('Dashboard Component', () => {
  test('renders dashboard title', () => {
    const mockSDK = createMockSDK();
    renderWithSDK(<Dashboard sdk={mockSDK} />);
    
    expect(screen.getByText('Cronos AI Agent Dashboard')).toBeInTheDocument();
  });
});
```

### 2. Hook Testing

```typescript
import { renderHook, act } from '@testing-library/react';
import { useAgentSDK } from '../useAgentSDK';

describe('useAgentSDK Hook', () => {
  test('initializes SDK correctly', () => {
    const { result } = renderHook(() => useAgentSDK({
      network: 'cronos-testnet',
      rpcUrl: 'https://evm-t3.cronos.org'
    }));

    expect(result.current.sdk).toBeDefined();
  });
});
```

### 3. User Interaction Testing

```typescript
import { fireEvent, waitFor } from '@testing-library/react';

test('handles form submission', async () => {
  renderWithSDK(<AgentConsole sdk={mockSDK} />);
  
  fireEvent.change(screen.getByLabelText(/contract id/i), {
    target: { value: 'test-contract' }
  });
  
  fireEvent.click(screen.getByText(/execute/i));
  
  await waitFor(() => {
    expect(mockSDK.executeAgent).toHaveBeenCalled();
  });
});
```

## Test Utilities

### Mock SDK Creation

```typescript
// test-utils.tsx
export const createMockSDK = (overrides = {}): jest.Mocked<SentinelAgentSDK> => {
  return {
    registerAgent: jest.fn(),
    executeAgent: jest.fn().mockResolvedValue({
      action: { type: 'ALLOW' },
      reason: 'Test decision',
      confidence: 0.8
    }),
    // ... other methods
    ...overrides
  } as any;
};
```

### Custom Render Function

```typescript
export const renderWithSDK = (
  ui: React.ReactElement,
  { sdk = createMockSDK(), ...renderOptions }: CustomRenderOptions = {}
) => {
  return render(ui, { ...renderOptions });
};
```

## Component-Specific Testing

### Dashboard Component

**What to Test:**
- ✅ Renders title and metric cards
- ✅ Displays correct metric values
- ✅ Shows recent activity section
- ✅ Applies correct styling

```typescript
test('displays metric cards', () => {
  renderWithSDK(<Dashboard sdk={mockSDK} />);
  
  expect(screen.getByText('Agents')).toBeInTheDocument();
  expect(screen.getByText('5')).toBeInTheDocument(); // Active agents
});
```

### AgentConsole Component

**What to Test:**
- ✅ Renders form fields
- ✅ Handles user input
- ✅ Executes agent calls
- ✅ Displays results/errors

```typescript
test('handles agent execution', async () => {
  mockSDK.executeAgent.mockResolvedValue(mockAgentDecision);
  
  renderWithSDK(<AgentConsole sdk={mockSDK} />);
  
  fireEvent.click(screen.getByText(/execute agent/i));
  
  await waitFor(() => {
    expect(mockSDK.executeAgent).toHaveBeenCalled();
  });
});
```

### ContractRegistry Component

**What to Test:**
- ✅ Lists registered contracts
- ✅ Handles contract registration
- ✅ Shows contract details
- ✅ Handles registration errors

### EventMonitor Component

**What to Test:**
- ✅ Displays event list
- ✅ Shows event details
- ✅ Handles real-time updates
- ✅ Filters events by type

### PolicyManager Component

**What to Test:**
- ✅ Lists active policies
- ✅ Adds new policies
- ✅ Removes policies
- ✅ Shows policy details

## Hook Testing

### useAgentSDK Hook

**What to Test:**
- ✅ SDK initialization
- ✅ Connection/disconnection
- ✅ Error handling
- ✅ State management

```typescript
test('handles SDK connection', async () => {
  const { result } = renderHook(() => useAgentSDK(config));

  await act(async () => {
    await result.current.connect();
  });

  expect(result.current.isConnected).toBe(true);
});
```

### useAgentExecution Hook

**What to Test:**
- ✅ Agent execution
- ✅ Loading states
- ✅ Error handling
- ✅ Result caching

## Mocking Strategies

### 1. SDK Mocking

```typescript
// test-setup.ts
jest.mock('@sentinel/ai-agent-sdk', () => ({
  SentinelAgentSDK: jest.fn().mockImplementation(() => ({
    registerAgent: jest.fn(),
    executeAgent: jest.fn(),
    // ... other methods
  })),
}));
```

### 2. Ethers Mocking

```typescript
jest.mock('ethers', () => ({
  ethers: {
    parseEther: jest.fn((value) => `${value}_ETH`),
    formatEther: jest.fn((value) => value.toString()),
  },
}));
```

### 3. External Dependencies

```typescript
// Mock external libraries
jest.mock('some-external-lib', () => ({
  someFunction: jest.fn().mockReturnValue('mocked-value'),
}));
```

## Test Data

### Mock Contract Config

```typescript
export const mockContractConfig = {
  address: '0x1234567890123456789012345678901234567890',
  abi: [
    'function balanceOf(address user) view returns (uint256)',
    'event Deposited(address indexed user, uint256 amount)'
  ],
  network: 'cronos-testnet'
};
```

### Mock Agent Decision

```typescript
export const mockAgentDecision = {
  action: {
    type: 'ALLOW' as const,
    reason: 'Test passed',
    severity: 'LOW' as const
  },
  reason: 'Mock agent decision',
  confidence: 0.85
};
```

## Coverage Goals

### Target Coverage
- **Statements**: 90%+
- **Branches**: 85%+
- **Functions**: 90%+
- **Lines**: 90%+

### Coverage Report
```bash
npm run test:coverage
```

**Output:**
```
File                | % Stmts | % Branch | % Funcs | % Lines
--------------------|---------|----------|---------|--------
All files           |   92.5  |   87.3   |   94.1  |   91.8
 components/        |   91.2  |   85.7   |   93.4  |   90.5
  Dashboard.tsx     |   95.0  |   90.0   |   100   |   94.7
  AgentConsole.tsx  |   88.5  |   82.1   |   87.5  |   87.9
 hooks/             |   94.8  |   91.2   |   95.8  |   94.1
  useAgentSDK.ts    |   96.2  |   93.5   |   100   |   95.8
```

## Best Practices

### 1. Test Behavior, Not Implementation

```typescript
// ✅ Good - tests behavior
test('displays success message after execution', async () => {
  renderWithSDK(<AgentConsole sdk={mockSDK} />);
  
  fireEvent.click(screen.getByText(/execute/i));
  
  await waitFor(() => {
    expect(screen.getByText(/success/i)).toBeInTheDocument();
  });
});

// ❌ Bad - tests implementation
test('calls setState with correct value', () => {
  const setStateSpy = jest.spyOn(React, 'useState');
  // ... testing internal state changes
});
```

### 2. Use Semantic Queries

```typescript
// ✅ Good - semantic queries
screen.getByRole('button', { name: /execute agent/i });
screen.getByLabelText(/contract address/i);
screen.getByText(/dashboard/i);

// ❌ Bad - implementation details
screen.getByClassName('execute-button');
screen.getByTestId('contract-input');
```

### 3. Test Error States

```typescript
test('handles execution errors gracefully', async () => {
  mockSDK.executeAgent.mockRejectedValue(new Error('Network error'));
  
  renderWithSDK(<AgentConsole sdk={mockSDK} />);
  
  fireEvent.click(screen.getByText(/execute/i));
  
  await waitFor(() => {
    expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
  });
});
```

### 4. Test Loading States

```typescript
test('shows loading state during execution', async () => {
  mockSDK.executeAgent.mockImplementation(() => 
    new Promise(resolve => setTimeout(resolve, 100))
  );
  
  renderWithSDK(<AgentConsole sdk={mockSDK} />);
  
  fireEvent.click(screen.getByText(/execute/i));
  
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});
```

## Running Tests

### Development Workflow

```bash
# Start test watcher
npm run test:watch

# Run specific test file
npm test Dashboard.test.tsx

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm test -- --ci --coverage --watchAll=false
```

### Integration with Workspace

```bash
# From root - run all UI tests
npm run test --workspace=packages/ui

# From root - run all workspace tests (includes UI)
npm run test --workspaces
```

## Debugging Tests

### Debug Mode

```bash
# Run tests in debug mode
npm test -- --debug

# Run specific test with verbose output
npm test -- --verbose Dashboard.test.tsx
```

### VS Code Integration

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Jest Tests",
  "program": "${workspaceFolder}/packages/ui/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "cwd": "${workspaceFolder}/packages/ui",
  "console": "integratedTerminal"
}
```

This comprehensive testing setup ensures UI components are reliable, maintainable, and work correctly with the Cronos AI Agent SDK.