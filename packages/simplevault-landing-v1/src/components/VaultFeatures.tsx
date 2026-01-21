import { Vault, Percent, TrendingUp, Coins, Vote } from 'lucide-react';

const vaults = [
  {
    icon: Vault,
    name: 'Base Vault',
    tagline: 'Foundation for Smart Treasury',
    description: 'Secure deposit and withdrawal operations with AI-powered monitoring and automated agent execution.',
    features: ['Secure deposits/withdrawals', 'AI agent integration', 'Real-time monitoring', 'Audit trail']
  },
  {
    icon: Percent,
    name: 'Fee Vault',
    tagline: 'Revenue-Optimized Operations',
    description: 'Configurable fee mechanisms with real-time calculators showing net amounts after deposit and withdrawal fees.',
    features: ['Adjustable fee rates (0-10%)', 'Real-time fee calculator', 'Fee collection tracking', 'Owner controls']
  },
  {
    icon: TrendingUp,
    name: 'Yield Vault',
    tagline: 'Automated Earnings Growth',
    description: 'Live yield accrual with APY tracking, compound options, and earnings history visualization.',
    features: ['Real-time APY display', 'Auto-compound yield', 'Earnings history', 'Yield calculator']
  },
  {
    icon: Coins,
    name: 'Multi-Token Vault',
    tagline: 'Diversified Asset Management',
    description: 'Manage multiple tokens (CRO, USDC, USDT) with portfolio visualization and per-token AI recommendations.',
    features: ['Multi-token support', 'Portfolio dashboard', 'USD value tracking', 'Token-specific AI agents']
  },
  {
    icon: Vote,
    name: 'Governance Vault',
    tagline: 'Decentralized Decision Making',
    description: 'On-chain governance with proposal creation, voting mechanisms, and emergency controls for DAO operations.',
    features: ['Proposal system', 'Voting power tracking', 'Emergency pause', 'Quorum management']
  }
];

export default function VaultFeatures() {
  return (
    <section id="vaults" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Five Vault Types, Infinite Possibilities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From basic treasury operations to advanced governance, our vault system adapts to your needs with enterprise-grade security and AI automation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vaults.map((vault, index) => {
            const Icon = vault.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-slate-50 to-cyan-50 rounded-2xl p-8 border-2 border-gray-200 hover:border-cyan-500 transition-all hover:shadow-xl"
              >
                <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-md">
                  <Icon className="w-7 h-7 text-cyan-600" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {vault.name}
                </h3>
                <p className="text-cyan-600 font-semibold mb-4">
                  {vault.tagline}
                </p>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {vault.description}
                </p>

                <ul className="space-y-2">
                  {vault.features.map((feature, idx) => (
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

        <div className="mt-16 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-12 text-white">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-6 text-center">
              Complete Vault Ecosystem
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">5</div>
                <div className="text-cyan-100">Specialized Vault Types</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-cyan-100">AI-Powered Monitoring</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2"></div>
                <div className="text-cyan-100">On-Chain Transparency</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
