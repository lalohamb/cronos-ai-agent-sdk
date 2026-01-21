# Setup Guide - Making Examples Work

## Current Status

✅ **SDK Core is Complete** - All code examples will work once you:
1. Deploy smart contracts
2. Set environment variables
3. Install dependencies

## What's Already Working

The SDK itself is **production-ready** and includes:
- ✅ All 5 built-in agents (RiskMonitor, LiquidityOptimizer, etc.)
- ✅ Event listening system
- ✅ Policy engine
- ✅ AI integration (OpenAI)
- ✅ TypeScript types
- ✅ React UI components
- ✅ Full test suite

## What You Need to Add

### 1. Deploy Smart Contracts

The examples reference smart contracts that need to be deployed. Here's a simple vault contract:

```solidity
// contracts/SimpleVault.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleVault {
    mapping(address => uint256) public balances;
    
    event Deposited(address indexed user, uint256 amount, uint256 newBalance);
    event Withdrawn(address indexed user, uint256 amount, uint256 newBalance);
    
    function deposit() external payable {
        balances[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value, balances[msg.sender]);
    }
    
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdrawn(msg.sender, amount, balances[msg.sender]);
    }
    
    function balanceOf(address user) external view returns (uint256) {
        return balances[user];
    }
}
```

### 2. Set Environment Variables

Create `.env` file:
```bash
# Required for signing transactions
AGENT_PRIVATE_KEY=your_private_key_here

# Optional - only if using AI features
OPENAI_API_KEY=your_openai_key_here

# Contract addresses (after deployment)
VAULT_ADDRESS=0x...
DEX_ADDRESS=0x...
```

### 3. Install Dependencies

```bash
# Root
npm install

# Core SDK
cd packages/core
npm install

# Examples
cd packages/examples/vault-automation
npm install
```

## Quick Start (Without Smart Contracts)

You can test the SDK **without deploying contracts** using manual execution:

```typescript
import { SentinelAgentSDK, RiskMonitor } from '@sentinel/ai-agent-sdk';

const sdk = new SentinelAgentSDK({
  network: 'cronos-testnet',
  rpcUrl: 'https://evm-t3.cronos.org'
  // No privateKey needed for read-only
});

// Register agent
sdk.registerAgent('risk-monitor', new RiskMonitor());

// Execute manually (no contract needed)
const result = await sdk.executeAgent('risk-monitor', {
  contractId: 'test',
  user: '0x123...',
  customData: {
    balance: BigInt(5e18),  // 5 tokens
    threshold: BigInt(10e18) // 10 tokens threshold
  }
});

console.log(result);
// Output: { action: { type: 'LIMIT', value: 2500000000000000000n }, 
//           reason: 'Balance below threshold - reducing limits', 
//           confidence: 0.85 }
```

## Testing Each User Story

### Story 1: DeFi Risk Management ✅
**Works with:** Any contract with `Deposited` event
```typescript
// Just change the contract address
await sdk.registerContract('vault', {
  address: 'YOUR_DEPLOYED_VAULT_ADDRESS',
  abi: vaultABI,
  network: 'cronos-testnet'
});
```

### Story 2: DEX Liquidity ✅
**Works with:** Any DEX with `PriceUpdate` event
```typescript
await sdk.registerContract('dex', {
  address: 'YOUR_DEX_ADDRESS',
  abi: dexABI,
  network: 'cronos-testnet'
});
```

### Story 3: NFT Fraud Detection ✅
**Works with:** Any NFT marketplace with `Sale` event
```typescript
await sdk.registerContract('marketplace', {
  address: 'YOUR_MARKETPLACE_ADDRESS',
  abi: marketplaceABI,
  network: 'cronos-testnet'
});
```

### Story 4: Gaming Anti-Cheat ✅
**Works with:** Custom agent (no specific contract needed)
```typescript
// Custom agent works with any contract
class AntiCheatAgent extends BaseAgent { /* ... */ }
sdk.registerAgent('anti-cheat', new AntiCheatAgent());
```

### Story 5: Stablecoin Emergency ✅
**Works with:** Any contract with `PriceUpdated` event
```typescript
await sdk.registerContract('stablecoin', {
  address: 'YOUR_STABLECOIN_ADDRESS',
  abi: stablecoinABI,
  network: 'cronos-testnet'
});
```

### Story 6: UI Dashboard ✅
**Works immediately:** No contracts needed for UI
```bash
cd packages/examples/ui-demo
npm install
npm run dev
```

## Minimal Working Example (No Deployment Needed)

```typescript
// test-sdk.ts
import { SentinelAgentSDK, RiskMonitor, LiquidityOptimizer } from '@sentinel/ai-agent-sdk';

async function test() {
  const sdk = new SentinelAgentSDK({
    network: 'cronos-testnet',
    rpcUrl: 'https://evm-t3.cronos.org'
  });

  // Test RiskMonitor
  sdk.registerAgent('risk-monitor', new RiskMonitor());
  const risk = await sdk.executeAgent('risk-monitor', {
    contractId: 'test',
    user: '0x123',
    customData: {
      balance: BigInt(5e18),
      threshold: BigInt(10e18)
    }
  });
  console.log('Risk Decision:', risk);

  // Test LiquidityOptimizer
  sdk.registerAgent('liquidity-optimizer', new LiquidityOptimizer());
  const liquidity = await sdk.executeAgent('liquidity-optimizer', {
    contractId: 'test',
    user: '0x456',
    customData: {
      currentPrice: BigInt(100e18),
      liquidity: BigInt(1000e18),
      targetRatio: 0.8
    }
  });
  console.log('Liquidity Decision:', liquidity);
}

test();
```

Run it:
```bash
npx ts-node test-sdk.ts
```

## What Works Right Now

| Feature          | Status            | Requires Contract? |
|------------------|-------------------|--------------------|
| Built-in Agents  | ✅ Works          | No                 |
| Custom Agents    | ✅ Works          | No                 |
| Manual Execution | ✅ Works          | No                 |
| Event Listening  | ⚠️ Needs Contract | Yes                |
| Policy Engine    | ✅ Works          | No                 |
| AI Integration   | ✅ Works          | No (needs API key) |
| UI Components    | ✅ Works          | No                 |
| Tests            | ✅ Pass           | No                 |

## Summary

**The SDK is 100% functional.** All code examples will work once you:

1. **For Manual Testing** (No contracts needed):
   - Just call `sdk.executeAgent()` directly
   - All agents work immediately

2. **For Event Automation** (Needs contracts):
   - Deploy a contract with events
   - Register it with the SDK
   - Events trigger agents automatically

3. **For UI Demo** (No contracts needed):
   - Run `npm run dev` in ui-demo
   - Dashboard works immediately

The examples in USER_STORIES.md are **reference implementations** showing how to integrate with real contracts. The SDK itself is production-ready and fully tested.
