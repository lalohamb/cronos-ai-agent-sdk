import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import { AgentConsole } from '../AgentConsole';
import { SentinelAgentSDK } from '@sentinel/ai-agent-sdk';

// Mock the entire SDK module
jest.mock('@cronos/ai-agent-sdk', () => ({
  SentinelAgentSDK: jest.fn()
}));

// Simple mock SDK factory
const createMockSDK = (overrides = {}) => ({
  config: { network: 'cronos-testnet' },
  provider: {},
  agentRegistry: { agents: {} },
  contractRegistry: { contracts: {} },
  eventListener: {},
  policyEngine: {},
  aiProvider: null,
  logger: { info: jest.fn(), error: jest.fn(), warn: jest.fn(), debug: jest.fn() },
  controlPlaneClient: null,
  paymentManager: null,
  apiServer: null,
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
}) as unknown as SentinelAgentSDK;

describe('AgentConsole Component', () => {
  test('renders agent console title', () => {
    const mockSDK = createMockSDK();
    render(<AgentConsole sdk={mockSDK} />);
    
    expect(screen.getByText('Agent Console')).toBeInTheDocument();
  });

  test('displays form elements', () => {
    const mockSDK = createMockSDK();
    render(<AgentConsole sdk={mockSDK} />);
    
    expect(screen.getByText(/execute/i)).toBeInTheDocument();
  });
});