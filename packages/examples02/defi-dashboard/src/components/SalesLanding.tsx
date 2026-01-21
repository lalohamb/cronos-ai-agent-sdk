import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, TrendingUp, DollarSign, Cpu, Lock, BarChart3, Rocket } from 'lucide-react';

interface SalesLandingProps {
  onGetStarted: () => void;
}

export const SalesLanding: React.FC<SalesLandingProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative px-6 py-20 text-center"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl"></div>
        
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 max-w-5xl mx-auto"
        >
          <div className="inline-flex items-center space-x-2 bg-purple-500/20 px-4 py-2 rounded-full mb-6 border border-purple-500/30">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium">Production-Ready Automation for Cronos EVM</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            The Automation Layer for Cronos
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Enable payments, DeFi, and treasury workflows to operate autonomously, safely, and at scale.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold text-lg shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-shadow"
            >
              View Live Demo
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-lg font-semibold text-lg hover:border-purple-500/50 transition-colors"
            >
              Schedule Demo Call
            </motion.button>
          </div>
          
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { label: 'Protocol Agnostic', value: '100%' },
              { label: 'Built-in Agents', value: '5+' },
              { label: 'Test Coverage', value: '80%' },
              { label: 'Production Ready', value: '✓' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="bg-slate-800/30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4"
              >
                <div className="text-3xl font-bold text-purple-400">{stat.value}</div>
                <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.section>

      {/* Value Proposition */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Why Teams Choose Cronos AI Agent SDK</h2>
          <p className="text-xl text-slate-400">Infrastructure, not hype. Revenue, not promises.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: 'Built-in Safety',
              description: 'Security limits, audit logs, and policy enforcement out of the box. No need to build guardrails from scratch.',
              color: 'from-green-500 to-emerald-500'
            },
            {
              icon: Cpu,
              title: 'Protocol Agnostic',
              description: 'Works with any EVM smart contract via ABI. Add AI automation to existing protocols in minutes.',
              color: 'from-blue-500 to-cyan-500'
            },
            {
              icon: Rocket,
              title: 'Production Ready',
              description: 'Full TypeScript support, 80%+ test coverage, comprehensive docs. Ship with confidence.',
              color: 'from-purple-500 to-pink-500'
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 hover:border-purple-500/40 transition-all"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="px-6 py-16 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Built-in Agents for Every Use Case</h2>
            <p className="text-xl text-slate-400">5 production-ready agents. Zero AI expertise required.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'RiskMonitor', desc: 'Real-time risk assessment & alerts', icon: Shield },
              { name: 'LiquidityOptimizer', desc: 'Automated liquidity management', icon: TrendingUp },
              { name: 'EmergencyBrake', desc: 'Automatic safety triggers', icon: Lock },
              { name: 'ThresholdGuard', desc: 'Smart limit enforcement', icon: BarChart3 },
              { name: 'AnomalyDetector', desc: 'AI-powered fraud detection', icon: Zap }
            ].map((agent, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-slate-800/30 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <agent.icon className="w-5 h-5 text-purple-400" />
                  <h3 className="font-semibold text-lg">{agent.name}</h3>
                </div>
                <p className="text-slate-400 text-sm">{agent.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-slate-400">Choose the plan that fits your scale</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: 'Starter',
              price: '$199-499',
              period: '/month',
              description: 'Perfect for small teams and MVPs',
              features: [
                'Up to 10K events/month',
                '3 active agents',
                'Basic policy engine',
                'Email support',
                'Audit logs (7 days)'
              ],
              cta: 'Start Free Trial',
              popular: false
            },
            {
              name: 'Growth',
              price: '$1,500-3,000',
              period: '/month',
              description: 'For scaling dApps and protocols',
              features: [
                'Up to 500K events/month',
                'Unlimited agents',
                'Advanced policies',
                'Priority support',
                'Audit logs (90 days)',
                'Custom integrations',
                'SLA guarantee'
              ],
              cta: 'Get Started',
              popular: true
            },
            {
              name: 'Enterprise',
              price: 'Custom',
              period: '',
              description: 'For mission-critical operations',
              features: [
                'Unlimited events',
                'White-label options',
                'Dedicated support',
                'Custom SLA',
                'On-premise deployment',
                'Revenue sharing models',
                'Roadmap input'
              ],
              cta: 'Contact Sales',
              popular: false
            }
          ].map((plan, i) => (
            <motion.div
              key={i}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative bg-slate-800/50 backdrop-blur-sm border rounded-2xl p-8 ${
                plan.popular
                  ? 'border-purple-500 shadow-lg shadow-purple-500/20'
                  : 'border-purple-500/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-slate-400">{plan.period}</span>
              </div>
              <p className="text-slate-400 mb-6">{plan.description}</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start space-x-2">
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                    </div>
                    <span className="text-sm text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-purple-900/30 to-pink-900/30">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Add AI Automation to Your Protocol?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join the teams building the future of autonomous DeFi on Cronos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold text-lg shadow-lg shadow-purple-500/50"
            >
              Try Live Demo
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open('/docs/wiki/index.html', '_blank')}
              className="px-8 py-4 bg-white text-slate-900 rounded-lg font-semibold text-lg hover:bg-slate-100 transition-colors"
            >
              Read Documentation
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

