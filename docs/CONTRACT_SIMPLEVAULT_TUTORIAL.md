# Contract Management Tutorial: SimpleVault Example

This tutorial demonstrates the **Contract Management System** using SimpleVault as a practical example. You'll learn how ContractAdapter and ContractRegistry work in real scenarios.

## Prerequisites

- SimpleVault deployed at: `0xe30093CF82Cb6bc4176a2e1F60B66DFb02811E8a`
- Environment configured with `SIMPLE_VAULT_ADDRESS`
- Basic understanding of smart contracts

## SimpleVault Contract Overview

SimpleVault is a basic vault contract with these key functions:
```solidity
contract SimpleVault {
    function deposit() payable external;
    function withdraw(uint256 amount) external;
    function balances(address user) view returns (uint256);
    function recommendedWithdrawLimit(address user) view returns (uint256);
    function agentSetWithdrawLimit(address user, uint256 newLimit, string reason) external;
    
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event AgentRecommendation(address indexed agent, address indexed user, uint256 newLimit, string reason);
}
```

## Step 1: Define Contract Configuration

First, create the ABI and configuration for SimpleVault:

```typescript
// simplevault-config.ts
import { ContractConfig } from '@sentinel/ai-agent-sdk';

export const SIMPLE_VAULT_ABI = [
  // Read functions
  'function balances(address user) view returns (uint256)',
  'function recommendedWithdrawLimit(address user) view returns (uint256)',
  'function owner() view returns (address)',
  
  // Write functions  
  'function deposit() payable',
  'function withdraw(uint256 amount)',
  'function agentSetWithdrawLimit(address user, uint256 newLimit, string reason)',
  
  // Events
  'event Deposited(address indexed user, uint256 amount)',
  'event Withdrawn(address indexed user, uint256 amount)', 
  'event AgentRecommendation(address indexed agent, address indexed user, uint256 newLimit, string reason)'
];

export const simpleVaultConfig: ContractConfig = {
  address: process.env.SIMPLE_VAULT_ADDRESS || '0xe30093CF82Cb6bc4176a2e1F60B66DFb02811E8a',
  abi: SIMPLE_VAULT_ABI,
  network: 'cronos-testnet',
  name: 'SimpleVault Demo'
};
```

## Step 2: Initialize Contract Management

```typescript
// contract-demo.ts
import { SentinelAgentSDK } from '@sentinel/ai-agent-sdk';
import { JsonRpcProvider } from 'ethers';
import { simpleVaultConfig } from './simplevault-config';

async function initializeContractManagement() {
  // Initialize SDK
  const sdk = new SentinelAgentSDK({
    network: 'cronos-testnet',
    rpcUrl: 'https://evm-t3.cronos.org',
    privateKey: process.env.AGENT_PRIVATE_KEY
  });

  console.log('✅ SDK initialized');
  
  // Register SimpleVault contract
  await sdk.registerContract('simple-vault', simpleVaultConfig);
  
  console.log('✅ SimpleVault registered with ID: simple-vault');
  console.log('📍 Contract address:', simpleVaultConfig.address);
  
  return sdk;
}
```

## Step 3: Access Contract Through Registry

```typescript
async function demonstrateContractAccess(sdk: SentinelAgentSDK) {
  console.log('\n🔍 Demonstrating Contract Access...\n');
  
  // Get contract registry (internal SDK component)
  const registry = sdk['contractRegistry']; // Access internal registry
  
  // Method 1: Check if contract exists
  const exists = registry.has('simple-vault');
  console.log('Contract exists in registry:', exists);
  
  // Method 2: Get contract adapter
  const vaultAdapter = registry.get('simple-vault');
  if (!vaultAdapter) {
    throw new Error('SimpleVault not found in registry');
  }
  
  console.log('✅ Retrieved contract adapter');
  console.log('📍 Address:', vaultAdapter.getAddress());
  console.log('🌐 Network:', vaultAdapter.getNetwork());
  
  // Method 3: List all registered contracts
  const allContracts = registry.list();
  console.log('📋 All registered contracts:', allContracts);
  
  return vaultAdapter;
}
```

## Step 4: Read Contract State

```typescript
async function readContractState(vaultAdapter: ContractAdapter, userAddress: string) {
  console.log('\n📖 Reading Contract State...\n');
  
  try {
    // Read user balance
    const balance = await vaultAdapter.call('balances', userAddress);
    console.log(`💰 User balance: ${balance.toString()} wei`);
    
    // Read recommended withdraw limit
    const limit = await vaultAdapter.call('recommendedWithdrawLimit', userAddress);
    console.log(`🚦 Withdraw limit: ${limit.toString()} wei`);
    
    // Read contract owner
    const owner = await vaultAdapter.call('owner');
    console.log(`👑 Contract owner: ${owner}`);
    
    return { balance, limit, owner };
    
  } catch (error) {
    console.error('❌ Error reading contract state:', error.message);
    throw error;
  }
}
```

## Step 5: Execute Contract Transactions

```typescript
import { ethers } from 'ethers';

async function executeContractTransactions(vaultAdapter: ContractAdapter, userAddress: string) {
  console.log('\n💸 Executing Contract Transactions...\n');
  
  try {
    // Example 1: Make a deposit
    console.log('Making deposit of 0.1 ETH...');
    const depositTx = await vaultAdapter.call('deposit', {
      value: ethers.parseEther('0.1')
    });
    console.log('📝 Deposit transaction:', depositTx.hash);
    
    // Wait for confirmation
    await depositTx.wait();
    console.log('✅ Deposit confirmed');
    
    // Example 2: Set withdrawal limit (agent function)
    console.log('Setting withdrawal limit...');
    const newLimit = ethers.parseEther('0.05'); // 0.05 ETH limit
    const reason = 'Risk management: Conservative limit';
    
    const limitTx = await vaultAdapter.call('agentSetWithdrawLimit', 
      userAddress, 
      newLimit, 
      reason
    );
    console.log('📝 Limit transaction:', limitTx.hash);
    
    await limitTx.wait();
    console.log('✅ Limit set successfully');
    
    // Example 3: Attempt withdrawal
    console.log('Attempting withdrawal...');
    const withdrawAmount = ethers.parseEther('0.02'); // 0.02 ETH
    
    const withdrawTx = await vaultAdapter.call('withdraw', withdrawAmount);
    console.log('📝 Withdrawal transaction:', withdrawTx.hash);
    
    await withdrawTx.wait();
    console.log('✅ Withdrawal completed');
    
  } catch (error) {
    console.error('❌ Transaction failed:', error.message);
    
    // Handle specific error cases
    if (error.message.includes('insufficient balance')) {
      console.log('💡 Tip: Deposit more funds before withdrawing');
    } else if (error.message.includes('exceeds limit')) {
      console.log('💡 Tip: Withdrawal amount exceeds recommended limit');
    }
  }
}
```

## Step 6: Monitor Contract Events

```typescript
async function monitorContractEvents(sdk: SentinelAgentSDK) {
  console.log('\n📡 Setting up Event Monitoring...\n');
  
  // Monitor deposit events
  const depositSubscription = sdk.onContractEvent('simple-vault', 'Deposited', async (event) => {
    console.log('🔔 DEPOSIT EVENT:', {
      user: event.args.user,
      amount: ethers.formatEther(event.args.amount),
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash
    });
    
    // Automatically check new balance after deposit
    const registry = sdk['contractRegistry'];
    const vaultAdapter = registry.get('simple-vault');
    const newBalance = await vaultAdapter.call('balances', event.args.user);
    
    console.log(`💰 Updated balance: ${ethers.formatEther(newBalance)} ETH`);
  });
  
  // Monitor withdrawal events
  const withdrawSubscription = sdk.onContractEvent('simple-vault', 'Withdrawn', async (event) => {
    console.log('🔔 WITHDRAWAL EVENT:', {
      user: event.args.user,
      amount: ethers.formatEther(event.args.amount),
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash
    });
  });
  
  // Monitor agent recommendation events
  const agentSubscription = sdk.onContractEvent('simple-vault', 'AgentRecommendation', async (event) => {
    console.log('🔔 AGENT RECOMMENDATION EVENT:', {
      agent: event.args.agent,
      user: event.args.user,
      newLimit: ethers.formatEther(event.args.newLimit),
      reason: event.args.reason,
      blockNumber: event.blockNumber
    });
  });
  
  console.log('✅ Event listeners registered');
  console.log('🎧 Listening for: Deposited, Withdrawn, AgentRecommendation');
  
  return { depositSubscription, withdrawSubscription, agentSubscription };
}
```

## Step 7: Error Handling and Validation

```typescript
async function demonstrateErrorHandling(vaultAdapter: ContractAdapter) {
  console.log('\n🚨 Demonstrating Error Handling...\n');
  
  // Test 1: Call non-existent method
  try {
    await vaultAdapter.call('nonExistentMethod');
  } catch (error) {
    console.log('✅ Caught expected error:', error.message);
    // Expected: "Method 'nonExistentMethod' not found on contract"
  }
  
  // Test 2: Call with wrong parameters
  try {
    await vaultAdapter.call('balances'); // Missing required parameter
  } catch (error) {
    console.log('✅ Caught parameter error:', error.message);
  }
  
  // Test 3: Network validation
  const network = vaultAdapter.getNetwork();
  if (network !== 'cronos-testnet') {
    console.warn('⚠️ Network mismatch detected:', network);
  } else {
    console.log('✅ Network validation passed');
  }
  
  // Test 4: Address validation
  const address = vaultAdapter.getAddress();
  if (!ethers.isAddress(address)) {
    throw new Error('Invalid contract address');
  } else {
    console.log('✅ Address validation passed');
  }
}
```

## Step 8: Multi-Contract Management

```typescript
async function demonstrateMultiContractManagement(sdk: SentinelAgentSDK) {
  console.log('\n🏗️ Demonstrating Multi-Contract Management...\n');
  
  // Register multiple contracts (simulating different vaults)
  const contracts = [
    {
      id: 'vault-main',
      config: { ...simpleVaultConfig, name: 'Main Vault' }
    },
    {
      id: 'vault-backup', 
      config: { ...simpleVaultConfig, name: 'Backup Vault' }
    },
    {
      id: 'vault-emergency',
      config: { ...simpleVaultConfig, name: 'Emergency Vault' }
    }
  ];
  
  // Register all contracts
  for (const { id, config } of contracts) {
    await sdk.registerContract(id, config);
    console.log(`✅ Registered: ${id} (${config.name})`);
  }
  
  // Access registry to list all contracts
  const registry = sdk['contractRegistry'];
  const allContracts = registry.list();
  console.log('📋 All registered contracts:', allContracts);
  
  // Demonstrate accessing different contracts
  for (const contractId of allContracts) {
    const adapter = registry.get(contractId);
    console.log(`📍 ${contractId}: ${adapter.getAddress()} on ${adapter.getNetwork()}`);
  }
  
  // Clean up - unregister backup contracts
  registry.unregister('vault-backup');
  registry.unregister('vault-emergency');
  
  console.log('🧹 Cleaned up backup contracts');
  console.log('📋 Remaining contracts:', registry.list());
}
```

## Step 9: Integration with AI Agents

```typescript
import { BaseAgent, AgentContext, AgentDecision } from '@sentinel/ai-agent-sdk';

class SimpleVaultAgent extends BaseAgent {
  config = {
    id: 'simple-vault-monitor',
    name: 'SimpleVault Monitor',
    description: 'Monitors SimpleVault and recommends safe withdrawal limits',
    version: '1.0.0'
  };

  async decide(context: AgentContext): Promise<AgentDecision> {
    // Get contract adapter from registry
    const registry = this.sdk['contractRegistry'];
    const vaultAdapter = registry.get(context.contractId);
    
    if (!vaultAdapter) {
      throw new Error(`Contract ${context.contractId} not found`);
    }
    
    // Read current state using contract adapter
    const balance = await vaultAdapter.call('balances', context.user);
    const currentLimit = await vaultAdapter.call('recommendedWithdrawLimit', context.user);
    
    // Calculate safe limit (50% of balance)
    const safeLimit = balance / 2n;
    
    // Make decision
    if (currentLimit > safeLimit) {
      return {
        action: {
          type: 'LIMIT',
          value: safeLimit.toString(),
          reason: 'Reducing limit to 50% of balance for safety',
          severity: 'MEDIUM'
        },
        reason: `Current limit ${currentLimit} exceeds safe threshold`,
        confidence: 0.8,
        metadata: {
          balance: balance.toString(),
          currentLimit: currentLimit.toString(),
          recommendedLimit: safeLimit.toString()
        }
      };
    }
    
    return {
      action: { type: 'ALLOW' },
      reason: 'Current limit is within safe range',
      confidence: 0.9
    };
  }
}

async function demonstrateAgentIntegration(sdk: SentinelAgentSDK, userAddress: string) {
  console.log('\n🤖 Demonstrating Agent Integration...\n');
  
  // Register the agent
  sdk.registerAgent('vault-monitor', new SimpleVaultAgent());
  
  // Execute agent decision
  const decision = await sdk.executeAgent('vault-monitor', {
    contractId: 'simple-vault',
    user: userAddress,
    customData: {}
  });
  
  console.log('🤖 Agent decision:', {
    action: decision.action.type,
    reason: decision.reason,
    confidence: decision.confidence
  });
  
  // Apply decision if needed
  if (decision.action.type === 'LIMIT') {
    const registry = sdk['contractRegistry'];
    const vaultAdapter = registry.get('simple-vault');
    
    try {
      const tx = await vaultAdapter.call('agentSetWithdrawLimit',
        userAddress,
        decision.action.value,
        decision.action.reason
      );
      
      await tx.wait();
      console.log('✅ Agent recommendation applied on-chain');
      
    } catch (error) {
      console.error('❌ Failed to apply agent decision:', error.message);
    }
  }
}
```

## Step 10: Complete Example

```typescript
// complete-example.ts
import { SentinelAgentSDK } from '@sentinel/ai-agent-sdk';
import { ethers } from 'ethers';
import { simpleVaultConfig } from './simplevault-config';

async function runCompleteExample() {
  console.log('🚀 SimpleVault Contract Management Tutorial\n');
  
  try {
    // Step 1: Initialize
    const sdk = await initializeContractManagement();
    
    // Step 2: Demonstrate contract access
    const vaultAdapter = await demonstrateContractAccess(sdk);
    
    // Step 3: Read contract state
    const userAddress = '0x742d35Cc6634C0532925a3b8D4C9db96590c6C8b'; // Example address
    await readContractState(vaultAdapter, userAddress);
    
    // Step 4: Error handling
    await demonstrateErrorHandling(vaultAdapter);
    
    // Step 5: Multi-contract management
    await demonstrateMultiContractManagement(sdk);
    
    // Step 6: Set up event monitoring
    const subscriptions = await monitorContractEvents(sdk);
    
    // Step 7: Agent integration
    await demonstrateAgentIntegration(sdk, userAddress);
    
    // Step 8: Start SDK (enables event monitoring)
    await sdk.start();
    console.log('✅ SDK started - event monitoring active');
    
    // Keep running for 30 seconds to catch events
    console.log('⏱️ Monitoring events for 30 seconds...');
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    // Cleanup
    await sdk.stop();
    console.log('🛑 SDK stopped');
    
  } catch (error) {
    console.error('❌ Tutorial failed:', error.message);
    process.exit(1);
  }
}

// Run the example
if (require.main === module) {
  runCompleteExample().catch(console.error);
}
```

## Key Takeaways

### 1. **Contract Registration**
```typescript
// Simple registration with ID
await sdk.registerContract('simple-vault', {
  address: '0xe30093CF82Cb6bc4176a2e1F60B66DFb02811E8a',
  abi: SIMPLE_VAULT_ABI,
  network: 'cronos-testnet'
});
```

### 2. **Contract Access**
```typescript
// Get adapter by ID
const adapter = registry.get('simple-vault');

// Call any contract method
const balance = await adapter.call('balances', userAddress);
const tx = await adapter.call('deposit', { value: ethers.parseEther('1') });
```

### 3. **Event Monitoring**
```typescript
// Automatic event listening
sdk.onContractEvent('simple-vault', 'Deposited', async (event) => {
  console.log('Deposit detected:', event.args);
});
```

### 4. **Agent Integration**
```typescript
// Agents access contracts through registry
const adapter = registry.get(context.contractId);
const state = await adapter.call('balances', context.user);
```

## Environment Setup

Create `.env` file:
```bash
# Required
AGENT_PRIVATE_KEY=0x1234567890abcdef...
SIMPLE_VAULT_ADDRESS=0xe30093CF82Cb6bc4176a2e1F60B66DFb02811E8a

# Optional
OPENAI_API_KEY=sk-proj-...
CRONOS_TESTNET_RPC=https://evm-t3.cronos.org
```

## Running the Tutorial

```bash
# Install dependencies
npm install @sentinel/ai-agent-sdk ethers

# Run the complete example
npx ts-node complete-example.ts
```

This tutorial demonstrates how the Contract Management System provides a clean, standardized way to interact with any smart contract - using SimpleVault as a practical example that you can run and test immediately.

## Next Steps

1. **Deploy your own SimpleVault** using the provided address as reference
2. **Modify the agent logic** to implement custom risk management
3. **Add more contracts** to see multi-contract management in action
4. **Integrate with the UI components** for a complete dashboard experience

The Contract Management System makes it easy to build protocol-agnostic AI agents that work with any smart contract on Cronos!