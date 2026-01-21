import { SentinelAgentSDK, GeniusActComplianceAgent } from '@sentinel/ai-agent-sdk';
import { ethers } from 'ethers';

async function main() {
  console.log('🚀 Genius Act Compliance Demo\n');

  // Initialize SDK
  const sdk = new SentinelAgentSDK({
    network: 'cronos-testnet',
    rpcUrl: 'https://evm-t3.cronos.org',
    // privateKey: process.env.AGENT_PRIVATE_KEY // Optional for demo
  });

  // Configure Genius Act compliance rules
  const complianceAgent = new GeniusActComplianceAgent({
    maxTransactionAmount: ethers.parseEther('10000'), // $10k equivalent
    whitelistedTokens: [
      '0x1234567890123456789012345678901234567890', // USDC
      '0x5678901234567890123456789012345678901234', // USDT
      '0x9abcdef123456789012345678901234567890123'  // CRO
    ],
    requireKYC: true,
    dailyLimit: ethers.parseEther('50000')
  });

  // Register the agent
  sdk.registerAgent('genius-act-compliance', complianceAgent);

  console.log('✅ Compliance agent registered');

  // Test compliance scenarios
  console.log('\n📜 Testing Genius Act Compliance Scenarios:\n');

  // Scenario 1: Valid transaction (whitelisted token, KYC user)
  console.log('Scenario 1: Valid transaction');
  try {
    const result1 = await sdk.executeAgent('genius-act-compliance', {
      contractId: 'dex',
      user: '0x1234567890123456789012345678901234567890', // KYC compliant (starts with 0x1)
      customData: {
        tokenAddress: '0x1234567890123456789012345678901234567890', // Whitelisted USDC
        amount: ethers.parseEther('1000').toString(), // $1k - under limit
        userAddress: '0x1234567890123456789012345678901234567890'
      }
    });

    console.log('Compliance Check:', {
      action: result1.action.type,
      reason: result1.reason,
      confidence: result1.confidence,
      status: result1.metadata?.complianceCheck
    });
  } catch (error) {
    console.error('Error:', (error as Error).message);
  }

  // Scenario 2: Non-whitelisted token
  console.log('\nScenario 2: Non-whitelisted token');
  try {
    const result2 = await sdk.executeAgent('genius-act-compliance', {
      contractId: 'dex',
      user: '0x1234567890123456789012345678901234567890',
      customData: {
        tokenAddress: '0xdeadbeef123456789012345678901234567890', // Not whitelisted
        amount: ethers.parseEther('1000').toString(),
        userAddress: '0x1234567890123456789012345678901234567890'
      }
    });

    console.log('Compliance Check:', {
      action: result2.action.type,
      reason: result2.reason,
      confidence: result2.confidence,
      violation: result2.metadata?.violation
    });
  } catch (error) {
    console.error('Error:', (error as Error).message);
  }

  // Scenario 3: Amount exceeds limit
  console.log('\nScenario 3: Amount exceeds limit');
  try {
    const result3 = await sdk.executeAgent('genius-act-compliance', {
      contractId: 'dex',
      user: '0x1234567890123456789012345678901234567890',
      customData: {
        tokenAddress: '0x1234567890123456789012345678901234567890', // Whitelisted
        amount: ethers.parseEther('15000').toString(), // $15k - exceeds $10k limit
        userAddress: '0x1234567890123456789012345678901234567890'
      }
    });

    console.log('Compliance Check:', {
      action: result3.action.type,
      reason: result3.reason,
      confidence: result3.confidence,
      violation: result3.metadata?.violation
    });
  } catch (error) {
    console.error('Error:', (error as Error).message);
  }

  // Scenario 4: Non-KYC user
  console.log('\nScenario 4: Non-KYC user');
  try {
    const result4 = await sdk.executeAgent('genius-act-compliance', {
      contractId: 'dex',
      user: '0x9876543210987654321098765432109876543210', // Non-KYC (doesn't start with 0x1)
      customData: {
        tokenAddress: '0x1234567890123456789012345678901234567890', // Whitelisted
        amount: ethers.parseEther('1000').toString(), // Under limit
        userAddress: '0x9876543210987654321098765432109876543210'
      }
    });

    console.log('Compliance Check:', {
      action: result4.action.type,
      reason: result4.reason,
      confidence: result4.confidence,
      violation: result4.metadata?.violation
    });
  } catch (error) {
    console.error('Error:', (error as Error).message);
  }

  console.log('\n🎉 Demo completed successfully!');
  console.log('\n📋 Summary:');
  console.log('- SDK initialized with Cronos testnet');
  console.log('- Genius Act compliance agent configured');
  console.log('- Token whitelist: USDC, USDT, CRO');
  console.log('- Max transaction: $10,000 equivalent');
  console.log('- KYC requirement: Enabled');
  console.log('- Multiple compliance scenarios tested');
  
  console.log('\n📝 Note: In production, this would integrate with:');
  console.log('   - Real KYC/AML providers');
  console.log('   - Official token registries');
  console.log('   - Regulatory reporting systems');
}

main().catch(console.error);