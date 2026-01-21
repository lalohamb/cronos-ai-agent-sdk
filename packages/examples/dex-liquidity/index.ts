import { SentinelAgentSDK, LiquidityOptimizer } from '@sentinel/ai-agent-sdk';
import { ethers } from 'ethers';

const dexABI = [
  'event PriceUpdate(address indexed pool, uint256 price, uint256 liquidity)',
  'event LiquidityAdded(address indexed pool, uint256 amount)',
  'function addLiquidity(address pool, uint256 amount)',
  'function removeLiquidity(address pool, uint256 amount)'
];

async function main() {
  console.log('🚀 DEX Liquidity Management Demo\n');

  const sdk = new SentinelAgentSDK({
    network: 'cronos-testnet',
    rpcUrl: 'https://evm-t3.cronos.org',
    // privateKey: process.env.AGENT_PRIVATE_KEY // Optional for demo
  });

  await sdk.registerContract('dex', {
    address: '0x4567890123456789012345678901234567890123',
    abi: dexABI,
    network: 'cronos-testnet'
  });

  sdk.registerAgent('liquidity-optimizer', new LiquidityOptimizer());

  console.log('✅ Contract and agent registered');

  // Simulate liquidity optimization scenarios
  console.log('\n📊 Testing Liquidity Optimization Scenarios:\n');

  // Scenario 1: Low liquidity
  console.log('Scenario 1: Low liquidity pool');
  try {
    const result1 = await sdk.executeAgent('liquidity-optimizer', {
      contractId: 'dex',
      user: '0x1234567890123456789012345678901234567890',
      customData: {
        currentPrice: ethers.parseEther('1800').toString(), // $1800
        liquidity: ethers.parseEther('100').toString(),     // 100 ETH (low)
        targetRatio: 0.8 // 80% target
      }
    });

    console.log('Decision:', {
      action: result1.action.type,
      value: result1.action.value,
      reason: result1.reason,
      confidence: result1.confidence
    });
  } catch (error) {
    console.error('Error:', (error as Error).message);
  }

  // Scenario 2: High liquidity
  console.log('\nScenario 2: High liquidity pool');
  try {
    const result2 = await sdk.executeAgent('liquidity-optimizer', {
      contractId: 'dex',
      user: '0x1234567890123456789012345678901234567890',
      customData: {
        currentPrice: ethers.parseEther('1800').toString(), // $1800
        liquidity: ethers.parseEther('10000').toString(),   // 10,000 ETH (high)
        targetRatio: 0.8 // 80% target
      }
    });

    console.log('Decision:', {
      action: result2.action.type,
      value: result2.action.value,
      reason: result2.reason,
      confidence: result2.confidence
    });
  } catch (error) {
    console.error('Error:', (error as Error).message);
  }

  // Scenario 3: Price volatility
  console.log('\nScenario 3: Price volatility scenario');
  try {
    const result3 = await sdk.executeAgent('liquidity-optimizer', {
      contractId: 'dex',
      user: '0x1234567890123456789012345678901234567890',
      customData: {
        currentPrice: ethers.parseEther('2200').toString(), // $2200 (high)
        liquidity: ethers.parseEther('1000').toString(),    // 1000 ETH
        targetRatio: 0.6, // Lower target due to volatility
        volatility: 'HIGH'
      }
    });

    console.log('Decision:', {
      action: result3.action.type,
      value: result3.action.value,
      reason: result3.reason,
      confidence: result3.confidence
    });
  } catch (error) {
    console.error('Error:', (error as Error).message);
  }

  console.log('\n🎉 Demo completed successfully!');
  console.log('\n📋 Summary:');
  console.log('- SDK initialized with Cronos testnet');
  console.log('- DEX contract registered');
  console.log('- Liquidity optimizer agent tested');
  console.log('- Multiple scenarios demonstrated');
  
  // Note about event monitoring
  console.log('\n📝 Note: Event monitoring disabled due to RPC limitations');
  console.log('   In production, events would trigger automatic optimization');
}

main().catch(console.error);
