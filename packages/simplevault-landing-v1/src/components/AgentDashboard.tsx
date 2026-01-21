import { useState } from 'react';
import Navigation from './Navigation';
import { SDKHealthResults } from '../utils/sdkHealthChecker';
import { SentinelAgentSDK, AgentDecision } from '@sentinal/ai-agent-sdk';
import PaymentModal from './PaymentModal';

interface AgentDashboardProps {
  sdk: SentinelAgentSDK | null;
  isReady: boolean;
  healthStatus: SDKHealthResults | null;
}

interface AgentResult {
  id: number;
  agent: string;
  result: AgentDecision;
  timestamp: string;
  executionTime: number;
}

export default function AgentDashboard({ sdk, isReady, healthStatus }: AgentDashboardProps) {
  const [agentResults, setAgentResults] = useState<AgentResult[]>([]);
  const [selectedAgent, setSelectedAgent] = useState('risk-monitor');
  const [activeTab, setActiveTab] = useState('explain');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [sliderValues, setSliderValues] = useState<{[key: string]: number}>({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingPayment, setPendingPayment] = useState<{amount: number; currency: string} | null>(null);

  // Future agents (subscription required)
  const futureAgents = [
    { id: 'ai-reasoning-agent', name: 'AI Reasoning Agent', type: 'AI/LLM', description: 'Uses large language models for complex decision-making and natural language understanding' },
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
    },
    {
      id: 'x402-payment-agent',
      name: 'x402 Payment Agent',
      type: 'Payment',
      purpose: 'Handles HTTP 402 payment-required flows for micropayments and pay-per-use APIs',
      controls: ['Payment Amount ($)', 'Payment Method', 'Test Mode'],
      description: 'Processes payments and manages pay-per-use billing automatically',
      codeExplanation: 'Deterministic payment processing with configurable thresholds. Micropayments under $1 are auto-approved, standard payments require confirmation, and large payments need enhanced verification. Supports multiple currencies and payment methods.',
      code: `import { BaseAgent } from '../BaseAgent';
import { AgentContext, AgentDecision } from '../types';

export class X402PaymentAgent extends BaseAgent {
  config = {
    id: 'x402-payment-agent',
    name: 'x402 Payment Agent',
    description: 'Handles HTTP 402 payment-required flows',
    version: '1.0.0'
  };

  async decide(context: AgentContext): Promise<AgentDecision> {
    const { amount, currency } = context.customData;
    const microPaymentThreshold = 1.0;
    const standardPaymentThreshold = 10.0;

    if (amount <= 0) {
      return {
        action: {
          type: 'PAYMENT_FAILED',
          reason: 'Invalid payment amount',
          severity: 'HIGH'
        },
        reason: 'Payment amount must be greater than zero',
        confidence: 1.0
      };
    }

    if (amount < microPaymentThreshold) {
      return {
        action: {
          type: 'PAYMENT_APPROVED',
          amount,
          currency,
          transactionId: \`tx_\${Date.now()}\`,
          reason: 'Micropayment auto-approved',
          severity: 'LOW'
        },
        reason: \`Micropayment of \${amount} \${currency} approved\`,
        confidence: 0.95
      };
    }

    if (amount < standardPaymentThreshold) {
      return {
        action: {
          type: 'PAYMENT_REQUIRED',
          amount,
          currency,
          reason: 'Payment confirmation required',
          severity: 'MEDIUM'
        },
        reason: \`Payment of \${amount} \${currency} requires confirmation\`,
        confidence: 0.9
      };
    }

    return {
      action: {
        type: 'PAYMENT_REQUIRED',
        amount,
        currency,
        reason: 'Enhanced verification required',
        severity: 'HIGH'
      },
      reason: \`Large payment of \${amount} \${currency} requires verification\`,
      confidence: 0.85
    };
  }
}`
    }
  ];

  // Helper function to build context based on agent type
  const buildAgentContext = (agentId: string) => {
    const baseContext = {
      contractId: 'simple-vault',
      user: '0x656a4D09f53ab82f6B291082cb3159F7c14424dE', // SimpleVault address as demo user
      timestamp: Date.now(),
      customData: {} as Record<string, any>
    };

    // Build customData based on agent type and slider values
    switch (agentId) {
      case 'risk-monitor':
        baseContext.customData = {
          balance: BigInt(sliderValues[`${agentId}-0`] || 50) * BigInt(1e18), // Convert to wei
          threshold: BigInt(100) * BigInt(1e18) // 100 ETH threshold
        };
        break;

      case 'liquidity-optimizer':
        baseContext.customData = {
          currentPrice: 1000, // Mock price
          liquidity: BigInt(sliderValues[`${agentId}-0`] || 50) * BigInt(1e18),
          targetRatio: (sliderValues[`${agentId}-1`] || 50) / 100 // Convert to 0-1 ratio
        };
        break;

      case 'emergency-brake':
        baseContext.customData = {
          metric: sliderValues[`${agentId}-0`] || 50,
          criticalThreshold: sliderValues[`${agentId}-1`] || 80
        };
        break;

      case 'threshold-guard':
        baseContext.customData = {
          value: BigInt(sliderValues[`${agentId}-0`] || 50) * BigInt(1e18),
          minThreshold: BigInt(10) * BigInt(1e18),
          maxThreshold: BigInt(100) * BigInt(1e18)
        };
        break;

      case 'anomaly-detector':
        baseContext.customData = {
          currentValue: sliderValues[`${agentId}-0`] || 50,
          historicalAverage: 50,
          standardDeviation: sliderValues[`${agentId}-1`] || 10
        };
        break;

      case 'x402-payment-agent':
        baseContext.customData = {
          amount: (sliderValues[`${agentId}-0`] || 5) / 10, // Convert to dollars (0.5 - 10.0)
          currency: 'USD',
          paymentMethod: 'cronos',
          userId: baseContext.user
        };
        break;

      default:
        baseContext.customData = {
          value: sliderValues[`${agentId}-0`] || 50
        };
    }

    return baseContext;
  };

  const executeAgent = async () => {
    if (!isReady || !sdk) {
      setExecutionError('SDK not ready');
      return;
    }

    setIsExecuting(true);
    setExecutionError(null);
    const startTime = performance.now();

    try {
      console.log(`🚀 Executing agent: ${selectedAgent}`);

      // Build context based on agent type
      const context = buildAgentContext(selectedAgent);
      console.log('📝 Context:', context);

      // Execute the real agent
      const decision = await sdk.executeAgent(selectedAgent, context);
      const executionTime = performance.now() - startTime;

      console.log('✅ Decision:', decision);
      console.log(`⏱️ Execution time: ${executionTime.toFixed(2)}ms`);

      // Check if payment is required (x402 agent)
      if (selectedAgent === 'x402-payment-agent' && 
          decision.action?.type === 'PAYMENT_REQUIRED') {
        setPendingPayment({
          amount: context.customData.amount,
          currency: context.customData.currency
        });
        setShowPaymentModal(true);
      }

      // Add result to history
      setAgentResults(prev => [{
        id: Date.now(),
        agent: selectedAgent,
        result: decision,
        timestamp: new Date().toLocaleTimeString(),
        executionTime: Math.round(executionTime)
      }, ...prev.slice(0, 4)]);

    } catch (error) {
      console.error('❌ Agent execution failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setExecutionError(errorMessage);
    } finally {
      setIsExecuting(false);
    }
  };

  const currentAgent = agents.find(a => a.id === selectedAgent);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">Sentinel Agents SDK...</h2>
          <p className="text-gray-600">Initializing built-in agents ...</p>
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
              {healthStatus && sdk && (
                <>
                  <button
                    className="text-xs text-blue-600 hover:text-blue-800 ml-2 px-3 py-1 border border-blue-600 rounded hover:bg-blue-50"
                    onClick={() => setShowDetailsModal(true)}
                  >
                    View Details
                  </button>
                  <button
                    className="text-xs text-green-600 hover:text-green-800 px-3 py-1 border border-green-600 rounded hover:bg-green-50"
                    onClick={() => setShowSummaryModal(true)}
                  >
                    Summary
                  </button>
                </>
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
                      {/* x402 Special UI */}
                      {selectedAgent === 'x402-payment-agent' ? (
                        <div className="space-y-6">
                          {/* Header */}
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">x402 Payment Standard Demo</h4>
                            <p className="text-sm text-gray-700">
                              This agent demonstrates the complete HTTP 402 Payment Required standard with three key capabilities:
                            </p>
                          </div>

                          {/* Three Capabilities */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* 1. Decision Making */}
                            <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
                              <div className="flex items-center mb-3">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-2">1</div>
                                <h5 className="font-semibold text-gray-900">Decision Logic</h5>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">Agent evaluates payment amounts and determines:</p>
                              <ul className="text-xs text-gray-600 space-y-1">
                                <li>• &lt;$1: Auto-approve</li>
                                <li>• $1-$10: Require confirmation</li>
                                <li>• &gt;$10: Enhanced verification</li>
                              </ul>
                            </div>

                            {/* 2. Wallet Integration */}
                            <div className="bg-white border-2 border-purple-200 rounded-lg p-4">
                              <div className="flex items-center mb-3">
                                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-2">2</div>
                                <h5 className="font-semibold text-gray-900">Crypto Wallet</h5>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">Blockchain payment processing:</p>
                              <ul className="text-xs text-gray-600 space-y-1">
                                <li>• MetaMask integration</li>
                                <li>• Cronos network</li>
                                <li>• On-chain verification</li>
                              </ul>
                            </div>

                            {/* 3. Fiat Transactions */}
                            <div className="bg-white border-2 border-green-200 rounded-lg p-4">
                              <div className="flex items-center mb-3">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-2">3</div>
                                <h5 className="font-semibold text-gray-900">Fiat Payments</h5>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">Traditional card processing:</p>
                              <ul className="text-xs text-gray-600 space-y-1">
                                <li>• Square integration</li>
                                <li>• Credit/debit cards</li>
                                <li>• PCI DSS compliant</li>
                              </ul>
                            </div>
                          </div>

                          {/* Payment Amount Control */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Payment Amount (USD)</label>
                            <div className="flex items-center space-x-4">
                              <input
                                type="range"
                                min="0"
                                max="150"
                                value={sliderValues[`${selectedAgent}-0`] || 50}
                                onChange={(e) => setSliderValues(prev => ({...prev, [`${selectedAgent}-0`]: parseInt(e.target.value)}))}
                                className="flex-1 h-3 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 rounded-lg appearance-none cursor-pointer"
                              />
                              <div className="text-right min-w-[80px]">
                                <div className="text-2xl font-bold text-gray-900">
                                  ${((sliderValues[`${selectedAgent}-0`] || 50) / 10).toFixed(2)}
                                </div>
                                <div className="text-xs text-gray-500">USD</div>
                              </div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                              <span>$0.00 (Invalid)</span>
                              <span>$1.00 (Micro)</span>
                              <span>$10.00 (Standard)</span>
                              <span>$15.00 (Large)</span>
                            </div>
                          </div>

                          {/* Payment Method Selector */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Payment Method</label>
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                onClick={() => setSliderValues(prev => ({...prev, [`${selectedAgent}-method`]: 'wallet'}))}
                                className={`p-3 rounded-lg border-2 transition-all ${
                                  (sliderValues[`${selectedAgent}-method`] || 'wallet') === 'wallet'
                                    ? 'border-purple-500 bg-purple-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className="flex items-center justify-center space-x-2">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                  </svg>
                                  <span className="font-medium">Crypto Wallet</span>
                                </div>
                              </button>
                              <button
                                onClick={() => setSliderValues(prev => ({...prev, [`${selectedAgent}-method`]: 'card'}))}
                                className={`p-3 rounded-lg border-2 transition-all ${
                                  sliderValues[`${selectedAgent}-method`] === 'card'
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className="flex items-center justify-center space-x-2">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                  </svg>
                                  <span className="font-medium">Credit Card</span>
                                </div>
                              </button>
                            </div>
                          </div>

                          {/* Execute Button */}
                          <button
                            onClick={executeAgent}
                            disabled={isExecuting || !sdk}
                            className={`w-full py-4 px-4 rounded-lg transition-colors font-semibold text-lg flex items-center justify-center ${
                              isExecuting || !sdk
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
                            }`}
                          >
                            {isExecuting ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing Payment...
                              </>
                            ) : (
                              <>
                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Test x402 Payment Flow
                              </>
                            )}
                          </button>

                          {/* Info Box */}
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start">
                              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div className="text-sm text-blue-800">
                                <p className="font-medium mb-1">How it works:</p>
                                <p>The agent evaluates the amount and determines if payment is required. For amounts ≥$1, a payment modal opens where you can choose between crypto wallet or credit card payment methods.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Original controls for other agents */
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
                            disabled={isExecuting || !sdk}
                            className={`w-full py-3 px-4 rounded-lg transition-colors font-medium mb-6 flex items-center justify-center ${
                              isExecuting || !sdk
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                          >
                            {isExecuting ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Executing...
                              </>
                            ) : (
                              `Execute ${currentAgent.name}`
                            )}
                          </button>
                        </div>
                      )}

                      <h4 className="text-lg font-medium text-gray-900 mb-3">Recent Results</h4>

                      {/* Error Display */}
                      {executionError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-start">
                            <svg className="w-5 h-5 text-red-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                              <p className="text-sm font-medium text-red-800">Execution Error</p>
                              <p className="text-sm text-red-700 mt-1">{executionError}</p>
                            </div>
                          </div>
                        </div>
                      )}

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
                          {agentResults.filter(r => r.agent === selectedAgent).map((result) => {
                            // Determine action color based on type
                            const actionType = result.result.action?.type || 'UNKNOWN';
                            const isPositive = ['ALLOW', 'APPROVE', 'RESUME', 'NORMAL', 'HOLD'].includes(actionType);
                            const isWarning = ['LIMIT', 'ANOMALY_DETECTED', 'REMOVE', 'ADD'].includes(actionType);

                            return (
                              <div key={result.id} className="border border-gray-200 rounded-lg p-3 bg-white">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-xs text-gray-500">{result.timestamp}</span>
                                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        isPositive
                                          ? 'bg-green-100 text-green-800'
                                          : isWarning
                                          ? 'bg-yellow-100 text-yellow-800'
                                          : 'bg-red-100 text-red-800'
                                      }`}>
                                        {actionType}
                                      </span>
                                    </div>
                                    {result.result.action?.severity && (
                                      <span className={`inline-block px-2 py-0.5 text-xs rounded ${
                                        result.result.action.severity === 'CRITICAL'
                                          ? 'bg-red-100 text-red-700'
                                          : result.result.action.severity === 'HIGH'
                                          ? 'bg-orange-100 text-orange-700'
                                          : result.result.action.severity === 'MEDIUM'
                                          ? 'bg-yellow-100 text-yellow-700'
                                          : 'bg-blue-100 text-blue-700'
                                      }`}>
                                        {result.result.action.severity}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="text-sm text-gray-700 space-y-1">
                                  <div>
                                    <strong className="text-gray-900">Confidence:</strong>{' '}
                                    <span className={`font-medium ${
                                      result.result.confidence >= 0.9
                                        ? 'text-green-600'
                                        : result.result.confidence >= 0.7
                                        ? 'text-yellow-600'
                                        : 'text-red-600'
                                    }`}>
                                      {(result.result.confidence * 100).toFixed(1)}%
                                    </span>
                                  </div>
                                  <div>
                                    <strong className="text-gray-900">Reason:</strong>{' '}
                                    <span className="text-gray-600">{result.result.reason}</span>
                                  </div>
                                  {result.result.action?.reason && (
                                    <div>
                                      <strong className="text-gray-900">Action:</strong>{' '}
                                      <span className="text-gray-600">{result.result.action.reason}</span>
                                    </div>
                                  )}
                                  <div className="text-xs text-gray-500 mt-2">
                                    ⏱️ Executed in {result.executionTime}ms
                                  </div>
                                </div>
                              </div>
                            );
                          })}
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

      {/* SDK Details Modal */}
      {showDetailsModal && sdk && healthStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">SDK Status Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content - No scrollbar, fixed height */}
            <div className="p-6 space-y-6">
              {/* Network Section */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">🌐 Network</h4>
                <p className="text-lg font-medium text-gray-900">{sdk.getNetwork()}</p>
              </div>

              {/* Contracts Section */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  📋 Registered Contracts ({typeof sdk.getAllContractDetails === 'function' ? sdk.getAllContractDetails().length : 0})
                </h4>
                {typeof sdk.getAllContractDetails === 'function' ? (
                  sdk.getAllContractDetails().length > 0 ? (
                    <div className="space-y-3">
                      {sdk.getAllContractDetails().map((contract) => (
                        <div key={contract.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="font-medium text-gray-900 mb-2">• {contract.id}</div>
                          <div className="text-sm text-gray-600 space-y-1 ml-4">
                            <div><span className="font-medium">Address:</span> {contract.address}</div>
                            <div><span className="font-medium">Network:</span> {contract.network}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No contracts registered</p>
                  )
                ) : (
                  <p className="text-amber-600 text-sm">Method not available (SDK needs rebuild)</p>
                )}
              </div>

              {/* Agents Section */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  🤖 Registered Agents ({typeof sdk.listAgents === 'function' ? sdk.listAgents().length : 0})
                </h4>
                {typeof sdk.listAgents === 'function' ? (
                  sdk.listAgents().length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {sdk.listAgents().map((agent) => (
                        <div key={agent} className="bg-blue-50 rounded px-3 py-2 text-sm text-blue-900">
                          • {agent}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No agents registered</p>
                  )
                ) : (
                  <p className="text-amber-600 text-sm">Method not available (SDK needs rebuild)</p>
                )}
              </div>

              {/* Health Status Section */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">💚 Health Status</h4>
                <div className="space-y-2">
                  {Object.entries(healthStatus).map(([key, status]) => (
                    <div key={key} className="flex items-center justify-between bg-gray-50 rounded px-4 py-2">
                      <span className="text-sm font-medium text-gray-700">{key}</span>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          status.status === 'success'
                            ? 'bg-green-100 text-green-800'
                            : status.status === 'warning'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {status.status}
                        </span>
                        <span className="text-xs text-gray-500">{status.message}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Modal */}
      {showSummaryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">SDK & SimpleVault Landing Integration Summary</h3>
              <button
                onClick={() => setShowSummaryModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="prose prose-sm max-w-none">
                {/* How They're Related */}
                <section className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">How They're Related</h2>

                  <h3 className="text-md font-semibold text-gray-800 mb-2">Dependency</h3>
                  <ul className="list-disc pl-5 text-gray-700 space-y-1 mb-4">
                    <li>The <code className="bg-gray-100 px-1 rounded">simplevault-landing-v1</code> app <strong>imports and uses</strong> the <code className="bg-gray-100 px-1 rounded">@sentinal/ai-agent-sdk</code> package from <code className="bg-gray-100 px-1 rounded">packages/core</code></li>
                    <li>Defined in <code className="bg-gray-100 px-1 rounded">package.json</code>: <code className="bg-gray-100 px-1 rounded">"@sentinal/ai-agent-sdk": "file:../core"</code></li>
                    <li>This is a <strong>monorepo setup</strong> with local package linking</li>
                  </ul>

                  <h3 className="text-md font-semibold text-gray-800 mb-2">Architecture</h3>
                  <ul className="list-disc pl-5 text-gray-700 space-y-1 mb-4">
                    <li><strong>SDK (packages/core)</strong>: Core library with agents, contract management, policy engine</li>
                    <li><strong>Landing App</strong>: React frontend that consumes the SDK to provide a UI</li>
                  </ul>
                </section>

                <hr className="my-6 border-gray-200" />

                {/* Dashboard Contract Connection */}
                <section className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Dashboard Contract Connection</h2>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-green-800 font-semibold">✅ YES - The dashboard loads with a fully connected contract!</p>
                  </div>

                  <h3 className="text-md font-semibold text-gray-800 mb-2">Initialization Flow</h3>
                  <ol className="list-decimal pl-5 text-gray-700 space-y-1 mb-4">
                    <li><code className="bg-gray-100 px-1 rounded">App.tsx</code> loads → SDK initializes</li>
                    <li>Connects to Cronos testnet RPC (<code className="bg-gray-100 px-1 rounded">https://evm-t3.cronos.org</code>)</li>
                    <li>Registers 5 built-in agents</li>
                    <li><strong>Registers SimpleVault contract</strong> (<code className="bg-gray-100 px-1 rounded">0x656a4D09f53ab82f6B291082cb3159F7c14424dE</code>)</li>
                    <li>Passes SDK instance to Dashboard component</li>
                    <li>Dashboard is ready with contract pre-registered</li>
                  </ol>

                  <h3 className="text-md font-semibold text-gray-800 mb-2">When User Executes an Agent</h3>
                  <ol className="list-decimal pl-5 text-gray-700 space-y-1 mb-4">
                    <li>Dashboard builds context with <code className="bg-gray-100 px-1 rounded">contractId: 'simple-vault'</code></li>
                    <li>Calls <code className="bg-gray-100 px-1 rounded">sdk.executeAgent(agentId, context)</code></li>
                    <li>SDK looks up both the agent AND contract from registries</li>
                    <li>Agent executes with contract context</li>
                    <li>Results displayed to user</li>
                  </ol>
                </section>

                <hr className="my-6 border-gray-200" />

                {/* Key Files Created */}
                <section className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Key Files Created</h2>
                  <ul className="list-none text-gray-700 space-y-1">
                    <li>✅ <code className="bg-gray-100 px-1 rounded">.env</code> - Environment configuration with contract details</li>
                    <li>✅ <code className="bg-gray-100 px-1 rounded">.env.example</code> - Template for sharing</li>
                    <li>✅ <code className="bg-gray-100 px-1 rounded">SDK_INTEGRATION_EXPLAINED.md</code> - Detailed documentation</li>
                    <li>✅ Two interactive diagrams showing the flow</li>
                  </ul>
                </section>

                <hr className="my-6 border-gray-200" />

                {/* Important Note */}
                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Important Note</h2>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 font-medium">
                      <strong>The contract is already connected when the dashboard loads - no additional connection needed!</strong>
                    </p>
                  </div>
                </section>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => setShowSummaryModal(false)}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && pendingPayment && (
        <PaymentModal
          isOpen={showPaymentModal}
          amount={pendingPayment.amount}
          currency={pendingPayment.currency}
          onClose={() => {
            setShowPaymentModal(false);
            setPendingPayment(null);
          }}
          onPaymentComplete={(transactionId, provider) => {
            console.log(`💳 Payment completed: ${transactionId} via ${provider}`);
            setShowPaymentModal(false);
            setPendingPayment(null);
            
            // Add successful payment to results
            setAgentResults(prev => [{
              id: Date.now(),
              agent: 'x402-payment-agent',
              result: {
                action: {
                  type: 'PAYMENT_APPROVED',
                  transactionId,
                  reason: `Payment processed via ${provider}`,
                  severity: 'LOW'
                },
                reason: `Payment of $${pendingPayment.amount} ${pendingPayment.currency} completed successfully`,
                confidence: 1.0
              },
              timestamp: new Date().toLocaleTimeString(),
              executionTime: 0
            }, ...prev.slice(0, 4)]);
          }}
          onPaymentFailed={(error) => {
            console.error(`❌ Payment failed: ${error}`);
            setExecutionError(error);
            setShowPaymentModal(false);
            setPendingPayment(null);
          }}
        />
      )}
    </div>
  );
}

