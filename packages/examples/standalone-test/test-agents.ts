import { SentinelAgentSDK, RiskMonitor, LiquidityOptimizer, EmergencyBrake, ThresholdGuard, AnomalyDetector } from '@sentinel/ai-agent-sdk';

async function testAllAgents() {
  console.log('🚀 Testing Cronos AI Agent SDK\n');

  const sdk = new SentinelAgentSDK({
    network: 'cronos-testnet',
    rpcUrl: 'https://evm-t3.cronos.org'
  });

  console.log('1️⃣ Testing RiskMonitor...');
  sdk.registerAgent('risk-monitor', new RiskMonitor());
  
  const riskResult = await sdk.executeAgent('risk-monitor', {
    contractId: 'test-vault',
    user: '0x123',
    customData: {
      balance: BigInt(5e18),
      threshold: BigInt(10e18)
    }
  });
  console.log('   Result:', riskResult.action.type, '-', riskResult.reason);
  console.log('   Confidence:', (riskResult.confidence * 100).toFixed(0) + '%\n');

  console.log('2️⃣ Testing LiquidityOptimizer...');
  sdk.registerAgent('liquidity-optimizer', new LiquidityOptimizer());
  
  const liquidityResult = await sdk.executeAgent('liquidity-optimizer', {
    contractId: 'test-dex',
    user: '0x456',
    customData: {
      currentPrice: BigInt(100e18),
      liquidity: BigInt(1000e18),
      targetRatio: 0.8
    }
  });
  console.log('   Result:', liquidityResult.action.type, '-', liquidityResult.reason);
  console.log('   Confidence:', (liquidityResult.confidence * 100).toFixed(0) + '%\n');

  console.log('3️⃣ Testing EmergencyBrake...');
  sdk.registerAgent('emergency-brake', new EmergencyBrake());
  
  const emergencyResult = await sdk.executeAgent('emergency-brake', {
    contractId: 'test-protocol',
    user: '0x789',
    customData: {
      metric: 95,
      criticalThreshold: 90
    }
  });
  console.log('   Result:', emergencyResult.action.type, '-', emergencyResult.reason);
  console.log('   Confidence:', (emergencyResult.confidence * 100).toFixed(0) + '%\n');

  console.log('4️⃣ Testing ThresholdGuard...');
  sdk.registerAgent('threshold-guard', new ThresholdGuard());
  
  const thresholdResult = await sdk.executeAgent('threshold-guard', {
    contractId: 'test-contract',
    user: '0xabc',
    customData: {
      value: BigInt(150e18),
      minThreshold: BigInt(10e18),
      maxThreshold: BigInt(100e18)
    }
  });
  console.log('   Result:', thresholdResult.action.type, '-', thresholdResult.reason);
  console.log('   Confidence:', (thresholdResult.confidence * 100).toFixed(0) + '%\n');

  console.log('5️⃣ Testing AnomalyDetector...');
  sdk.registerAgent('anomaly-detector', new AnomalyDetector());
  
  const anomalyResult = await sdk.executeAgent('anomaly-detector', {
    contractId: 'test-marketplace',
    user: '0xdef',
    customData: {
      currentValue: 100,
      historicalAverage: 50,
      standardDeviation: 10
    }
  });
  console.log('   Result:', anomalyResult.action.type, '-', anomalyResult.reason);
  console.log('   Severity:', anomalyResult.action.severity);
  console.log('   Confidence:', (anomalyResult.confidence * 100).toFixed(0) + '%\n');

  console.log('✅ All agents tested successfully!');
}

testAllAgents().catch(console.error);
