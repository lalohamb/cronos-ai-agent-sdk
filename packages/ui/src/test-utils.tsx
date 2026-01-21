import React from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Mock SDK instance for testing
export const createMockSDK = (overrides = {}) => {
  return {
    registerAgent: jest.fn(),
    registerContract: jest.fn(),
    executeAgent: jest.fn().mockResolvedValue({
      action: { type: 'ALLOW' },
      reason: 'Test decision',
      confidence: 0.8
    }),
    onContractEvent: jest.fn(),
    addPolicy: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
    isRunning: jest.fn().mockReturnValue(false),
    getNetwork: jest.fn().mockReturnValue('cronos-testnet'),
    ...overrides
  };
};

// Custom render function with SDK context
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  sdk?: any;
}

export const renderWithSDK = (
  ui: React.ReactElement,
  { sdk = createMockSDK(), ...renderOptions }: CustomRenderOptions = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return <div data-testid="sdk-wrapper">{children}</div>;
  };

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    sdk
  };
};

// Common test data
export const mockContractConfig = {
  address: '0x1234567890123456789012345678901234567890',
  abi: [
    'function balanceOf(address user) view returns (uint256)',
    'function deposit() payable',
    'event Deposited(address indexed user, uint256 amount)'
  ],
  network: 'cronos-testnet'
};

export const mockAgentDecision = {
  action: {
    type: 'ALLOW' as const,
    reason: 'Test passed',
    severity: 'LOW' as const
  },
  reason: 'Mock agent decision',
  confidence: 0.85,
  metadata: { test: true }
};

export const mockEvent = {
  args: {
    user: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C8b',
    amount: '1000000000000000000' // 1 ETH in wei
  },
  blockNumber: 12345,
  transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
};