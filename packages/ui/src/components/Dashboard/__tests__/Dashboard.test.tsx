import React from 'react';
import { screen, render } from '@testing-library/react';
import { Dashboard } from '../Dashboard';
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
  executeAgent: jest.fn(),
  onContractEvent: jest.fn(),
  addPolicy: jest.fn(),
  start: jest.fn(),
  stop: jest.fn(),
  isRunning: jest.fn().mockReturnValue(false),
  getNetwork: jest.fn().mockReturnValue('cronos-testnet'),
  ...overrides
}) as unknown as SentinelAgentSDK;

describe('Dashboard Component', () => {
  test('renders dashboard title', () => {
    const mockSDK = createMockSDK();
    render(<Dashboard sdk={mockSDK} />);
    
    expect(screen.getByText('Cronos AI Agent Dashboard')).toBeInTheDocument();
  });

  test('displays metric cards', () => {
    const mockSDK = createMockSDK();
    render(<Dashboard sdk={mockSDK} />);
    
    expect(screen.getByText('Agents')).toBeInTheDocument();
    expect(screen.getByText('Contracts')).toBeInTheDocument();
    expect(screen.getByText('Policies')).toBeInTheDocument();
  });

  test('shows recent activity section', () => {
    const mockSDK = createMockSDK();
    render(<Dashboard sdk={mockSDK} />);
    
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });
});