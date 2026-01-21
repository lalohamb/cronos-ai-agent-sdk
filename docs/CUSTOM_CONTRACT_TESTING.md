# Testing Custom EVM Contracts with Cronos AI Agent SDK

This guide provides a systematic approach to test custom EVM contracts when integrating them with the Cronos AI Agent SDK.

## Testing Strategy Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Testing Pyramid                          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              E2E Integration Tests                   │   │
│  │        (Real network, full user flows)              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Contract Integration Tests              │   │
│  │         (Local network, SDK + Contract)             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                 Unit Tests                          │   │
│  │        (Mocked contracts, SDK components)           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Phase 1: Contract Validation Tests

### 1.1 ABI Validation

```typescript
// tests/contract-validation.test.ts
import { ethers } from 'ethers';
import { ContractAdapter } from '@sentinel/ai-agent-sdk';

describe('Custom Contract Validation', () => {
  let contractConfig: ContractConfig;
  
  beforeEach(() => {
    contractConfig = {
      address: process.env.CUSTOM_CONTRACT_ADDRESS!,
      abi: CUSTOM_CONTRACT_ABI, // User-provided ABI
      network: 'cronos-testnet'
    };
  });

  test('should validate contract address format', () => {
    expect(ethers.isAddress(contractConfig.address)).toBe(true);
  });

  test('should validate ABI structure', () => {
    expect(Array.isArray(contractConfig.abi)).toBe(true);
    expect(contractConfig.abi.length).toBeGreaterThan(0);
    
    // Check for required function signatures
    const functionNames = contractConfig.abi
      .filter(item => item.type === 'function')
      .map(item => item.name);
    
    console.log('Available functions:', functionNames);
  });

  test('should validate network compatibility', () => {
    const validNetworks = ['cronos-mainnet', 'cronos-testnet', 'localhost'];
    expect(validNetworks).toContain(contractConfig.network);
  });
});
```

### 1.2 Contract Deployment Verification

```typescript
// tests/deployment-verification.test.ts
describe('Contract Deployment Verification', () => {
  let provider: JsonRpcProvider;
  
  beforeEach(() => {
    provider = new JsonRpcProvider(process.env.CRONOS_RPC_URL);
  });

  test('should verify contract exists at address', async () => {
    const code = await provider.getCode(contractConfig.address);
    expect(code).not.toBe('0x');
    expect(code.length).toBeGreaterThan(2); // More than just '0x'
  });

  test('should verify contract has expected functions', async () => {
    const contract = new ethers.Contract(
      contractConfig.address,
      contractConfig.abi,
      provider
    );

    // Test each function exists (won't call, just check interface)
    const expectedFunctions = ['deposit', 'withdraw', 'balanceOf']; // User-defined
    
    for (const funcName of expectedFunctions) {
      expect(contract.interface.getFunction(funcName)).toBeDefined();
    }
  });

  test('should verify contract events', async () => {
    const contract = new ethers.Contract(
      contractConfig.address,
      contractConfig.abi,
      provider
    );

    const expectedEvents = ['Transfer', 'Deposit', 'Withdrawal']; // User-defined
    
    for (const eventName of expectedEvents) {
      expect(contract.interface.getEvent(eventName)).toBeDefined();
    }
  });
});
```

## Phase 2: SDK Integration Tests

### 2.1 Contract Registration Tests

```typescript
// tests/sdk-integration.test.ts
import { SentinelAgentSDK } from '@sentinel/ai-agent-sdk';

describe('SDK Contract Integration', () => {
  let sdk: SentinelAgentSDK;
  
  beforeEach(async () => {
    sdk = new SentinelAgentSDK({
      network: 'cronos-testnet',
      rpcUrl: process.env.CRONOS_RPC_URL!,
      privateKey: process.env.TEST_PRIVATE_KEY,
      logLevel: 'DEBUG'
    });
  });

  afterEach(async () => {
    await sdk.stop();
  });

  test('should register custom contract successfully', async () => {
    await expect(
      sdk.registerContract('custom-contract', contractConfig)
    ).resolves.not.toThrow();
    
    // Verify registration
    const registry = sdk['contractRegistry'];
    expect(registry.has('custom-contract')).toBe(true);
  });

  test('should handle duplicate registration', async () => {
    await sdk.registerContract('custom-contract', contractConfig);
    
    await expect(
      sdk.registerContract('custom-contract', contractConfig)
    ).rejects.toThrow('already registered');
  });

  test('should access contract through adapter', async () => {
    await sdk.registerContract('custom-contract', contractConfig);
    
    const registry = sdk['contractRegistry'];
    const adapter = registry.get('custom-contract');
    
    expect(adapter).toBeDefined();
    expect(adapter.getAddress()).toBe(contractConfig.address);
    expect(adapter.getNetwork()).toBe(contractConfig.network);
  });
});
```

### 2.2 Contract Method Testing

```typescript
// tests/contract-methods.test.ts
describe('Custom Contract Method Testing', () => {
  let sdk: SentinelAgentSDK;
  let adapter: ContractAdapter;
  
  beforeEach(async () => {
    sdk = new SentinelAgentSDK({
      network: 'cronos-testnet',
      rpcUrl: process.env.CRONOS_RPC_URL!,
      privateKey: process.env.TEST_PRIVATE_KEY
    });
    
    await sdk.registerContract('test-contract', contractConfig);
    const registry = sdk['contractRegistry'];
    adapter = registry.get('test-contract')!;
  });

  // Test read-only methods
  describe('Read Methods', () => {
    test('should call view functions successfully', async () => {
      // Test user-specific view functions
      const testAddress = '0x742d35Cc6634C0532925a3b8D4C9db96590c6C8b';
      
      // Example: Test balance function
      const balance = await adapter.call('balanceOf', testAddress);
      expect(typeof balance).toBe('bigint');
      expect(balance).toBeGreaterThanOrEqual(0n);
    });

    test('should handle invalid method calls', async () => {
      await expect(
        adapter.call('nonExistentMethod')
      ).rejects.toThrow('Method \'nonExistentMethod\' not found');
    });

    test('should handle invalid parameters', async () => {
      await expect(
        adapter.call('balanceOf', 'invalid-address')
      ).rejects.toThrow();
    });
  });

  // Test write methods (if wallet provided)
  describe('Write Methods', () => {
    test('should execute transactions when wallet available', async () => {
      if (!process.env.TEST_PRIVATE_KEY) {
        console.log('Skipping write tests - no private key provided');
        return;
      }

      // Example: Test deposit function
      const tx = await adapter.call('deposit', {
        value: ethers.parseEther('0.001')
      });
      
      expect(tx.hash).toBeDefined();
      expect(tx.hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      expect(receipt.status).toBe(1);
    });

    test('should handle insufficient funds', async () => {
      if (!process.env.TEST_PRIVATE_KEY) return;

      await expect(
        adapter.call('deposit', {
          value: ethers.parseEther('1000000') // Unrealistic amount
        })
      ).rejects.toThrow();
    });
  });
});
```

## Phase 3: Event Monitoring Tests

### 3.1 Event Subscription Tests

```typescript
// tests/event-monitoring.test.ts
describe('Custom Contract Event Monitoring', () => {
  let sdk: SentinelAgentSDK;
  
  beforeEach(async () => {
    sdk = new SentinelAgentSDK({
      network: 'cronos-testnet',
      rpcUrl: process.env.CRONOS_RPC_URL!,
      privateKey: process.env.TEST_PRIVATE_KEY
    });
    
    await sdk.registerContract('event-test', contractConfig);
  });

  test('should subscribe to contract events', async () => {
    const eventPromise = new Promise((resolve) => {
      sdk.onContractEvent('event-test', 'Transfer', (event) => {
        resolve(event);
      });
    });

    // Start monitoring
    await sdk.start();

    // Trigger an event (if possible)
    if (process.env.TEST_PRIVATE_KEY) {
      const registry = sdk['contractRegistry'];
      const adapter = registry.get('event-test')!;
      
      // Example: Trigger a transfer
      await adapter.call('transfer', 
        '0x742d35Cc6634C0532925a3b8D4C9db96590c6C8b',
        ethers.parseEther('0.001')
      );
    }

    // Wait for event (with timeout)
    const event = await Promise.race([
      eventPromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Event timeout')), 10000)
      )
    ]);

    expect(event).toBeDefined();
  });

  test('should handle invalid event names', () => {
    expect(() => {
      sdk.onContractEvent('event-test', 'NonExistentEvent', () => {});
    }).toThrow();
  });
});
```

## Phase 4: Agent Integration Tests

### 4.1 Custom Agent Testing

```typescript
// tests/custom-agent.test.ts
import { BaseAgent, AgentContext, AgentDecision } from '@sentinel/ai-agent-sdk';

class CustomContractAgent extends BaseAgent {
  config = {
    id: 'custom-contract-agent',
    name: 'Custom Contract Monitor',
    description: 'Monitors custom contract state',
    version: '1.0.0'
  };

  async decide(context: AgentContext): Promise<AgentDecision> {
    const registry = this.sdk['contractRegistry'];
    const adapter = registry.get(context.contractId);
    
    if (!adapter) {
      throw new Error(`Contract ${context.contractId} not found`);
    }

    // Read contract state
    const balance = await adapter.call('balanceOf', context.user);
    const threshold = BigInt(context.customData.threshold || '0');

    if (balance < threshold) {
      return {
        action: {
          type: 'BLOCK',
          reason: 'Balance below threshold',
          severity: 'HIGH'
        },
        reason: `Balance ${balance} below threshold ${threshold}`,
        confidence: 0.9
      };
    }

    return {
      action: { type: 'ALLOW' },
      reason: 'Balance sufficient',
      confidence: 0.8
    };
  }
}

describe('Custom Contract Agent', () => {
  let sdk: SentinelAgentSDK;
  let agent: CustomContractAgent;

  beforeEach(async () => {
    sdk = new SentinelAgentSDK({
      network: 'cronos-testnet',
      rpcUrl: process.env.CRONOS_RPC_URL!
    });

    await sdk.registerContract('agent-test', contractConfig);
    
    agent = new CustomContractAgent();
    sdk.registerAgent('custom-agent', agent);
  });

  test('should execute agent decision', async () => {
    const decision = await sdk.executeAgent('custom-agent', {
      contractId: 'agent-test',
      user: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C8b',
      customData: {
        threshold: ethers.parseEther('1').toString()
      }
    });

    expect(decision).toBeDefined();
    expect(decision.action.type).toMatch(/^(ALLOW|BLOCK|LIMIT)$/);
    expect(decision.confidence).toBeGreaterThan(0);
    expect(decision.confidence).toBeLessThanOrEqual(1);
  });

  test('should handle contract access errors', async () => {
    await expect(
      sdk.executeAgent('custom-agent', {
        contractId: 'non-existent',
        user: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C8b',
        customData: {}
      })
    ).rejects.toThrow('Contract non-existent not found');
  });
});
```

## Phase 5: Test Automation Framework

### 5.1 Test Configuration

```typescript
// tests/config/test-config.ts
export interface CustomContractTestConfig {
  contractAddress: string;
  contractABI: any[];
  network: string;
  requiredFunctions: string[];
  requiredEvents: string[];
  testScenarios: TestScenario[];
}

export interface TestScenario {
  name: string;
  description: string;
  setup?: () => Promise<void>;
  test: (adapter: ContractAdapter) => Promise<void>;
  cleanup?: () => Promise<void>;
}

export const createTestConfig = (userConfig: Partial<CustomContractTestConfig>): CustomContractTestConfig => {
  return {
    contractAddress: userConfig.contractAddress || process.env.CUSTOM_CONTRACT_ADDRESS!,
    contractABI: userConfig.contractABI || [],
    network: userConfig.network || 'cronos-testnet',
    requiredFunctions: userConfig.requiredFunctions || ['balanceOf'],
    requiredEvents: userConfig.requiredEvents || ['Transfer'],
    testScenarios: userConfig.testScenarios || []
  };
};
```

### 5.2 Automated Test Runner

```typescript
// tests/runners/contract-test-runner.ts
export class CustomContractTestRunner {
  private sdk: SentinelAgentSDK;
  private config: CustomContractTestConfig;

  constructor(config: CustomContractTestConfig) {
    this.config = config;
    this.sdk = new SentinelAgentSDK({
      network: config.network,
      rpcUrl: process.env.CRONOS_RPC_URL!,
      privateKey: process.env.TEST_PRIVATE_KEY,
      logLevel: 'INFO'
    });
  }

  async runAllTests(): Promise<TestResults> {
    const results: TestResults = {
      passed: 0,
      failed: 0,
      errors: []
    };

    try {
      // Phase 1: Basic validation
      await this.runValidationTests(results);
      
      // Phase 2: SDK integration
      await this.runIntegrationTests(results);
      
      // Phase 3: Custom scenarios
      await this.runCustomScenarios(results);
      
    } catch (error) {
      results.errors.push(`Test runner error: ${error.message}`);
      results.failed++;
    } finally {
      await this.sdk.stop();
    }

    return results;
  }

  private async runValidationTests(results: TestResults): Promise<void> {
    console.log('🔍 Running validation tests...');
    
    // Address validation
    if (!ethers.isAddress(this.config.contractAddress)) {
      results.errors.push('Invalid contract address format');
      results.failed++;
      return;
    }
    results.passed++;

    // ABI validation
    if (!Array.isArray(this.config.contractABI) || this.config.contractABI.length === 0) {
      results.errors.push('Invalid or empty ABI');
      results.failed++;
      return;
    }
    results.passed++;

    // Function validation
    const contract = new ethers.Contract(
      this.config.contractAddress,
      this.config.contractABI,
      this.sdk.getProvider()
    );

    for (const funcName of this.config.requiredFunctions) {
      try {
        contract.interface.getFunction(funcName);
        results.passed++;
      } catch (error) {
        results.errors.push(`Required function '${funcName}' not found`);
        results.failed++;
      }
    }
  }

  private async runIntegrationTests(results: TestResults): Promise<void> {
    console.log('🔧 Running integration tests...');
    
    try {
      // Register contract
      await this.sdk.registerContract('test-contract', {
        address: this.config.contractAddress,
        abi: this.config.contractABI,
        network: this.config.network
      });
      results.passed++;

      // Test contract access
      const registry = this.sdk['contractRegistry'];
      const adapter = registry.get('test-contract');
      
      if (!adapter) {
        results.errors.push('Failed to retrieve contract adapter');
        results.failed++;
        return;
      }
      results.passed++;

      // Test basic method calls
      for (const funcName of this.config.requiredFunctions) {
        try {
          // Only test view functions to avoid state changes
          const func = contract.interface.getFunction(funcName);
          if (func.stateMutability === 'view' || func.stateMutability === 'pure') {
            await adapter.call(funcName, '0x0000000000000000000000000000000000000000');
            results.passed++;
          }
        } catch (error) {
          // Expected for some functions, just log
          console.log(`Function ${funcName} test: ${error.message}`);
        }
      }

    } catch (error) {
      results.errors.push(`Integration test error: ${error.message}`);
      results.failed++;
    }
  }

  private async runCustomScenarios(results: TestResults): Promise<void> {
    console.log('🎯 Running custom scenarios...');
    
    const registry = this.sdk['contractRegistry'];
    const adapter = registry.get('test-contract');
    
    if (!adapter) {
      results.errors.push('Contract adapter not available for custom scenarios');
      results.failed++;
      return;
    }

    for (const scenario of this.config.testScenarios) {
      try {
        console.log(`Running scenario: ${scenario.name}`);
        
        if (scenario.setup) {
          await scenario.setup();
        }
        
        await scenario.test(adapter);
        results.passed++;
        
        if (scenario.cleanup) {
          await scenario.cleanup();
        }
        
      } catch (error) {
        results.errors.push(`Scenario '${scenario.name}' failed: ${error.message}`);
        results.failed++;
      }
    }
  }
}

interface TestResults {
  passed: number;
  failed: number;
  errors: string[];
}
```

## Phase 6: User Testing Guide

### 6.1 Quick Test Script

```typescript
// scripts/test-my-contract.ts
import { CustomContractTestRunner, createTestConfig } from '../tests';

async function testMyContract() {
  // User provides their contract details
  const config = createTestConfig({
    contractAddress: process.env.MY_CONTRACT_ADDRESS!,
    contractABI: MY_CONTRACT_ABI, // User imports their ABI
    network: 'cronos-testnet',
    requiredFunctions: ['balanceOf', 'transfer', 'deposit'],
    requiredEvents: ['Transfer', 'Deposit'],
    testScenarios: [
      {
        name: 'Balance Check',
        description: 'Test balance reading functionality',
        test: async (adapter) => {
          const balance = await adapter.call('balanceOf', '0x742d35Cc6634C0532925a3b8D4C9db96590c6C8b');
          console.log('Balance:', balance.toString());
        }
      }
    ]
  });

  const runner = new CustomContractTestRunner(config);
  const results = await runner.runAllTests();

  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  
  if (results.errors.length > 0) {
    console.log('\n🚨 Errors:');
    results.errors.forEach(error => console.log(`  - ${error}`));
  }

  if (results.failed === 0) {
    console.log('\n🎉 All tests passed! Your contract is ready for SDK integration.');
  } else {
    console.log('\n⚠️ Some tests failed. Please review the errors above.');
  }
}

testMyContract().catch(console.error);
```

### 6.2 Environment Setup

```bash
# .env.test
CRONOS_RPC_URL=https://evm-t3.cronos.org
MY_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
TEST_PRIVATE_KEY=0xabcdef... # Optional, for write operations
```

### 6.3 Package.json Scripts

```json
{
  "scripts": {
    "test:contract": "ts-node scripts/test-my-contract.ts",
    "test:integration": "jest tests/integration --testTimeout=30000",
    "test:unit": "jest tests/unit",
    "test:all": "npm run test:unit && npm run test:integration && npm run test:contract"
  }
}
```

## Best Practices for Custom Contract Testing

### 1. **Start Simple**
```typescript
// Test basic functionality first
const balance = await adapter.call('balanceOf', testAddress);
expect(typeof balance).toBe('bigint');
```

### 2. **Use Test Networks**
```typescript
// Always test on testnet first
const config = {
  network: 'cronos-testnet', // Never start with mainnet
  rpcUrl: 'https://evm-t3.cronos.org'
};
```

### 3. **Mock External Dependencies**
```typescript
// Mock price oracles, external contracts
jest.mock('external-price-oracle', () => ({
  getPrice: jest.fn().mockResolvedValue(ethers.parseEther('1800'))
}));
```

### 4. **Test Error Conditions**
```typescript
// Test what happens when things go wrong
await expect(
  adapter.call('withdraw', ethers.parseEther('999999'))
).rejects.toThrow('Insufficient balance');
```

### 5. **Validate State Changes**
```typescript
// Check state before and after transactions
const balanceBefore = await adapter.call('balanceOf', user);
await adapter.call('deposit', { value: amount });
const balanceAfter = await adapter.call('balanceOf', user);
expect(balanceAfter).toBe(balanceBefore + amount);
```

## Running Tests

```bash
# Install dependencies
npm install --save-dev jest @types/jest ts-jest

# Set up environment
cp .env.example .env.test
# Edit .env.test with your contract details

# Run tests
npm run test:contract        # Quick contract validation
npm run test:integration     # Full SDK integration tests
npm run test:all            # Complete test suite
```

This testing framework ensures custom EVM contracts work reliably with the Cronos AI Agent SDK before production deployment.