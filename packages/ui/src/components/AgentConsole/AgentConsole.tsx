import React, { useState } from 'react';
import { SentinelAgentSDK, AgentDecision } from '@sentinel/ai-agent-sdk';

interface AgentConsoleProps {
  sdk: SentinelAgentSDK;
}

export function AgentConsole({ sdk }: AgentConsoleProps) {
  const [agentId, setAgentId] = useState('');
  const [contractId, setContractId] = useState('');
  const [user, setUser] = useState('');
  const [customData, setCustomData] = useState('{}');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AgentDecision | null>(null);
  const [error, setError] = useState('');

  const handleExecute = async () => {
    if (!agentId.trim()) {
      setError('Agent ID is required');
      return;
    }
    if (!contractId.trim()) {
      setError('Contract ID is required');
      return;
    }
    if (!user.trim()) {
      setError('User address is required');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const data = JSON.parse(customData);
      const response = await sdk.executeAgent(agentId, {
        contractId,
        user,
        customData: data
      });
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      backgroundColor: 'white'
    }}>
      <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>Agent Console</h2>
      
      <div style={{ display: 'grid', gap: '15px', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Agent ID:</label>
          <input 
            value={agentId} 
            onChange={(e) => setAgentId(e.target.value)} 
            placeholder="e.g., risk-monitor"
            style={{ 
              width: '100%', 
              padding: '8px 12px', 
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }} 
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Contract ID:</label>
          <input 
            value={contractId} 
            onChange={(e) => setContractId(e.target.value)} 
            placeholder="e.g., my-vault"
            style={{ 
              width: '100%', 
              padding: '8px 12px', 
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }} 
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>User Address:</label>
          <input 
            value={user} 
            onChange={(e) => setUser(e.target.value)} 
            placeholder="0x..."
            style={{ 
              width: '100%', 
              padding: '8px 12px', 
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }} 
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Custom Data (JSON):</label>
          <textarea 
            value={customData} 
            onChange={(e) => setCustomData(e.target.value)} 
            rows={4} 
            placeholder='{"balance": "1000", "threshold": "500"}'
            style={{ 
              width: '100%', 
              padding: '8px 12px', 
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              fontFamily: 'monospace',
              resize: 'vertical'
            }} 
          />
        </div>
      </div>

      <button 
        onClick={handleExecute} 
        disabled={loading || !agentId || !contractId || !user} 
        style={{ 
          padding: '12px 24px', 
          backgroundColor: loading ? '#6c757d' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        {loading ? 'Executing...' : 'Execute Agent'}
      </button>

      {error && (
        <div style={{ 
          color: '#dc3545', 
          marginTop: '15px', 
          padding: '10px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #e9ecef',
          borderRadius: '4px' 
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#495057' }}>Agent Decision</h3>
          
          <div style={{ display: 'grid', gap: '10px' }}>
            <div>
              <strong>Action:</strong> 
              <span style={{
                marginLeft: '10px',
                padding: '4px 8px',
                backgroundColor: result.action.type === 'ALLOW' ? '#d4edda' : '#f8d7da',
                color: result.action.type === 'ALLOW' ? '#155724' : '#721c24',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                {result.action.type}
              </span>
              {result.action.severity && (
                <span style={{
                  marginLeft: '10px',
                  padding: '2px 6px',
                  backgroundColor: '#ffc107',
                  color: '#856404',
                  borderRadius: '4px',
                  fontSize: '11px'
                }}>
                  {result.action.severity}
                </span>
              )}
            </div>
            
            <div>
              <strong>Reason:</strong> {result.reason}
            </div>
            
            <div>
              <strong>Confidence:</strong> {(result.confidence * 100).toFixed(1)}%
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#e9ecef',
                borderRadius: '4px',
                marginTop: '5px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${result.confidence * 100}%`,
                  height: '100%',
                  backgroundColor: result.confidence > 0.7 ? '#28a745' : result.confidence > 0.4 ? '#ffc107' : '#dc3545',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
            
            {result.metadata && Object.keys(result.metadata).length > 0 && (
              <div>
                <strong>Metadata:</strong>
                <pre style={{
                  marginTop: '5px',
                  padding: '8px',
                  backgroundColor: '#e9ecef',
                  borderRadius: '4px',
                  fontSize: '12px',
                  overflow: 'auto'
                }}>
                  {JSON.stringify(result.metadata, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
