import React, { useState } from 'react';
import Navigation from './Navigation';
import { SDKHealthResults } from '../utils/sdkHealthChecker';
// import { SentinelAgentSDK } from '@sentinel/ai-agent-sdk';

interface AgentDashboardProps {
  sdk: any;
  isReady: boolean;
  healthStatus: SDKHealthResults | null;
}

export default function AgentDashboard({ sdk, isReady, healthStatus }: AgentDashboardProps) {
  const [agentResults, setAgentResults] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState('risk-monitor');
  const [activeTab, setActiveTab] = useState('explain');
  const [sliderValues, setSliderValues] = useState<{[key: string]: number}>({});

  // Future agents (subscription required)
  const futureAgents = [
    { id: 'ai-reasoning-agent', name: 'AI Reasoning Agent', type: 'AI/LLM', description: 'Uses large language models for complex decision-making and natural language understanding' },
    { id: 'x402-payment-agent', name: 'x402 Payment Agent', type: 'x402', description: 'Handles HTTP 402 payment-required flows for micropayments and pay-per-use APIs' },
    { id: 'withdrawal-sentinel', name: 'Withdrawal Risk Sentinel', type: 'Protective', description: 'Monitors withdrawal patterns and prevents risky fund movements' },
    { id: 'settlement-optimizer', name: 'Settlement Batch Optimizer', type: 'Efficiency', description: 'Optimizes batch processing for complex settlements' },
    { id: 'volatility-governor', name: 'Portfolio Volatility Governor', type: 'Market-Responsive', description: 'Adjusts risk parameters based on market volatility' },
    { id: 'compliance-advisor', name: 'Compliance & Audit Advisor', type: 'Regulatory', description: 'Ensures operations meet institutional standards' },
    { id: 'recurring-payment', name: 'Recurring Payment Safety Agent', type: 'Scheduled', description: 'Monitors and protects automated payment flows' },
    { id: 'treasury-preservation', name: 'Treasury Preservation Agent', type: 'Treasury', description: 'Prevents excessive fund depletion with dynamic caps' },
    { id: 'behavior-monitor', name: 'User Behavior Pattern Monitor', type: 'Behavioral', description: 'Learns user patterns and detects anomalies' },
    { id: 'consensus-synthesizer', name: 'Multi-Agent Consensus Synthesizer', type: 'Meta-Agent', description: 'Aggregates decisions from multiple AI agents' },
    { id: 'cost-optimizer', name: 'Cost-Efficiency Optimizer', type: 'Gas', description: 'Minimizes transaction costs through intelligent timing' },
    { id: 'reputation-agent', name: 'Reputation-Aware Risk Agent', type: 'Trust-Based', description: 'Adjusts limits based on historical behavior' },
    { id: 'human-approval', name: 'Human-in-the-Loop Approval Agent', type: 'Hybrid', description: 'Requires human approval for critical decisions' },
    { id: 'genius-act-compliance', name: 'Genius Act Compliance', type: 'Regulatory', description: 'Validates token transactions against Genius Act regulatory requirements' }
  ];

  const agents = [
    {
      id: 'risk-monitor',
      name: 'Risk Monitor',
      type: 'Deterministic',
      purpose: 'Monitors risk metrics and recommends protective actions when thresholds are exceeded',
      controls: ['Risk Threshold', 'Alert Level', 'Auto-Execute'],
      description: 'Analyzes portfolio risk in real-time and triggers protective measures',
      codeExplanation: 'This agent is deterministic because risk assessment follows clear mathematical rules. It calculates risk ratios and applies fixed thresholds for consistent, predictable outcomes. Custom options include adjustable risk thresholds, alert sensitivity levels, and auto-execution toggles.',
      code: `import { BaseAgent } from '../BaseAgent';
import { AgentContext, AgentDecision } from '../types';
import { parseEther, formatEther } from 'ethers';

export class RiskMonitor extends BaseAgent {
  config = {
    id: 'risk-monitor',
    name: 'Risk Monitor Agent',
    description: 'Monitors risk metrics and recommends protective actions',
    version: '1.0.0'
  };

  async decide(context: AgentContext): Promise<AgentDecision> {
    this.validateContext(context);

    const { balance, threshold } = context.customData;
    
    if (!balance || !threshold) {
      throw new Error('RiskMonitor requires balance and threshold in customData');
    }

    const balanceBN = BigInt(balance.toString());
    const thresholdBN = BigInt(threshold.toString());
    const criticalThreshold = thresholdBN / 4n; // 25% of threshold is critical

    if (balanceBN < criticalThreshold) {
      return {
        action: {
          type: 'BLOCK',
          reason: 'Balance critically low',
          severity: 'CRITICAL'
        },
        reason: \`Balance \${balanceBN.toString()} is below critical threshold \${criticalThreshold.toString()}\`,
        confidence: 0.95
      };
    }

    if (balanceBN < thresholdBN) {
      return {
        action: {
          type: 'LIMIT',
          value: (thresholdBN - balanceBN).toString(),
          reason: 'Balance below threshold',
          severity: 'HIGH'
        },
        reason: \`Balance \${balanceBN.toString()} is below threshold \${thresholdBN.toString()}\`,
        confidence: 0.85
      };
    }

    return {
      action: {
        type: 'ALLOW',
        reason: 'Risk acceptable',
        severity: 'LOW'
      },
      reason: 'Balance is within acceptable risk parameters',
      confidence: 0.9
    };
  }
}`
    },
    { 
      id: 'liquidity-optimizer', 
      name: 'Liquidity Optimizer', 
      type: 'Deterministic',
      purpose: 'Optimizes liquidity allocation based on market conditions and yield opportunities',
      controls: ['Target Ratio', 'Rebalance Frequency', 'Slippage Tolerance'],
      description: 'Automatically rebalances liquidity pools for maximum efficiency',
      codeExplanation: 'Deterministic by design to ensure predictable rebalancing behavior. Uses fixed mathematical formulas to calculate optimal ratios. Customizable target ratios, rebalancing frequency intervals, and slippage tolerance levels allow fine-tuning for different market conditions.',
      code: `import { BaseAgent } from '../BaseAgent';
import { AgentContext, AgentDecision } from '../types';
import { parseEther, formatEther } from 'ethers';

export class LiquidityOptimizer extends BaseAgent {
  config = {
    id: 'liquidity-optimizer',
    name: 'Liquidity Optimizer Agent',
    description: 'Optimizes liquidity allocation based on market conditions',
    version: '1.0.0'
  };

  async decide(context: AgentContext): Promise<AgentDecision> {
    this.validateContext(context);

    const { currentPrice, liquidity, targetRatio } = context.customData;
    
    if (!currentPrice || !liquidity || targetRatio === undefined) {
      throw new Error('LiquidityOptimizer requires currentPrice, liquidity, and targetRatio in customData');
    }

    const liquidityBN = BigInt(liquidity.toString());
    const targetLiquidity = (liquidityBN * BigInt(Math.floor(targetRatio * 100))) / 100n;
    const difference = liquidityBN - targetLiquidity;
    const threshold = targetLiquidity / 5n; // 20% threshold for more tolerance
    const absDifference = difference < 0n ? -difference : difference;

    if (absDifference <= threshold) {
      return {
        action: {
          type: 'HOLD',
          reason: 'Liquidity within target range'
        },
        reason: \`Current liquidity \${liquidityBN.toString()} is within target range\`,
        confidence: 0.8
      };
    }

    if (difference > 0n) {
      return {
        action: {
          type: 'REMOVE',
          value: difference.toString(),
          reason: 'Excess liquidity detected'
        },
        reason: \`Remove \${difference.toString()} excess liquidity\`,
        confidence: 0.85
      };
    }

    return {
      action: {
        type: 'ADD',
        value: absDifference.toString(),
        reason: 'Insufficient liquidity'
      },
      reason: \`Add \${absDifference.toString()} liquidity to reach target\`,
      confidence: 0.85
    };
  }
}`
    },
    { 
      id: 'emergency-brake', 
      name: 'Emergency Brake', 
      type: 'Deterministic',
      purpose: 'Triggers emergency stops when critical thresholds are breached',
      controls: ['Emergency Threshold', 'Cooldown Period', 'Recovery Mode'],
      description: 'Circuit breaker that halts operations during extreme market conditions',
      codeExplanation: 'Deterministic for reliability in crisis situations - no room for uncertainty when protecting funds. Uses clear volatility thresholds and binary decisions. Custom emergency thresholds, cooldown periods, and recovery modes can be configured per protocol needs.',
      code: `import { BaseAgent } from '../BaseAgent';
import { AgentContext, AgentDecision } from '../types';

export interface EmergencyContext {
  metric: number;
  criticalThreshold: number;
}

export interface EmergencyAction {
  type: 'PAUSE' | 'RESUME';
  reason: string;
}

export class EmergencyBrake extends BaseAgent {
  config = {
    id: 'emergency-brake',
    name: 'Emergency Brake',
    description: 'Triggers emergency stops when critical thresholds are breached',
    version: '1.0.0'
  };

  async decide(context: AgentContext): Promise<AgentDecision> {
    this.validateContext(context);
    
    const { metric, criticalThreshold } = context.customData;
    
    if (!metric || !criticalThreshold) {
      throw new Error('EmergencyBrake requires metric and criticalThreshold in customData');
    }

    if (metric >= criticalThreshold) {
      return {
        action: { type: 'PAUSE', reason: 'Critical threshold breached', severity: 'CRITICAL' },
        reason: \`Metric \${metric} exceeded critical threshold \${criticalThreshold}\`,
        confidence: 1.0
      };
    }

    return {
      action: { type: 'RESUME', reason: 'System operating normally', severity: 'LOW' },
      reason: 'All metrics within safe range',
      confidence: 0.95
    };
  }
}`
    },
    { 
      id: 'threshold-guard', 
      name: 'Threshold Guard', 
      type: 'Deterministic',
      purpose: 'Enforces threshold limits on operations to prevent excessive exposure',
      controls: ['Max Exposure', 'Daily Limits', 'User Limits'],
      description: 'Prevents operations that exceed predefined safety limits',
      codeExplanation: 'Deterministic to ensure consistent policy enforcement across all transactions. Simple ratio calculations provide clear pass/fail decisions. Configurable exposure limits, daily transaction caps, and per-user restrictions enable flexible risk management.',
      code: `import { BaseAgent } from '../BaseAgent';
import { AgentContext, AgentDecision } from '../types';

export interface ThresholdContext {
  value: bigint;
  minThreshold: bigint;
  maxThreshold: bigint;
}

export interface ThresholdAction {
  type: 'APPROVE' | 'REJECT';
  adjustedValue?: bigint;
}

export class ThresholdGuard extends BaseAgent {
  config = {
    id: 'threshold-guard',
    name: 'Threshold Guard',
    description: 'Enforces threshold limits on operations',
    version: '1.0.0'
  };

  async decide(context: AgentContext): Promise<AgentDecision> {
    this.validateContext(context);
    
    const { value, minThreshold, maxThreshold } = context.customData;
    
    if (!value || !minThreshold || !maxThreshold) {
      throw new Error('ThresholdGuard requires value, minThreshold, and maxThreshold in customData');
    }
    
    const valueBN = BigInt(value.toString());
    const minBN = BigInt(minThreshold.toString());
    const maxBN = BigInt(maxThreshold.toString());

    if (valueBN < minBN) {
      return {
        action: { type: 'REJECT', reason: 'Below minimum threshold', severity: 'HIGH' },
        reason: \`Value \${valueBN} below minimum threshold \${minBN}\`,
        confidence: 1.0
      };
    }

    if (valueBN > maxBN) {
      return {
        action: { type: 'APPROVE', value: maxBN.toString(), reason: 'Capped at maximum', severity: 'MEDIUM' },
        reason: \`Value capped at maximum threshold \${maxBN}\`,
        confidence: 0.9
      };
    }

    return {
      action: { type: 'APPROVE', reason: 'Within thresholds', severity: 'LOW' },
      reason: 'Value within acceptable thresholds',
      confidence: 1.0
    };
  }
}`
    },
    { 
      id: 'anomaly-detector', 
      name: 'Anomaly Detector', 
      type: 'Statistical',
      purpose: 'Detects unusual patterns in contract behavior using statistical analysis',
      controls: ['Sensitivity', 'Learning Period', 'Alert Threshold'],
      description: 'Uses ML to identify suspicious or unusual transaction patterns',
      codeExplanation: 'Statistical (not deterministic) because it uses machine learning models that adapt over time. Pattern recognition requires probabilistic analysis rather than fixed rules. Adjustable sensitivity levels, learning periods, and alert thresholds allow tuning for different protocols and risk tolerances.',
      code: `import { BaseAgent } from '../BaseAgent';
import { AgentContext, AgentDecision } from '../types';

export interface AnomalyContext {
  currentValue: number;
  historicalAverage: number;
  standardDeviation: number;
}

export interface AnomalyAction {
  type: 'NORMAL' | 'ANOMALY_DETECTED';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export class AnomalyDetector extends BaseAgent {
  config = {
    id: 'anomaly-detector',
    name: 'Anomaly Detector',
    description: 'Detects unusual patterns in contract behavior',
    version: '1.0.0'
  };

  async decide(context: AgentContext): Promise<AgentDecision> {
    this.validateContext(context);
    const { currentValue, historicalAverage, standardDeviation } = context.customData;
    const deviation = Math.abs(currentValue - historicalAverage);
    const zScore = standardDeviation > 0 ? deviation / standardDeviation : 0;

    if (zScore > 3) {
      return {
        action: { type: 'ANOMALY_DETECTED', severity: 'HIGH', reason: 'Severe anomaly detected' },
        reason: \`Severe anomaly detected: \${zScore.toFixed(2)} standard deviations\`,
        confidence: 0.95
      };
    }

    if (zScore > 2) {
      return {
        action: { type: 'ANOMALY_DETECTED', severity: 'MEDIUM', reason: 'Moderate anomaly detected' },
        reason: \`Moderate anomaly detected: \${zScore.toFixed(2)} standard deviations\`,
        confidence: 0.85
      };
    }

    if (zScore > 1.5) {
      return {
        action: { type: 'ANOMALY_DETECTED', severity: 'LOW', reason: 'Minor anomaly detected' },
        reason: \`Minor anomaly detected: \${zScore.toFixed(2)} standard deviations\`,
        confidence: 0.7
      };
    }

    return {
      action: { type: 'NORMAL', severity: 'LOW', reason: 'Behavior normal' },
      reason: 'Behavior within normal parameters',
      confidence: 0.9
    };
  }
}`
    }
  ];

  const executeAgent = async () => {
    if (!isReady) return;

    // Demo mode - simulate agent execution
    const mockResult = {
      action: {
        type: Math.random() > 0.3 ? 'ALLOW' : 'BLOCK',
        confidence: Math.random(),
        reason: `${selectedAgent} analysis complete`
      },
      metadata: {
        executionTime: Math.floor(Math.random() * 100) + 'ms',
        agentType: agents.find(a => a.id === selectedAgent)?.type
      }
    };

    setAgentResults(prev => [{
      id: Date.now(),
      agent: selectedAgent,
      result: mockResult,
      timestamp: new Date().toLocaleTimeString()
    }, ...prev.slice(0, 4)]);
  };

  const currentAgent = agents.find(a => a.id === selectedAgent);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">Loading Cronos AI Agent SDK...</h2>
          <p className="text-gray-600">Initializing built-in agents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation isReady={isReady} />
      {/* Header */}
      <div className="bg-white shadow pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cronos AI Agent Dashboard</h1>
              <p className="text-gray-600">Real-time agent execution and monitoring</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                isReady ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm text-gray-600">
                {isReady ? 'SDK Connected' : 'SDK Disconnected'}
              </span>
              {healthStatus && (
                <button 
                  className="text-xs text-blue-600 hover:text-blue-800 ml-2"
                  onClick={() => {
                    const details = Object.entries(healthStatus).map(([key, status]) => 
                      `${key}: ${status.status} - ${status.message}`
                    ).join('\n');
                    alert(`SDK Health Details:\n\n${details}`);
                  }}
                >
                  View Details
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-2 sm:px-3 lg:px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-[30%_1fr] gap-4 h-[calc(100vh-200px)]">
          {/* Left Panel - Agent Selection */}
          <div className="bg-white rounded-lg shadow p-4 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Agents</h3>
            <div className="space-y-3 mb-8">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedAgent === agent.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedAgent(agent.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-900">{agent.name}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      agent.type === 'Statistical'
                        ? 'bg-purple-100 text-purple-800'
                        : agent.type === 'Regulatory'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {agent.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{agent.description}</p>
                </div>
              ))}
            </div>

            {/* Future Agents - Subscription Required */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Future Agents</h3>
                <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">
                  Subscription Required
                </span>
              </div>
              <div className="space-y-3">
                {futureAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className="p-4 rounded-lg border border-gray-200 bg-gray-50 opacity-75 cursor-not-allowed"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-700">{agent.name}</span>
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-600">
                        {agent.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{agent.description}</p>
                    <div className="mt-2 flex items-center text-xs text-amber-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Subscribe to unlock
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Agent Controls & Interaction */}
          <div className="bg-white rounded-lg shadow p-4 flex flex-col">
            {currentAgent && (
              <>
                {/* Agent Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{currentAgent.name}</h3>
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      currentAgent.type === 'Statistical' 
                        ? 'bg-purple-100 text-purple-800'
                        : currentAgent.type === 'Regulatory'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {currentAgent.type}
                    </span>
                  </div>
                </div>

                {/* Tabs */}
                <div className="mb-6">
                  <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                      {[
                        { id: 'explain', label: 'Explain' },
                        { id: 'code', label: 'Code' },
                        { id: 'action', label: 'See in Action' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === tab.id
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1">
                  {activeTab === 'explain' && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-3">Purpose</h4>
                      <p className="text-gray-600 mb-6">{currentAgent.purpose}</p>
                      
                      <h4 className="text-lg font-medium text-gray-900 mb-3">How it Works</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• Monitors contract events in real-time</li>
                          <li>• Applies {currentAgent.type.toLowerCase()} analysis</li>
                          <li>• Executes protective actions when needed</li>
                          <li>• Provides detailed execution reports</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeTab === 'code' && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-3">Agent Details</h4>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-blue-800">{currentAgent.codeExplanation}</p>
                      </div>
                      
                      <h4 className="text-lg font-medium text-gray-900 mb-3">Implementation</h4>
                      <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-green-400 text-sm">
                          <code>{currentAgent.code}</code>
                        </pre>
                      </div>
                    </div>
                  )}

                  {activeTab === 'action' && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-3">Controls</h4>
                      <div className="grid grid-cols-1 gap-3 mb-6">
                        {currentAgent.controls.map((control, index) => {
                          const key = `${selectedAgent}-${index}`;
                          const value = sliderValues[key] || 50;
                          return (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <label className="text-sm font-medium text-gray-700">{control}</label>
                              <div className="flex items-center space-x-3">
                                <input 
                                  type="range" 
                                  className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                  value={value}
                                  onChange={(e) => setSliderValues(prev => ({...prev, [key]: parseInt(e.target.value)}))}
                                />
                                <span className="text-sm font-medium text-gray-900 w-8">{value}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        onClick={executeAgent}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium mb-6"
                      >
                        Execute {currentAgent.name}
                      </button>

                      <h4 className="text-lg font-medium text-gray-900 mb-3">Recent Results</h4>
                      {agentResults.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                          <p className="text-sm">No executions yet. Click "Execute" to see results.</p>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {agentResults.filter(r => r.agent === selectedAgent).map((result) => (
                            <div key={result.id} className="border border-gray-200 rounded-lg p-3">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-500">{result.timestamp}</span>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  result.result.action?.type === 'ALLOW' || result.result.action?.type === 'OPTIMIZE'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {result.result.action?.type || 'PROCESSED'}
                                </span>
                              </div>
                              <div className="text-sm text-gray-700">
                                <strong>Confidence:</strong> {(result.result.action?.confidence * 100).toFixed(1)}%<br/>
                                <strong>Reason:</strong> {result.result.action?.reason}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}