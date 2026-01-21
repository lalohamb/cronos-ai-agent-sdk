import React from 'react';
import { Dashboard, AgentConsole, EventMonitor, ContractRegistry, PolicyManager, useAgentSDK } from '@cronos/ai-agent-ui';
import { RiskMonitor, LiquidityOptimizer, EmergencyBrake, ThresholdGuard } from '@sentinel/ai-agent-sdk';
import { DemoControlPlaneClient } from './DemoControlPlaneClient';

function App() {
  const { sdk, isReady } = useAgentSDK({
    network: 'cronos-testnet',
    rpcUrl: 'https://evm-t3.cronos.org',
    controlPlane: new DemoControlPlaneClient(),
    policyPack: {
      enabled: true,
      strict: false,
      refreshMs: 30000 // Refresh every 30 seconds for demo
    },
    audit: {
      enabled: true
    },
    runtime: {
      appName: 'cronos-ui-demo',
      env: 'development',
      version: '1.0.0'
    }
  });

  // Register demo agents when SDK is ready
  React.useEffect(() => {
    if (sdk && isReady) {
      sdk.registerAgent('risk-monitor', new RiskMonitor());
      sdk.registerAgent('liquidity-optimizer', new LiquidityOptimizer());
      sdk.registerAgent('emergency-brake', new EmergencyBrake());
      sdk.registerAgent('threshold-guard', new ThresholdGuard());
    }
  }, [sdk, isReady]);

  if (!isReady || !sdk) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Loading Cronos Sentinel Agent SDK...</h2>
          <p>Initializing Policy Pack System</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '1400px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <header style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#333', margin: '0 0 10px 0' }}>Cronos AI Agent Dashboard</h1>
        <p style={{ color: '#666', margin: 0 }}>Policy Pack System Demo - Version {sdk.getPolicyVersion() || 'N/A'}</p>
      </header>
      
      <Dashboard sdk={sdk} />
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '20px', 
        marginTop: '20px' 
      }}>
        <AgentConsole sdk={sdk} />
        <EventMonitor sdk={sdk} />
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '20px', 
        marginTop: '20px' 
      }}>
        <ContractRegistry sdk={sdk} />
        <PolicyManager sdk={sdk} />
      </div>

      <footer style={{
        marginTop: '40px',
        padding: '20px',
        textAlign: 'center',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        color: '#666'
      }}>
        <p>Cronos AI Agent SDK v5.2.0 - Policy Pack System Integration</p>
        <p>Runtime ID: {sdk.getRuntimeId() || 'Not connected'}</p>
      </footer>
    </div>
  );
}

export default App;
