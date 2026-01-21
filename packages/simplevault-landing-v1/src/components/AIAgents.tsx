import { Shield, AlertTriangle, Zap, Brain, Fuel, FileText, TrendingUp } from 'lucide-react';

const agents = [
  {
    icon: Shield,
    name: 'Withdrawal Risk Sentinel',
    type: 'Deterministic',
    confidence: '70%',
    description: 'Monitors account balances and recommends safe withdrawal limits to prevent sudden drainage.',
    howItWorks: 'Starts at 50% of balance, then tightens by 5% each time to gradually reduce risk exposure.',
    example: 'User has 10 CRO → Recommends 5 CRO limit initially, then 4.75 CRO next time',
    useCase: 'Protects users from accidentally draining accounts while maintaining reasonable fund access.'
  },
  {
    icon: AlertTriangle,
    name: 'Emergency Brake',
    type: 'Deterministic',
    confidence: '85% (severe) / 60% (normal)',
    description: 'Crisis-mode limiter that aggressively restricts withdrawals during abnormal market conditions.',
    howItWorks: 'Normal: 25% of balance. Severe risk: Clamps to 10% when volatility spikes or anomalies detected.',
    example: 'During market crash → User has 10 CRO → Agent limits to 1 CRO (10%)',
    useCase: 'Automatic circuit breaker during market volatility, hacks, or suspicious activity.'
  },
  {
    icon: Zap,
    name: 'Settlement Batch Optimizer',
    type: 'Deterministic',
    confidence: '75%',
    description: 'Calculates safe caps for x402 payment-gated settlements without over-exposing liquidity.',
    howItWorks: 'Baseline 40% of balance. Approves requested amounts below baseline. Executes after payment verification.',
    example: 'Merchant has 100 CRO, requests 30 CRO → Approved (below 40 CRO baseline)',
    useCase: 'Merchant payment settlements, batch payouts, treasury operations with payment verification.'
  },
  {
    icon: Fuel,
    name: 'Gas Fee Monitor',
    type: 'Deterministic',
    confidence: '75-90%',
    description: 'Monitors real-time gas prices on Cronos and recommends economically efficient withdrawal limits.',
    howItWorks: 'Fetches gas prices, calculates tx cost (50k gas). High gas (>10 Gwei): 60% limit. Low gas (<5 Gwei): 40% limit. Normal: 50% limit.',
    example: 'Gas at 15 Gwei → Recommends 60% limit: "High gas - recommend larger withdrawals to amortize 0.00075 TCRO cost"',
    useCase: 'Optimizes withdrawal timing and amounts based on network congestion to minimize gas costs.'
  },
  {
    icon: Brain,
    name: 'Portfolio Rebalancer AI',
    type: 'Hybrid AI',
    confidence: 'AI-powered / 60% (fallback)',
    description: 'Uses GPT-4o-mini to analyze portfolio context and recommend intelligent rebalancing limits.',
    howItWorks: 'AI analyzes balance, limits, and risk triggers to propose conservative limits with reasoning. Falls back to 20% rule if AI unavailable.',
    example: '"Based on 50 CRO and volatility spike, recommend 8 CRO (16%) to minimize exposure"',
    useCase: 'Intelligent portfolio rebalancing, DeFi strategy adjustments, AI-powered risk assessment.',
    featured: true
  }
];

const futureAgents = [
  {
    icon: FileText,
    name: 'Compliance Explanation Agent',
    description: 'Human-readable explanations for compliance requirements, regulatory limits, and audit trail generation.',
    features: ['Explain limit rationale', 'Generate compliance reports', 'Track regulatory thresholds', 'Audit documentation']
  },
  {
    icon: TrendingUp,
    name: 'Market Volatility Forecaster',
    description: 'Analyzes market conditions and predicts volatility to adjust risk parameters proactively.',
    features: ['Monitor CRO price movements', 'Detect volatility spikes', 'Adjust limits preemptively', 'Price oracle integration']
  },
];

export default function AIAgents() {
  return (
    <section id="agents" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Brain className="w-4 h-4" />
            Starter Version 1 - Single Usage
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Five Working AI Agents
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advisory agents that monitor, analyze, and recommend safe limits for your vault operations with built-in safety fallbacks.
          </p>
          <p className="text-sm text-cyan-700 font-semibold mt-3">
            Premium SDK includes full feature set with advanced capabilities
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent, index) => {
            const Icon = agent.icon;
            return (
              <div
                key={index}
                className={`rounded-2xl p-8 border-2 transition-all hover:shadow-xl ${
                  agent.featured
                    ? 'bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-500'
                    : 'bg-white border-gray-200 hover:border-cyan-500'
                }`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    agent.featured ? 'bg-cyan-600' : 'bg-gradient-to-br from-cyan-100 to-blue-100'
                  }`}>
                    <Icon className={`w-7 h-7 ${agent.featured ? 'text-white' : 'text-cyan-700'}`} />
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full mb-1">
                      {agent.type}
                    </div>
                    <div className="text-xs text-gray-600">
                      Confidence: {agent.confidence}
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {agent.name}
                </h3>

                <p className="text-gray-700 mb-4 font-medium">
                  {agent.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div>
                    <div className="text-sm font-semibold text-gray-900 mb-1">How it works:</div>
                    <div className="text-sm text-gray-600">{agent.howItWorks}</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 mb-1">Example:</div>
                    <div className="text-sm text-gray-600 italic">{agent.example}</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm font-semibold text-gray-900 mb-1">Use case:</div>
                  <div className="text-sm text-gray-600">{agent.useCase}</div>
                </div>
              </div>
            );
          })}
          
          {futureAgents.map((agent, index) => {
            const Icon = agent.icon;
            return (
              <div key={`future-${index}`} className="bg-gray-50 rounded-2xl p-8 border-2 border-dashed border-gray-300">
                <div className="flex items-start justify-between mb-6">
                  <div className="bg-gray-200 w-14 h-14 rounded-xl flex items-center justify-center">
                    <Icon className="w-7 h-7 text-gray-500" />
                  </div>
                  <div className="text-xs font-semibold text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                    Coming Soon
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {agent.name}
                </h3>
                <p className="text-gray-600 mb-4">{agent.description}</p>
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm font-semibold text-gray-900 mb-2">Planned features:</div>
                  <ul className="space-y-1">
                    {agent.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-gradient-to-r from-slate-900 to-cyan-900 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 text-center">
            Agent Execution Flow
          </h3>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-1">1-6</div>
              <div className="text-cyan-100">Step Process</div>
              <div className="text-xs text-cyan-200 mt-1">Event-Driven • Manual</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-1">100%</div>
              <div className="text-cyan-100">Advisory Only</div>
              <div className="text-xs text-cyan-200 mt-1">Non-Custodial • User Control</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-1">On-Chain</div>
              <div className="text-cyan-100">Recommendations</div>
              <div className="text-xs text-cyan-200 mt-1">BYOC • Custom Contracts</div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-10 mb-6">
            <div className="space-y-1 text-sm text-cyan-100 text-left">
              <p>→ Event occurs (deposit/withdraw) or manual trigger</p>
              <p>→ Agent reads on-chain state (balance, current limit)</p>
              <p>→ Agent analyzes context and decides on new limit</p>
              <p>→ Policy enforcement layer clamps to global maximums</p>
              <p>→ Agent writes recommendation on-chain with reasoning</p>
              <p>→ Frontend displays recommendation to user</p>
            </div>
            <div className="space-y-1 text-sm text-cyan-100 text-left">
              <p>→ Users retain full fund control at all times</p>
              <p>→ No forced actions or automatic withdrawals</p>
              <p>→ Recommendations can be accepted or ignored</p>
              <p>→ Non-custodial architecture ensures security</p>
              <p>→ Users can override any agent suggestion</p>
              <p>→ Complete transparency in decision-making</p>
            </div>
            <div className="space-y-1 text-sm text-cyan-100 text-left">
              <p>→ Smart contract deployment on Cronos</p>
              <p>→ Transparent state storage on blockchain</p>
              <p>→ Immutable recommendation history</p>
              <p>→ Verifiable agent decisions</p>
              <p>→ BYOC: Bring Your Own Contract support</p>
              <p>→ Custom contract creation available</p>
            </div>
          </div>
          <div className="p-4 bg-cyan-800/30 rounded-lg text-center">
            <p className="text-sm">
              <strong>Important:</strong> All agents are advisory only - users retain full control and can withdraw their entire balance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
