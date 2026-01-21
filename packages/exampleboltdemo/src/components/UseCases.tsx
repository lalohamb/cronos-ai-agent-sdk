import { Building2, Wallet, TrendingUp, Shield } from 'lucide-react';

const useCases = [
  {
    icon: Building2,
    title: 'dApp Teams',
    description: 'Automate contract monitoring, payment processing, and operational workflows without managing infrastructure.',
    benefits: [
      'Reduce operational overhead',
      'Automated treasury management',
      'Real-time contract monitoring',
      'Instant payment execution'
    ]
  },
  {
    icon: TrendingUp,
    title: 'DeFi Protocols',
    description: 'Optimize swaps, routing, and settlements with AI-driven automation and intelligent liquidity management.',
    benefits: [
      'Optimized swap routing',
      'Automated yield strategies',
      'Liquidity pool management',
      'Risk mitigation'
    ]
  },
  {
    icon: Wallet,
    title: 'Merchants & PSPs',
    description: 'Gain visibility into payment failures, optimize settlement routes, and forecast liquidity with AI-powered insights.',
    benefits: [
      'Payment failure analysis',
      'Settlement optimization',
      'FX impact forecasting',
      'Early fraud detection'
    ]
  },
  {
    icon: Shield,
    title: 'DAO Treasuries',
    description: 'Autonomous treasury operations with built-in security guardrails, audit trails, and compliance reporting.',
    benefits: [
      'Automated treasury ops',
      'Complete audit trails',
      'Security guardrails',
      'Compliance reporting'
    ]
  }
];

export default function UseCases() {
  return (
    <section id="use-cases" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Built for Your Workflow
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're running a dApp, DeFi protocol, or processing payments, our AI automation layer fits seamlessly into your operations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-slate-50 to-cyan-50 rounded-2xl p-8 border-2 border-gray-200 hover:border-cyan-500 transition-all"
              >
                <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-md">
                  <Icon className="w-7 h-7 text-cyan-600" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {useCase.title}
                </h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {useCase.description}
                </p>

                <div className="space-y-3">
                  {useCase.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-cyan-600 rounded-full"></div>
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            Why Teams Choose Our Platform
          </h3>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div>
              <div className="text-4xl font-bold mb-2">10x</div>
              <div className="text-cyan-100">Faster deployment vs building in-house</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-cyan-100">Autonomous operations without human intervention</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-cyan-100">Audit trail for compliance & governance</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
