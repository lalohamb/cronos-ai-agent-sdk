# Contract Management System

The Cronos AI Agent SDK provides a powerful contract management system that allows AI agents to interact with any smart contract in a protocol-agnostic way.

## Overview

The contract system consists of three main components:

- **ContractAdapter** - Wraps individual smart contracts
- **ContractRegistry** - Manages multiple contracts by ID
- **ContractConfig** - Configuration interface for contracts

## ContractAdapter

### Purpose
Provides a standardized interface for AI agents to interact with any smart contract, abstracting away the complexity of direct ethers.js Contract calls.

### Key Features
- **Protocol Agnostic** - Works with any EVM smart contract
- **Method Validation** - Ensures methods exist before calling
- **Network Awareness** - Tracks deployment network
- **Error Handling** - Standardized error messages

### API Reference

#### Constructor
```typescript
new ContractAdapter(config: ContractConfig, provider: Provider)
```

#### Methods

##### `call(method: string, ...args: any[]): Promise<any>`
Execute any contract method safely.

```typescript
// Read operations
const balance = await adapter.call('balanceOf', userAddress);
const totalSupply = await adapter.call('totalSupply');

// Write operations (requires signer)
const tx = await adapter.call('deposit', { value: ethers.parseEther('1') });
const result = await adapter.call('transfer', recipient, amount);
```

##### `getContract(): Contract`
Get the underlying ethers Contract instance.

```typescript
const contract = adapter.getContract();
// Direct ethers.js access if needed
```

##### `getAddress(): string`
Get the contract address.

```typescript
const address = adapter.getAddress(); // "0x123..."
```

##### `getNetwork(): string`
Get the deployment network.

```typescript
const network = adapter.getNetwork(); // "cronos-testnet"
```

### Usage Examples

#### Basic Contract Interaction
```typescript
import { ContractAdapter } from '@sentinel/ai-agent-sdk';
import { JsonRpcProvider } from 'ethers';

const provider = new JsonRpcProvider('https://evm-t3.cronos.org');

const vaultAdapter = new ContractAdapter({
  address: '0x123...',
  abi: [
    'function balanceOf(address user) view returns (uint256)',
    'function deposit() payable',
    'function withdraw(uint256 amount)'
  ],
  network: 'cronos-testnet'
}, provider);

// Check balance
const balance = await vaultAdapter.call('balanceOf', userAddress);

// Make deposit
const tx = await vaultAdapter.call('deposit', { value: ethers.parseEther('1') });
```

#### Error Handling
```typescript
try {
  const result = await adapter.call('nonExistentMethod');
} catch (error) {
  console.error(error.message); // "Method 'nonExistentMethod' not found on contract"
}
```

## ContractRegistry

### Purpose
Central registry that manages multiple contracts by friendly IDs, allowing agents to reference contracts by name instead of remembering addresses.

### Key Features
- **ID-based Access** - Reference contracts by meaningful names
- **Centralized Management** - Single place to manage all contracts
- **Provider Integration** - Automatically uses the same provider for all contracts
- **Lifecycle Management** - Register/unregister contracts dynamically

### API Reference

#### Constructor
```typescript
new ContractRegistry(provider: Provider)
```

#### Methods

##### `register(id: string, config: ContractConfig): ContractAdapter`
Register a new contract with a friendly ID.

```typescript
const adapter = registry.register('my-vault', {
  address: '0x123...',
  abi: vaultABI,
  network: 'cronos-testnet'
});
```

##### `unregister(id: string): boolean`
Remove a contract from the registry.

```typescript
const removed = registry.unregister('my-vault'); // true if existed
```

##### `get(id: string): ContractAdapter | undefined`
Retrieve a contract adapter by ID.

```typescript
const adapter = registry.get('my-vault');
if (adapter) {
  const balance = await adapter.call('balanceOf', user);
}
```

##### `has(id: string): boolean`
Check if a contract is registered.

```typescript
if (registry.has('my-vault')) {
  // Contract exists
}
```

##### `list(): string[]`
Get all registered contract IDs.

```typescript
const contractIds = registry.list(); // ['my-vault', 'my-dex', ...]
```

##### `clear(): void`
Remove all registered contracts.

```typescript
registry.clear();
```

### Usage Examples

#### Multi-Contract Management
```typescript
import { ContractRegistry } from '@sentinel/ai-agent-sdk';
import { JsonRpcProvider } from 'ethers';

const provider = new JsonRpcProvider('https://evm-t3.cronos.org');
const registry = new ContractRegistry(provider);

// Register multiple contracts
registry.register('vault', {
  address: '0x123...',
  abi: vaultABI,
  network: 'cronos-testnet'
});

registry.register('dex', {
  address: '0x456...',
  abi: dexABI,
  network: 'cronos-testnet'
});

registry.register('nft', {
  address: '0x789...',
  abi: nftABI,
  network: 'cronos-testnet'
});

// Use contracts by ID
const vaultBalance = await registry.get('vault').call('balanceOf', user);
const dexPrice = await registry.get('dex').call('getPrice', tokenA, tokenB);
const nftOwner = await registry.get('nft').call('ownerOf', tokenId);
```

#### Dynamic Contract Management
```typescript
// Add contracts at runtime
function addUserVault(userId: string, vaultAddress: string) {
  registry.register(`vault-${userId}`, {
    address: vaultAddress,
    abi: vaultABI,
    network: 'cronos-testnet'
  });
}

// Remove when no longer needed
function removeUserVault(userId: string) {
  registry.unregister(`vault-${userId}`);
}

// List all user vaults
function getUserVaults(): string[] {
  return registry.list().filter(id => id.startsWith('vault-'));
}
```

## ContractConfig Interface

### Definition
```typescript
interface ContractConfig {
  address: string;    // Contract address (0x...)
  abi: any[];        // Contract ABI array
  network: string;   // Network name (cronos-testnet, cronos-mainnet)
  name?: string;     // Optional human-readable name
}
```

### Examples

#### Vault Contract
```typescript
const vaultConfig: ContractConfig = {
  address: '0x123456789012345678901234567890123456789',
  abi: [
    'function deposit() payable',
    'function withdraw(uint256 amount)',
    'function balanceOf(address user) view returns (uint256)',
    'event Deposited(address indexed user, uint256 amount)'
  ],
  network: 'cronos-testnet',
  name: 'My Vault'
};
```

#### DEX Contract
```typescript
const dexConfig: ContractConfig = {
  address: '0x456789012345678901234567890123456789012',
  abi: [
    'function swap(address tokenIn, address tokenOut, uint256 amountIn)',
    'function getPrice(address tokenA, address tokenB) view returns (uint256)',
    'function addLiquidity(address tokenA, address tokenB, uint256 amountA, uint256 amountB)',
    'event Swap(address indexed user, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut)'
  ],
  network: 'cronos-testnet',
  name: 'My DEX'
};
```

## Integration with AI Agents

### Agent Contract Access
AI agents can access contracts through the SDK's registry:

```typescript
class MyCustomAgent extends BaseAgent {
  async execute(context: AgentContext): Promise<AgentDecision> {
    // Get contract from registry
    const registry = this.sdk.getContractRegistry();
    const vaultAdapter = registry.get(context.contractId);
    
    if (!vaultAdapter) {
      throw new Error(`Contract ${context.contractId} not found`);
    }
    
    // Check contract state
    const balance = await vaultAdapter.call('balanceOf', context.user);
    const threshold = context.customData.threshold;
    
    // Make decision based on contract state
    if (balance < threshold) {
      return {
        action: { type: 'BLOCK', severity: 'HIGH' },
        reason: 'Balance below threshold',
        confidence: 0.95
      };
    }
    
    return {
      action: { type: 'ALLOW' },
      reason: 'Balance sufficient',
      confidence: 0.9
    };
  }
}
```

### Event-Driven Automation
```typescript
// Register contract
await sdk.registerContract('vault', vaultConfig);

// Listen for events and trigger agents
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
    // Take protective action
    const vaultAdapter = sdk.getContractRegistry().get('vault');
    await vaultAdapter.call('emergencyStop');
  }
});
```

## Best Practices

### 1. Use Meaningful IDs
```typescript
// Good
registry.register('user-vault-main', config);
registry.register('dex-uniswap-v3', config);

// Avoid
registry.register('contract1', config);
registry.register('c2', config);
```

### 2. Validate Contract Existence
```typescript
const adapter = registry.get('my-vault');
if (!adapter) {
  throw new Error('Vault contract not registered');
}
```

### 3. Handle Network Mismatches
```typescript
const adapter = registry.get('my-vault');
if (adapter.getNetwork() !== expectedNetwork) {
  throw new Error(`Contract on wrong network: ${adapter.getNetwork()}`);
}
```

### 4. Group Related Contracts
```typescript
// Group by protocol
registry.register('aave-lending-pool', config);
registry.register('aave-price-oracle', config);

// Group by user
registry.register(`vault-${userId}`, config);
registry.register(`strategy-${userId}`, config);
```

### 5. Clean Up Unused Contracts
```typescript
// Remove contracts when users disconnect
function cleanupUserContracts(userId: string) {
  const userContracts = registry.list().filter(id => id.includes(userId));
  userContracts.forEach(id => registry.unregister(id));
}
```

## Error Handling

### Common Errors

#### Method Not Found
```typescript
try {
  await adapter.call('invalidMethod');
} catch (error) {
  // Error: Method 'invalidMethod' not found on contract
}
```

#### Contract Not Registered
```typescript
const adapter = registry.get('nonexistent');
if (!adapter) {
  throw new Error('Contract not found in registry');
}
```

#### Network Connection Issues
```typescript
try {
  const result = await adapter.call('balanceOf', user);
} catch (error) {
  if (error.code === 'NETWORK_ERROR') {
    // Handle network issues
  }
}
```

## Testing

### Unit Testing Contracts
```typescript
import { ContractAdapter, ContractRegistry } from '@sentinel/ai-agent-sdk';
import { JsonRpcProvider } from 'ethers';

describe('ContractAdapter', () => {
  let adapter: ContractAdapter;
  let provider: JsonRpcProvider;
  
  beforeEach(() => {
    provider = new JsonRpcProvider('http://localhost:8545');
    adapter = new ContractAdapter({
      address: '0x123...',
      abi: ['function balanceOf(address) view returns (uint256)'],
      network: 'localhost'
    }, provider);
  });
  
  it('should call contract methods', async () => {
    const balance = await adapter.call('balanceOf', '0xabc...');
    expect(balance).toBeDefined();
  });
  
  it('should throw for invalid methods', async () => {
    await expect(adapter.call('invalidMethod')).rejects.toThrow();
  });
});
```

### Integration Testing
```typescript
describe('Contract Integration', () => {
  it('should work with real contracts', async () => {
    const sdk = new SentinelAgentSDK({
      network: 'cronos-testnet',
      rpcUrl: 'https://evm-t3.cronos.org'
    });
    
    await sdk.registerContract('test-vault', {
      address: process.env.VAULT_ADDRESS,
      abi: vaultABI,
      network: 'cronos-testnet'
    });
    
    const result = await sdk.executeAgent('risk-monitor', {
      contractId: 'test-vault',
      user: '0x123...'
    });
    
    expect(result.action).toBeDefined();
  });
});
```

## Advanced Usage

### Custom Contract Wrappers
```typescript
class VaultAdapter extends ContractAdapter {
  async getBalance(user: string): Promise<bigint> {
    return await this.call('balanceOf', user);
  }
  
  async deposit(amount: bigint): Promise<any> {
    return await this.call('deposit', { value: amount });
  }
  
  async withdraw(amount: bigint): Promise<any> {
    return await this.call('withdraw', amount);
  }
}
```

### Multi-Network Support
```typescript
const mainnetRegistry = new ContractRegistry(mainnetProvider);
const testnetRegistry = new ContractRegistry(testnetProvider);

// Same contract on different networks
mainnetRegistry.register('vault', { ...config, network: 'cronos-mainnet' });
testnetRegistry.register('vault', { ...config, network: 'cronos-testnet' });
```

### Contract Factories
```typescript
class ContractFactory {
  static createVault(address: string, network: string): ContractConfig {
    return {
      address,
      abi: VAULT_ABI,
      network,
      name: `Vault at ${address}`
    };
  }
  
  static createDEX(address: string, network: string): ContractConfig {
    return {
      address,
      abi: DEX_ABI,
      network,
      name: `DEX at ${address}`
    };
  }
}
```

This contract management system provides the foundation for protocol-agnostic AI agents that can work with any smart contract on Cronos or other EVM networks.