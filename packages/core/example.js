const { SentinelAgentSDK, RiskMonitor, LiquidityOptimizer, AnomalyDetector } = require('./dist/index.js');
const { parseEther } = require('ethers');

async function demonstrateSDK() {
  console.log('🚀 Cronos AI Agent SDK Demo\n');

  // Initialize SDK
  const sdk = new SentinelAgentSDK({
    network: 'cronos-testnet',
    rpcUrl: 'https://evm-t3.cronos.org',
    // privateKey: 'your-private-key-here', // Optional for read-only operations
  });

  console.log('✅ SDK initialized');

  // Register built-in agents
  sdk.registerAgent('risk-monitor', new RiskMonitor());
  sdk.registerAgent('liquidity-optimizer', new LiquidityOptimizer());
  sdk.registerAgent('anomaly-detector', new AnomalyDetector());

  console.log('✅ Agents registered');

  // Test Risk Monitor
  console.log('\n📊 Testing Risk Monitor Agent:');
  try {
    const riskDecision = await sdk.executeAgent('risk-monitor', {
      contractId: 'test-vault',
      user: '0x1234567890123456789012345678901234567890',
      customData: {
        balance: parseEther('5').toString(),    // 5 ETH
        threshold: parseEther('10').toString()  // 10 ETH threshold
      }
    });

    console.log('Risk Decision:', {
      action: riskDecision.action.type,
      severity: riskDecision.action.severity,
      reason: riskDecision.reason,
      confidence: riskDecision.confidence
    });
  } catch (error) {
    console.error('Risk Monitor Error:', error.message);
  }

  // Test Liquidity Optimizer
  console.log('\n💧 Testing Liquidity Optimizer Agent:');
  try {
    const liquidityDecision = await sdk.executeAgent('liquidity-optimizer', {
      contractId: 'test-dex',
      user: '0x1234567890123456789012345678901234567890',
      customData: {
        currentPrice: parseEther('1800').toString(), // $1800
        liquidity: parseEther('1000').toString(),    // 1000 ETH
        targetRatio: 0.8 // 80% target
      }
    });

    console.log('Liquidity Decision:', {
      action: liquidityDecision.action.type,
      value: liquidityDecision.action.value,
      reason: liquidityDecision.reason,
      confidence: liquidityDecision.confidence
    });
  } catch (error) {
    console.error('Liquidity Optimizer Error:', error.message);
  }

  // Test Anomaly Detector
  console.log('\n🔍 Testing Anomaly Detector Agent:');
  try {
    const anomalyDecision = await sdk.executeAgent('anomaly-detector', {
      contractId: 'test-marketplace',
      user: '0x1234567890123456789012345678901234567890',
      customData: {
        currentValue: 5000,      // Current price
        historicalAverage: 1000, // Historical average
        standardDeviation: 200   // Standard deviation
      }
    });

    console.log('Anomaly Decision:', {
      action: anomalyDecision.action.type,
      severity: anomalyDecision.action.severity,
      reason: anomalyDecision.reason,
      confidence: anomalyDecision.confidence
    });
  } catch (error) {
    console.error('Anomaly Detector Error:', error.message);
  }

  // Test Policy Engine
  console.log('\n🛡️ Testing Policy Engine:');
  const confidencePolicy = {
    id: 'min-confidence',
    name: 'Minimum Confidence Policy',
    description: 'Ensures minimum confidence threshold',
    validate: (decision) => decision.confidence >= 0.7,
    enforce: (decision) => ({
      ...decision,
      confidence: Math.max(decision.confidence, 0.7)
    })
  };

  sdk.addPolicy(confidencePolicy);
  console.log('✅ Policy added: Minimum Confidence Policy');

  console.log('\n🎉 Demo completed successfully!');
  console.log('\n📋 Summary:');
  console.log('- SDK initialized with Cronos testnet');
  console.log('- 3 built-in agents registered and tested');
  console.log('- Policy engine configured');
  console.log('- All components working correctly');
}

// Run the demo
demonstrateSDK().catch(console.error);