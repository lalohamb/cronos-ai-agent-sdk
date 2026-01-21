import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserStoriesPage from './pages/UserStoriesPage';
import AgentDashboard from './components/AgentDashboard';
import { SDKHealthChecker, SDKHealthResults } from './utils/sdkHealthChecker';
import {
  SentinelAgentSDK,
  RiskMonitor,
  LiquidityOptimizer,
  EmergencyBrake,
  ThresholdGuard,
  AnomalyDetector,
  X402PaymentAgent,
  LogLevel
} from '@sentinal/ai-agent-sdk';

function App() {
  const [sdk, setSdk] = useState<SentinelAgentSDK | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [healthStatus, setHealthStatus] = useState<SDKHealthResults | null>(null);

  useEffect(() => {
    const initSDK = async () => {
      try {
        console.log('🚀 Initializing Real Sentinel Agent SDK...');

        // Initialize the real SDK with environment variables
        const sentinelSDK = new SentinelAgentSDK({
          network: import.meta.env.VITE_NETWORK || 'cronos-testnet',
          rpcUrl: import.meta.env.VITE_RPC_URL || 'https://evm-t3.cronos.org',
          logLevel: (import.meta.env.VITE_LOG_LEVEL as LogLevel) || LogLevel.INFO,
          runtime: {
            appName: import.meta.env.VITE_APP_NAME || 'SimpleVault Landing',
            env: import.meta.env.VITE_APP_ENV || 'development',
            version: import.meta.env.VITE_APP_VERSION || '1.0.0'
          }
        });

        // Start the SDK
        await sentinelSDK.start();
        console.log('✅ SDK started successfully');

        // Register built-in agents
        console.log('📝 Registering built-in agents...');
        sentinelSDK.registerAgent('risk-monitor', new RiskMonitor());
        sentinelSDK.registerAgent('liquidity-optimizer', new LiquidityOptimizer());
        sentinelSDK.registerAgent('emergency-brake', new EmergencyBrake());
        sentinelSDK.registerAgent('threshold-guard', new ThresholdGuard());
        sentinelSDK.registerAgent('anomaly-detector', new AnomalyDetector());
        sentinelSDK.registerAgent('x402-payment-agent', new X402PaymentAgent());
        console.log('✅ 6 agents registered successfully');

        // Register the SimpleVault contract using environment variables
        const contractId = import.meta.env.VITE_CONTRACT_ID || 'simple-vault'; //Fallback to SimpleVault Contract on Cronos_Testnet
        const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || '0x656a4D09f53ab82f6B291082cb3159F7c14424dE';  //Fallback to SimpleVault Contract on Cronos_Testnet
        const contractNetwork = import.meta.env.VITE_CONTRACT_NETWORK || 'cronos-testnet';  //Fallback to SimpleVault Contract on Cronos_Testnet

        console.log('📝 Registering SimpleVault contract...');
        console.log(`   ID: ${contractId}`);
        console.log(`   Address: ${contractAddress}`);
        console.log(`   Network: ${contractNetwork}`);

        await sentinelSDK.registerContract(contractId, {
          address: contractAddress,
          abi: [], // ABI not needed for basic health checks
          network: contractNetwork
        });
        console.log('✅ Contract registered successfully');

        // Set the SDK instance
        setSdk(sentinelSDK);

        // Run health check
        const checker = new SDKHealthChecker();
        const results = await checker.runHealthCheck();
        setHealthStatus(results);
        setIsReady(true);

        console.log('✅ SDK initialization complete!');
      } catch (error) {
        console.error('❌ SDK initialization failed:', error);
        setIsReady(false);
      }
    };

    initSDK();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage isReady={isReady} />} />
        <Route path="/user-stories" element={<UserStoriesPage isReady={isReady} />} />
        <Route path="/dashboard" element={<AgentDashboard sdk={sdk} isReady={isReady} healthStatus={healthStatus} />} />
      </Routes>
    </Router>
  );
}

export default App;
