import { Check, ArrowRight } from 'lucide-react';

const tiers = [
  {
    name: 'Starter',
    price: '$,00',
    period: '/month',
    description: 'Perfect for small teams getting started with AI automation',
    features: [
      'Up to 10,000 monitored events/month',
      '3 hosted AI agents',
      'Basic security limits',
      'Email support',
      'Audit logs (30 days)',
      'API access'
    ],
    cta: 'Start Free Pilot',
    popular: false
  },
  {
    name: 'Growth',
    price: '$,00',
    period: '/month',
    description: 'For growing teams scaling their operations',
    features: [
      'Up to 100,000 monitored events/month',
      '10 hosted AI agents',
      'Advanced security guardrails',
      'Priority support',
      'Audit logs (90 days)',
      'Advanced policy engine',
      'Custom integrations',
      'SLA included'
    ],
    cta: 'Start Free Pilot',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For organizations requiring maximum scale and control',
    features: [
      'Unlimited monitored events',
      'Unlimited hosted agents',
      'Enterprise security controls',
      'Dedicated support team',
      'Unlimited audit logs',
      'White-label options',
      'Custom SLA',
      'Roadmap influence',
      'On-premise deployment available'
    ],
    cta: 'Contact Sales',
    popular: false
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-cyan-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start with a free 30-day pilot, then choose the plan that scales with your business.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-8 ${
                tier.popular
                  ? 'border-4 border-cyan-600 shadow-2xl relative scale-105'
                  : 'border-2 border-gray-200 shadow-lg'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-5xl font-bold text-gray-900">{tier.price}</span>
                  <span className="text-gray-600 ml-2">{tier.period}</span>
                </div>
                <p className="text-gray-600">{tier.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all ${
                  tier.popular
                    ? 'bg-cyan-600 text-white hover:bg-cyan-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {tier.cta}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-2xl p-8 max-w-4xl mx-auto border-2 border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Additional Revenue Models</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="font-semibold text-gray-900 mb-2">Transaction Fees</div>
              <div className="text-gray-600">5-30 basis points per automated transaction or $0.05-$0.50 per operation</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900 mb-2">White-Label Partnership</div>
              <div className="text-gray-600">5-20% revenue share with minimum monthly guarantees</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900 mb-2">Premium SDK License</div>
              <div className="text-gray-600">$10k-$50k annual license with full agent toolset and all vault features</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900 mb-2">Merchant Copilot</div>
              <div className="text-gray-600">$99-$299/month per merchant or volume-based enterprise pricing</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
