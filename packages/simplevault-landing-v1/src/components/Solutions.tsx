import { Bot, Coins, Code, LineChart, Network } from 'lucide-react';

const solutions = [
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
    pricing: 'Starting at $199/mo',
    highlight: 'Fastest to Revenue'
  },
  {
    icon: Coins,
    title: 'Transaction & Automation Fees',
    description: 'AI-driven automation that executes on-chain actions, optimizes swaps, and auto-manages treasury with protocol-level fee capture.',
    features: [
      'No upfront cost',
      'Pay per action',
      '5-30 bps per transaction',
      'Value-aligned incentives'
    ],
    pricing: '$0.05-$0.50 per action',
    highlight: 'Zero Upfront Cost'
  },
  {
    icon: Code,
    title: 'Premium SDK & Licenses',
    description: 'Commercial license for full-featured AI Agent SDK with all capabilities, guardrailed templates, and advanced policy engines.',
    features: [
      'Complete agent toolset',
      'All vault features',
      'Legal clarity',
      'Security assurances',
      'SLA commitments',
      'Roadmap input'
    ],
    pricing: '$10k-$100k+ annually',
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
    pricing: '$99-$299/mo per merchant',
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
    pricing: '5-20% revenue share',
    highlight: 'Strategic Partnerships'
  }
];

export default function Solutions() {
  return (
    <section id="solutions" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Five Monetization Pillars
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Multiple revenue streams designed for immediate post-launch capture, not vague future potential.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
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
                    {solution.highlight}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {solution.title}
                </h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {solution.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {solution.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-cyan-600 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-500 mb-1">Starting at</div>
                  <div className="text-xl font-bold text-gray-900">{solution.pricing}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
