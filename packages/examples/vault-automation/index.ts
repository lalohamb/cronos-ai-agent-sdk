import { SentinelAgentSDK, RiskMonitor } from '@sentinel/ai-agent-sdk';
import { ethers } from 'ethers';

const vaultABI = [
  'event Deposited(address indexed user, uint256 amount, uint256 newBalance)',
  'event Withdrawn(address indexed user, uint256 amount, uint256 newBalance)',
  'function deposit() payable',
  'function withdraw(uint256 amount)',
  'function balanceOf(address user) view returns (uint256)'
];

async function main() {
  console.log('🚀 Vault Automation Demo\n');

  const sdk = new SentinelAgentSDK({
    network: 'cronos-testnet',
    rpcUrl: 'https://evm-t3.cronos.org',
    // privateKey: process.env.AGENT_PRIVATE_KEY, // Optional for demo
    // aiProvider: 'openai',
    // aiApiKey: process.env.OPENAI_API_KEY
  });

  await sdk.registerContract('vault', {
    address: '0x1234567890123456789012345678901234567890', // Valid address format
    abi: vaultABI,
    network: 'cronos-testnet'
  });

  sdk.registerAgent('risk-monitor', new RiskMonitor());

  console.log('✅ Contract and agent registered');

  // Simulate risk monitoring scenarios
  console.log('\n🛡️ Testing Risk Monitoring Scenarios:\n');

  // Scenario 1: Low balance (safe)
  console.log('Scenario 1: Low balance user');
  try {
    const result1 = await sdk.executeAgent('risk-monitor', {
      contractId: 'vault',
      user: '0x1234567890123456789012345678901234567890',
      customData: {
        balance: ethers.parseEther('5').toString(),     // 5 ETH
        threshold: ethers.parseEther('10').toString()   // 10 ETH threshold
      }
    });

    console.log('Risk Assessment:', {
      action: result1.action.type,
      severity: result1.action.severity,
      reason: result1.reason,
      confidence: result1.confidence
    });
  } catch (error) {
    console.error('Error:', (error as Error).message);
  }

  // Scenario 2: High balance (risky)
  console.log('\nScenario 2: High balance user');
  try {
    const result2 = await sdk.executeAgent('risk-monitor', {
      contractId: 'vault',
      user: '0x1234567890123456789012345678901234567890',
      customData: {
        balance: ethers.parseEther('50').toString(),    // 50 ETH
        threshold: ethers.parseEther('10').toString()   // 10 ETH threshold
      }
    });

    console.log('Risk Assessment:', {
      action: result2.action.type,
      severity: result2.action.severity,
      reason: result2.reason,
      confidence: result2.confidence
    });

    if (result2.action.type === 'BLOCK') {
      console.warn('⚠️ Risk level critical - operations should be blocked');
    }
  } catch (error) {
    console.error('Error:', (error as Error).message);
  }

  // Scenario 3: Very high balance (critical)
  console.log('\nScenario 3: Very high balance user');
  try {
    const result3 = await sdk.executeAgent('risk-monitor', {
      contractId: 'vault',
      user: '0x1234567890123456789012345678901234567890',
      customData: {
        balance: ethers.parseEther('100').toString(),   // 100 ETH
        threshold: ethers.parseEther('10').toString()   // 10 ETH threshold
      }
    });

    console.log('Risk Assessment:', {
      action: result3.action.type,
      severity: result3.action.severity,
      reason: result3.reason,
      confidence: result3.confidence
    });

    if (result3.action.type === 'BLOCK') {
      console.warn('⚠️ Risk level critical - operations should be blocked');
    }
  } catch (error) {
    console.error('Error:', (error as Error).message);
  }

  console.log('\n🎉 Demo completed successfully!');
  console.log('\n📋 Summary:');
  console.log('- SDK initialized with Cronos testnet');
  console.log('- Vault contract registered');
  console.log('- Risk monitor agent tested');
  console.log('- Multiple risk scenarios demonstrated');
  
  // Note about event monitoring
  console.log('\n📝 Note: Event monitoring disabled due to RPC limitations');
  console.log('   In production, deposit events would trigger automatic risk assessment');
}

main().catch(console.error);
