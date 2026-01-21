const { SentinelAgentSDK, RiskMonitor } = require('./dist/index.js');
const { parseEther } = require('ethers');

// Simple ERC20 ABI for demonstration
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

async function demonstrateContractIntegration() {
  console.log('🔗 Cronos AI Agent SDK - Contract Integration Demo\n');

  // Initialize SDK with Cronos testnet
  const sdk = new SentinelAgentSDK({
    network: 'cronos-testnet',
    rpcUrl: 'https://evm-t3.cronos.org',
    // privateKey: process.env.PRIVATE_KEY, // Uncomment if you have a private key
  });

  console.log('✅ SDK initialized with Cronos testnet');

  // Register a mock contract (using WCRO token address as example)
  const wcroAddress = '0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23'; // WCRO on Cronos testnet
  
  try {
    await sdk.registerContract('wcro-token', {
      address: wcroAddress,
      abi: ERC20_ABI,
      network: 'cronos-testnet',
      name: 'Wrapped CRO'
    });

    console.log('✅ Contract registered: WCRO Token');
  } catch (error) {
    console.log('⚠️ Contract registration (expected for demo):', error.message);
  }

  // Register risk monitoring agent
  sdk.registerAgent('risk-monitor', new RiskMonitor());
  console.log('✅ Risk Monitor agent registered');

  // Simulate event-driven agent execution
  console.log('\n📡 Simulating contract event monitoring:');
  
  // This would normally be triggered by actual blockchain events
  const mockTransferEvent = {
    args: {
      from: '0x1234567890123456789012345678901234567890',
      to: '0x9876543210987654321098765432109876543210',
      value: parseEther('100') // 100 WCRO transferred
    },
    blockNumber: 12345678,
    transactionHash: '0xabcdef...'
  };

  console.log('📥 Mock Transfer Event:', {
    from: mockTransferEvent.args.from.slice(0, 10) + '...',
    to: mockTransferEvent.args.to.slice(0, 10) + '...',
    value: mockTransferEvent.args.value.toString() + ' wei'
  });

  // Execute risk analysis based on the event
  console.log('\n🔍 Executing risk analysis...');
  
  const riskAnalysis = await sdk.executeAgent('risk-monitor', {
    contractId: 'wcro-token',
    user: mockTransferEvent.args.from,
    blockNumber: mockTransferEvent.blockNumber,
    customData: {
      balance: parseEther('50').toString(),   // Remaining balance after transfer
      threshold: parseEther('100').toString() // Risk threshold
    }
  });

  console.log('📊 Risk Analysis Result:', {
    action: riskAnalysis.action.type,
    severity: riskAnalysis.action.severity,
    reason: riskAnalysis.reason,
    confidence: riskAnalysis.confidence
  });

  // Demonstrate policy enforcement
  console.log('\n🛡️ Adding safety policies...');
  
  const emergencyPolicy = {
    id: 'emergency-stop',
    name: 'Emergency Stop Policy',
    description: 'Blocks all actions when critical risk detected',
    validate: (decision) => {
      if (decision.action.severity === 'CRITICAL') {
        console.log('🚨 EMERGENCY POLICY TRIGGERED!');
        return false;
      }
      return true;
    }
  };

  sdk.addPolicy(emergencyPolicy);
  console.log('✅ Emergency stop policy added');

  // Test with critical risk scenario
  console.log('\n⚠️ Testing critical risk scenario...');
  
  try {
    const criticalRiskAnalysis = await sdk.executeAgent('risk-monitor', {
      contractId: 'wcro-token',
      user: mockTransferEvent.args.from,
      customData: {
        balance: parseEther('1').toString(),    // Very low balance
        threshold: parseEther('100').toString() // High threshold
      }
    });

    console.log('🚨 Critical Risk Analysis:', {
      action: criticalRiskAnalysis.action.type,
      severity: criticalRiskAnalysis.action.severity,
      reason: criticalRiskAnalysis.reason
    });
  } catch (error) {
    console.log('🛑 Policy Enforcement:', error.message);
  }

  console.log('\n🎉 Contract integration demo completed!');
  console.log('\n📋 Demonstrated Features:');
  console.log('- ✅ Contract registration with real Cronos addresses');
  console.log('- ✅ Event-driven agent execution simulation');
  console.log('- ✅ Risk analysis based on contract state');
  console.log('- ✅ Policy enforcement and safety mechanisms');
  console.log('- ✅ Integration with Cronos testnet RPC');
}

// Run the contract integration demo
demonstrateContractIntegration().catch(console.error);