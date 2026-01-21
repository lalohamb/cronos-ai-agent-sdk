import { ShieldCheck, Droplets, AlertOctagon, Gauge, Search, FileCode, Radio, Scale, Brain, CreditCard, Server, ClipboardCheck, Bot, Coins, Code, LineChart, Network, Shield } from 'lucide-react';

// 5 Built-in Agents
const builtInAgents = [
  {
    icon: ShieldCheck,
    title: 'RiskMonitor',
    description: 'Monitors risk metrics and recommends protective actions. Analyzes balance vs threshold to determine transaction safety.',
    features: ['Balance monitoring', 'Threshold analysis', 'Risk scoring', 'ALLOW/LIMIT/BLOCK decisions'],
    highlight: 'Deterministic'
  },
  {
    icon: Droplets,
    title: 'LiquidityOptimizer',
    description: 'Optimizes liquidity allocation based on market conditions. Automatically rebalances pools for optimal performance.',
    features: ['Pool analysis', 'Utilization optimization', 'Auto-rebalancing', 'ADD/REMOVE/HOLD actions'],
    highlight: 'Deterministic'
  },
  {
    icon: AlertOctagon,
    title: 'EmergencyBrake',
    description: 'Triggers emergency stops when critical thresholds are breached. Protects protocols from catastrophic losses.',
    features: ['Critical monitoring', 'Instant response', 'Protocol protection', 'PAUSE/RESUME control'],
    highlight: 'Deterministic'
  },
  {
    icon: Gauge,
    title: 'ThresholdGuard',
    description: 'Enforces minimum and maximum limits on operations. Validates transactions against configurable boundaries.',
    features: ['Min/max validation', 'Configurable limits', 'Boundary enforcement', 'APPROVE/REJECT decisions'],
    highlight: 'Deterministic'
  },
  {
    icon: Search,
    title: 'AnomalyDetector',
    description: 'Detects unusual patterns using statistical analysis. Identifies suspicious behavior through standard deviation calculations.',
    features: ['Statistical analysis', 'Pattern detection', 'Z-score calculation', 'NORMAL/ANOMALY detection'],
    highlight: 'Statistical'
  }
];

// Core Infrastructure Components (alphabetical)
const coreComponents = [
  {
    icon: Bot,
    title: 'Agents',
    description: 'Agent system with BaseAgent class and AgentRegistry for managing intelligent automation.',
    highlight: 'agents/'
  },
  {
    icon: Brain,
    title: 'AI',
    description: 'OpenAI provider integration for AI-enhanced decision making and intelligent automation.',
    highlight: 'ai/'
  },
  {
    icon: Server,
    title: 'API',
    description: 'HTTP API server with Express adapter for exposing SDK functionality via REST endpoints.',
    highlight: 'api/'
  },
  {
    icon: ClipboardCheck,
    title: 'Audit',
    description: 'Comprehensive audit trail support with decision recording and compliance tracking.',
    highlight: 'audit/'
  },
  {
    icon: FileCode,
    title: 'Contracts',
    description: 'Smart contract management with ContractRegistry and ContractAdapter for blockchain integration.',
    highlight: 'contracts/'
  },
  {
    icon: Gauge,
    title: 'Control Plane',
    description: 'Enterprise control plane for runtime identification, telemetry, and centralized management.',
    highlight: 'control-plane/'
  },
  {
    icon: Radio,
    title: 'Events',
    description: 'Real-time blockchain event listening and handling with EventListener for reactive automation.',
    highlight: 'events/'
  },
  {
    icon: CreditCard,
    title: 'Payments',
    description: 'Multi-provider payment processing with usage tracking and mobile wallet support.',
    highlight: 'payments/'
  },
  {
    icon: Scale,
    title: 'Policies',
    description: 'PolicyEngine for rule enforcement and decision validation against configurable rules.',
    highlight: 'policies/'
  },
  {
    icon: Shield,
    title: 'Policy Pack',
    description: 'Advanced enterprise policy bundles with verifier support for complex rule sets.',
    highlight: 'policy-pack/'
  },
  {
    icon: Code,
    title: 'Utils',
    description: 'Utility functions including logging, hashing, and stable JSON stringification.',
    highlight: 'utils/'
  },
  {
    icon: Network,
    title: 'Webhooks',
    description: 'Webhook handler for receiving and processing external blockchain events and notifications.',
    highlight: 'api/webhooks'
  }
];

// Enterprise Features
const enterpriseFeatures = [
  {
    icon: Bot,
    title: 'Agent-as-a-Service',
    description: 'Hosted AI agents that monitor Cronos contracts, automate payments, and provide AI copilots for merchants and dApp operators.',
    features: [
      'Security limits & guardrails',
      'Complete observability',
      'Audit logs included',
      'Managed infrastructure'
    ],
    highlight: 'Fastest to Revenue'
  },
  {
    icon: Coins,
    title: 'Transaction & Automation Fees',
    description: 'AI-driven automation that executes on-chain actions, optimizes swaps, and auto-manages treasury with protocol-level fee capture.',
    features: [
      'No upfront cost',
      'Pay per action',
      'Protocol-level integration',
      'Value-aligned incentives'
    ],
    highlight: 'Zero Upfront Cost'
  },
  {
    icon: Code,
    title: 'Premium SDK & Licenses',
    description: 'Commercial license for Crypto.com AI Agent SDK extensions with guardrailed templates and advanced policy engines.',
    features: [
      'Legal clarity',
      'Security assurances',
      'SLA commitments',
      'Roadmap input'
    ],
    highlight: 'Enterprise Ready'
  },
  {
    icon: LineChart,
    title: 'Merchant AI Ops Copilot',
    description: 'AI dashboard that explains failed payments, optimizes settlement routing, forecasts liquidity impact, and flags fraud early.',
    features: [
      'Business intelligence',
      'Payment optimization',
      'Fraud detection',
      'FX impact forecasting'
    ],
    highlight: 'High Margin'
  },
  {
    icon: Network,
    title: 'White-Label & Partnerships',
    description: 'Your platform as a white-labeled AI automation layer embedded inside wallets, PSPs, or Cronos-native SaaS.',
    features: [
      'Revenue share model',
      'Custom branding',
      'Integration support',
      'Speed to market'
    ],
    highlight: 'Strategic Partnerships'
  }
];

export default function Solutions() {
  return (
    <section id="solutions" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Built-in Agents Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            5 Built-in AI Agents
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Production-ready agents from <code className="bg-gray-100 px-2 py-1 rounded text-cyan-600">@cronos/ai-agent-sdk</code> for intelligent blockchain automation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {builtInAgents.map((agent, index) => {
            const Icon = agent.icon;
            return (
              <div
                key={index}
                className="group bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-cyan-500 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="bg-cyan-100 p-3 rounded-xl group-hover:bg-cyan-600 transition-colors">
                    <Icon className="w-7 h-7 text-cyan-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    agent.highlight === 'Statistical'
                      ? 'text-purple-600 bg-purple-50'
                      : 'text-cyan-600 bg-cyan-50'
                  }`}>
                    {agent.highlight}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {agent.title}
                </h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {agent.description}
                </p>

                <ul className="space-y-2">
                  {agent.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-cyan-600 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Core Infrastructure Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Core Infrastructure
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Modular components powering the SDK's blockchain integration, policy enforcement, and enterprise features.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreComponents.map((component, index) => {
            const Icon = component.icon;
            return (
              <div
                key={index}
                className="group bg-gradient-to-br from-slate-50 to-cyan-50 border-2 border-gray-200 rounded-xl p-6 hover:border-cyan-500 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white p-2 rounded-lg shadow-sm group-hover:bg-cyan-600 transition-colors">
                    <Icon className="w-5 h-5 text-cyan-600 group-hover:text-white transition-colors" />
                  </div>
                  <code className="text-xs font-mono text-gray-500 bg-white px-2 py-1 rounded">
                    {component.highlight}
                  </code>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {component.title}
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {component.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Enterprise Features Section */}
        <div className="text-center mb-16 mt-24">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Enterprise Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Multiple revenue streams designed for immediate post-launch capture, not vague future potential.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {enterpriseFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-cyan-500 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="bg-cyan-100 p-3 rounded-xl group-hover:bg-cyan-600 transition-colors">
                    <Icon className="w-7 h-7 text-cyan-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-xs font-semibold text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full">
                    {feature.highlight}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                <ul className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-cyan-600 rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
