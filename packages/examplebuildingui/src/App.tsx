import { useState } from 'react';
import { ethers } from 'ethers';

// Import agent classes directly from source
const RiskMonitor = {
  async decide(context: any) {
    const { balance, threshold, riskScore } = context.customData;
    const balanceBN = BigInt(balance);
    const thresholdBN = BigInt(threshold);
    
    if (riskScore > 85) {
      return {
        action: { type: 'BLOCK', reason: 'High risk detected' },
        reason: `Risk score ${riskScore} exceeds safe threshold`,
        confidence: 0.9
      };
    }
    
    if (balanceBN < thresholdBN) {
      return {
        action: { type: 'ALLOW', value: balanceBN.toString() },
        reason: 'Balance below threshold - low risk',
        confidence: 0.8
      };
    }
    
    return {
      action: { type: 'ALLOW', value: balanceBN.toString() },
      reason: 'Risk within acceptable limits',
      confidence: 0.85
    };
  }
};

const LiquidityOptimizer = {
  async decide(context: any) {
    const { currentPrice, liquidity, targetRatio } = context.customData;
    const liquidityBN = BigInt(liquidity);
    const targetLiquidity = (liquidityBN * BigInt(Math.floor(targetRatio * 100))) / 100n;
    const difference = liquidityBN - targetLiquidity;
    const threshold = targetLiquidity / 5n;
    const absDifference = difference < 0n ? -difference : difference;

    if (absDifference <= threshold) {
      return {
        action: { type: 'HOLD', reason: 'Liquidity within target range' },
        reason: `Current liquidity ${liquidityBN.toString()} is within target range`,
        confidence: 0.8
      };
    }

    if (difference > 0n) {
      return {
        action: { type: 'REMOVE', value: difference.toString(), reason: 'Excess liquidity detected' },
        reason: `Remove ${difference.toString()} excess liquidity`,
        confidence: 0.85
      };
    }

    return {
      action: { type: 'ADD', value: absDifference.toString(), reason: 'Insufficient liquidity' },
      reason: `Add ${absDifference.toString()} liquidity to reach target`,
      confidence: 0.85
    };
  }
};

const EmergencyBrake = {
  async decide(context: any) {
    const { emergencyThreshold, currentRisk, enabled } = context.customData;
    
    if (!enabled) {
      return {
        action: { type: 'ALLOW', reason: 'Emergency brake disabled' },
        reason: 'Emergency brake is currently disabled',
        confidence: 1.0
      };
    }
    
    if (currentRisk >= emergencyThreshold) {
      return {
        action: { type: 'EMERGENCY_STOP', reason: 'Critical risk level reached' },
        reason: `Risk ${currentRisk} >= threshold ${emergencyThreshold}`,
        confidence: 0.95
      };
    }
    
    return {
      action: { type: 'ALLOW', reason: 'Risk within safe limits' },
      reason: `Current risk ${currentRisk} below emergency threshold`,
      confidence: 0.8
    };
  }
};

const ThresholdGuard = {
  async decide(context: any) {
    const { value, threshold, operation } = context.customData;
    
    if (value > threshold) {
      return {
        action: { type: 'BLOCK', reason: 'Value exceeds threshold' },
        reason: `${operation} value ${value} exceeds threshold ${threshold}`,
        confidence: 0.9
      };
    }
    
    return {
      action: { type: 'ALLOW', value: value.toString() },
      reason: `${operation} value ${value} within threshold`,
      confidence: 0.85
    };
  }
};

const AnomalyDetector = {
  async decide(context: any) {
    const { pattern, confidence, baseline } = context.customData;
    
    if (confidence > 0.9) {
      return {
        action: { type: 'ALERT', reason: 'High confidence anomaly detected' },
        reason: `Pattern '${pattern}' detected with ${(confidence * 100).toFixed(1)}% confidence`,
        confidence
      };
    }
    
    return {
      action: { type: 'MONITOR', reason: 'Low confidence anomaly' },
      reason: `Pattern '${pattern}' requires monitoring (${(confidence * 100).toFixed(1)}% confidence)`,
      confidence: 0.7
    };
  }
};

const agents = {
  'risk-monitor': RiskMonitor,
  'liquidity-optimizer': LiquidityOptimizer,
  'emergency-brake': EmergencyBrake,
  'threshold-guard': ThresholdGuard,
  'anomaly-detector': AnomalyDetector
};

function App() {
  const [selectedAgent, setSelectedAgent] = useState('risk-monitor');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getAgentData = (agentId: string) => {
    switch (agentId) {
      case 'liquidity-optimizer':
        return {
          currentPrice: ethers.parseEther('1800').toString(),
          liquidity: ethers.parseEther('500').toString(),
          targetRatio: 0.8
        };
      case 'risk-monitor':
        return {
          balance: ethers.parseEther('100').toString(),
          threshold: ethers.parseEther('10').toString(),
          riskScore: 75
        };
      case 'emergency-brake':
        return {
          emergencyThreshold: 90,
          currentRisk: 85,
          enabled: true
        };
      case 'threshold-guard':
        return {
          value: 1500,
          threshold: 1000,
          operation: 'withdraw'
        };
      case 'anomaly-detector':
        return {
          pattern: 'unusual_volume',
          confidence: 0.92,
          baseline: 1000
        };
      default:
        return {};
    }
  };

  const executeAgent = async () => {
    setLoading(true);
    
    try {
      const agentData = getAgentData(selectedAgent);
      const agent = agents[selectedAgent as keyof typeof agents];
      
      const decision = await agent.decide({
        contractId: 'vault-001',
        user: '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5A',
        customData: agentData
      });
      
      setResult({
        agent: selectedAgent,
        decision,
        inputData: agentData
      });
    } catch (err) {
      setResult({
        agent: selectedAgent,
        error: `Agent execution failed: ${err}`,
        inputData: getAgentData(selectedAgent)
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Real Agent Execution Demo</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>Direct execution of built-in agent logic</p>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Select Agent:</label>
        <select 
          value={selectedAgent} 
          onChange={(e) => setSelectedAgent(e.target.value)}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option value="risk-monitor">Risk Monitor</option>
          <option value="liquidity-optimizer">Liquidity Optimizer</option>
          <option value="emergency-brake">Emergency Brake</option>
          <option value="threshold-guard">Threshold Guard</option>
          <option value="anomaly-detector">Anomaly Detector</option>
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
        {loading ? 'Executing...' : 'Execute Real Agent'}
      </button>

      {result && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <h3>Agent: {result.agent}</h3>
          <div style={{ marginBottom: '10px' }}>
            <strong>Input Data:</strong>
            <pre style={{ fontSize: '12px', backgroundColor: '#e9ecef', padding: '10px', borderRadius: '4px' }}>
              {JSON.stringify(result.inputData, null, 2)}
            </pre>
          </div>
          <div>
            <strong>Decision:</strong>
            <pre style={{ fontSize: '12px', backgroundColor: '#e9ecef', padding: '10px', borderRadius: '4px' }}>
              {JSON.stringify(result.decision, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;