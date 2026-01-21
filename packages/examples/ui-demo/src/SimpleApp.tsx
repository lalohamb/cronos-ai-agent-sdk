import { useState, useEffect } from 'react';
import { DemoControlPlaneClient } from './DemoControlPlaneClient';

function SimpleApp() {
  const [agentId, setAgentId] = useState('risk-monitor');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    activeAgents: 0,
    policyVersion: 'Loading...',
    runtimeId: 'Initializing...'
  });
  const [controlPlane] = useState(() => new DemoControlPlaneClient());
  const [policyPack, setPolicyPack] = useState<any>(null);
  const [events, setEvents] = useState<Array<{id: string, type: string, message: string, timestamp: number}>>([]);
  const [contracts, setContracts] = useState<Array<{id: string, address: string, network: string}>>([]);

  useEffect(() => {
    initializeLiveData();
    // Set up event polling
    const eventInterval = setInterval(updateEvents, 3000);
    return () => clearInterval(eventInterval);
  }, []);

  const initializeLiveData = async () => {
    try {
      // Get live policy pack data
      const policyResult = await controlPlane.pullPolicyPack({});
      setPolicyPack(policyResult.pack);
      
      // Update system status with live data
      setSystemStatus({
        activeAgents: policyResult.pack.rulesets.length, // Use rulesets as proxy for agents
        policyVersion: policyResult.pack.packVersion,
        runtimeId: controlPlane.getRuntimeId()
      });
      // Add initialization event
      addEvent('system', '🟢 Control plane connected successfully');
      
      // Initialize demo contracts
      setContracts([
        {
          id: 'vault-001',
          address: import.meta.env.VITE_SIMPLE_VAULT_ADDRESS, // || '0xe30093CF82Cb6bc4176a2e1F60B66DFb02811E8a',
          network: import.meta.env.VITE_NETWORK // || 'cronos-testnet'
        },
        {
          id: 'dex-pool-001', 
          address: import.meta.env.DEX_POOL ||'0x123...undef',
          network: 'cronos-testnet'
        },
        {
          id: 'amm-lending-001',
          address: import.meta.env.AMM_POOL || '0x789...undef',
          network: 'cronos-testnet'
        },
        {
          id: 'RICH-lending-001',
          address: import.meta.env.RICH_POOL || '0x789...undef',
          network: 'cronos-testnet'
        }
      ]);
    } catch (error) {
      console.error('Failed to initialize live data:', error);
      addEvent('error', '🔴 Failed to connect to control plane');
      // Fallback to demo data
      setSystemStatus({
        activeAgents: 3,
        policyVersion: 'v2025.12.17.1 (demo)',
        runtimeId: 'demo-fallback'
      });
    }
  };

  const addEvent = (type: string, message: string) => {
    const newEvent = {
      id: `event-${Date.now()}-${Math.random()}`,
      type,
      message,
      timestamp: Date.now()
    };
    setEvents(prev => [newEvent, ...prev.slice(0, 9)]); // Keep last 10 events
  };

  const updateEvents = () => {
    // Simulate live events based on control plane data
    const eventTypes = [
      { type: 'contract', message: '🔵 Contract vault-001: New transaction detected' },
      { type: 'policy', message: '🟡 Policy engine: Ruleset validation passed' },
      { type: 'agent', message: '🟢 Risk monitor: Threshold check completed' },
      { type: 'telemetry', message: `📊 Telemetry: ${controlPlane.getTelemetryCount()} events recorded` }
    ];
    
    if (Math.random() > 0.7) { // 30% chance of new event
      const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      addEvent(randomEvent.type, randomEvent.message);
    }
  };

  const executeAgent = async () => {
    setLoading(true);
    try {
      // Simulate agent execution with live policy data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate agent-specific data
      const getAgentData = () => {
        switch (agentId) {
          case 'liquidity-optimizer':
            return {
              currentPrice: (1800 * 1e18).toString(), // $1800 in wei
              liquidity: (Math.random() * 1000 + 100).toFixed(0) + '000000000000000000', // 100-1100 ETH
              targetRatio: 0.8
            };
          case 'risk-monitor':
            return {
              balance: (Math.random() * 100 + 10).toFixed(0) + '000000000000000000', // 10-110 ETH
              threshold: '10000000000000000000', // 10 ETH
              riskScore: Math.random() * 100
            };
          default:
            return {
              value: Math.random() * 1000,
              threshold: 500
            };
        }
      };
      
      // Create a decision record with real agent data
      const mockDecision = {
        action: { type: 'ALLOW', value: 100 },
        reason: `Agent ${agentId} executed with live data`,
        confidence: 0.95,
        metadata: {
          runtimeId: systemStatus.runtimeId,
          policyRulesets: policyPack?.rulesets?.length || 0,
          agentData: getAgentData()
        }
      };
      
      // Push to control plane for live tracking
      await controlPlane.pushDecisionRecord({
        recordVersion: 1,
        runtimeId: systemStatus.runtimeId,
        agentId,
        agentVersion: '1.0.0',
        policyVersion: systemStatus.policyVersion,
        contractId: 'vault-001',
        user: '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5A',
        timestamp: Date.now(),
        contextHash: 'demo-context-hash',
        decisionHash: 'demo-decision-hash',
        decision: mockDecision,
        reason: mockDecision.reason,
        confidence: mockDecision.confidence,
        metadata: mockDecision.metadata,
        createdAt: Date.now()
      });
      
      // Add execution event
      addEvent('agent', `🤖 Agent ${agentId}: Execution completed`);
      addEvent('decision', `📋 Decision recorded: ${mockDecision.action.type}`);
      
      setResult(mockDecision);
    } catch (error) {
      console.error('Agent execution failed:', error);
      setResult({
        action: { type: 'ERROR', value: 0 },
        reason: `Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        confidence: 0
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '1200px', 
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
        <p style={{ color: '#666', margin: '0 0 10px 0' }}>Demo Interface - SDK v5.2.0</p>
        <a 
          href="/docs/wiki/index.html" 
          target="_blank"
          style={{ 
            color: '#007bff', 
            textDecoration: 'none',
            padding: '8px 16px',
            border: '1px solid #007bff',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          📚 View Documentation Wiki
        </a>
      </header>
      
      {/* Dashboard */}
      <div style={{
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h2>System Status</h2>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div>🟢 {systemStatus.activeAgents} Agents Active</div>
          <div>📋 Policy Pack {systemStatus.policyVersion}</div>
          <div>🔗 Runtime: {systemStatus.runtimeId}</div>
          <div>📊 Records: {controlPlane.getRecordCount()}</div>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '20px' 
      }}>
        {/* Agent Console */}
        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2>Agent Console</h2>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Agent:</label>
            <select 
              value={agentId} 
              onChange={(e) => setAgentId(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value="risk-monitor">Risk Monitor</option>
              <option value="liquidity-optimizer">Liquidity Optimizer</option>
              <option value="emergency-brake">Emergency Brake</option>
              <option value="threshold-guard">Threshold Guard</option>
              <option value="anomaly-detector">Anomaly Detector</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Contract:</label>
            <select 
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              {contracts.map(contract => (
                <option key={contract.id} value={contract.id}>
                  {contract.id} ({contract.address.slice(0, 8)}...)
                </option>
              ))}
            </select>
          </div>

          <button 
            onClick={executeAgent} 
            disabled={loading}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Executing...' : 'Execute Agent'}
          </button>

          {result && (
            <div style={{ 
              marginTop: '20px', 
              padding: '15px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '4px',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ margin: '0 0 10px 0' }}>Result</h3>
              <p><strong>Action:</strong> {result.action.type} ({result.action.value})</p>
              <p><strong>Reason:</strong> {result.reason}</p>
              <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(1)}%</p>
              {result.metadata?.agentData && (
                <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
                  <strong>Agent Data:</strong>
                  <pre style={{ fontSize: '12px', margin: '5px 0 0 0' }}>
                    {JSON.stringify(result.metadata.agentData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Event Monitor */}
        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2>Event Monitor</h2>
          <div style={{ fontSize: '14px', color: '#666', maxHeight: '200px', overflowY: 'auto' }}>
            {events.length === 0 ? (
              <div style={{ padding: '8px 0', fontStyle: 'italic' }}>Waiting for events...</div>
            ) : (
              events.map(event => (
                <div key={event.id} style={{ 
                  padding: '8px 0', 
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>{event.message}</span>
                  <span style={{ fontSize: '12px', color: '#999' }}>
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '20px',
        marginTop: '20px'
      }}>
        {/* Contract Registry */}
        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2>Registered Contracts</h2>
          <div style={{ fontSize: '14px' }}>
            {contracts.map((contract, index) => (
              <div key={contract.id} style={{ 
                padding: '8px 0', 
                borderBottom: index < contracts.length - 1 ? '1px solid #eee' : 'none'
              }}>
                <div style={{ fontWeight: 'bold' }}>
                  📄 {contract.id}
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                  {contract.address} ({contract.network})
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Policy Manager */}
        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2>Active Policies</h2>
          <div style={{ fontSize: '14px' }}>
            {policyPack?.rulesets ? (
              policyPack.rulesets.map((ruleset: any, index: number) => (
                <div key={ruleset.id} style={{ 
                  padding: '8px 0', 
                  borderBottom: index < policyPack.rulesets.length - 1 ? '1px solid #eee' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>
                    {ruleset.enabled ? '🛡️' : '⚪'} {ruleset.id.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </span>
                  <span style={{ 
                    fontSize: '12px', 
                    color: ruleset.enabled ? '#28a745' : '#6c757d',
                    fontWeight: 'bold'
                  }}>
                    {ruleset.enabled ? 'ACTIVE' : 'DISABLED'}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ padding: '8px 0', fontStyle: 'italic', color: '#666' }}>
                Loading policies...
              </div>
            )}
          </div>
        </div>
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
        <p>Cronos AI Agent SDK v5.2.0 - Demo Interface</p>
      </footer>
    </div>
  );
}

export default SimpleApp;