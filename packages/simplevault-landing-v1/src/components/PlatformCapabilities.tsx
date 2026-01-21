import { LayoutDashboard, Bot, CreditCard, Shield, Zap, BarChart3 } from 'lucide-react';

const capabilities = [
  {
    icon: LayoutDashboard,
    title: 'Unified Dashboard',
    description: 'Monitor service health, AI agent status, and vault operations from a single command center.',
    highlights: ['Real-time metrics', 'Service health monitoring', 'Agent overview', 'Alert management']
  },
  {
    icon: Bot,
    title: 'Agent Console',
    description: 'Execute AI agents, view decision logs, and configure automated workflows with full observability.',
    highlights: ['Agent execution', 'Decision tracking', 'Fee impact analysis', 'Multi-vault support']
  },
  {
    icon: CreditCard,
    title: 'Settlement Console',
    description: 'Streamlined x402 payment workflow with fee-aware, yield-inclusive, and multi-token settlements.',
    highlights: ['x402 integration', 'Fee calculations', 'Yield inclusion', 'Token selection']
  },
  {
    icon: Shield,
    title: 'Security & Compliance',
    description: 'Enterprise-grade security with guardrails, audit trails, and governance controls built-in.',
    highlights: ['Security limits', 'Complete audit logs', 'Governance gates', 'Emergency controls']
  },
  {
    icon: Zap,
    title: 'Real-Time Automation',
    description: 'Autonomous operations with instant execution, live updates, and intelligent decision-making.',
    highlights: ['Instant execution', 'Live yield tracking', 'Auto-compounding', 'Smart routing']
  },
  {
    icon: BarChart3,
    title: 'Analytics & Insights',
    description: 'Deep insights into vault performance, fee collection, yield generation, and governance activity.',
    highlights: ['Performance metrics', 'Fee analytics', 'Yield history', 'Voting analytics']
  }
];

export default function PlatformCapabilities() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-cyan-50 to-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Complete Platform for Autonomous Operations
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to manage vaults, execute agents, and process settlements with full visibility and control.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-cyan-500 transition-all hover:shadow-xl"
              >
                <div className="bg-gradient-to-br from-cyan-100 to-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-cyan-700" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {capability.title}
                </h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {capability.description}
                </p>

                <ul className="space-y-2">
                  {capability.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-cyan-600 rounded-full"></div>
                      {highlight}
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
