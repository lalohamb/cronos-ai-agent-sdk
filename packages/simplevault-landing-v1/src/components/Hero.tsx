import { ArrowRight, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-cyan-50 to-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            Production-Grade Automation for Cronos
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            The AI Automation Layer for{' '}
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Cronos
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
            Five specialized vault types with deterministic and AI-powered automation for payments, DeFi, and treasury operations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#contact"
              className="group bg-cyan-600 text-white px-8 py-4 rounded-lg hover:bg-cyan-700 transition-all font-semibold text-lg flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              Start Free Pilot
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#vaults"
              className="bg-white text-gray-900 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg border-2 border-gray-200"
            >
              Explore Vaults
            </a>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-gray-900">5 Vaults</div>
              <div className="text-sm text-gray-600 mt-1">Specialized Types</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">0-10%</div>
              <div className="text-sm text-gray-600 mt-1">Configurable Fees</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600 mt-1">AI Monitoring</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">Multi-Token</div>
              <div className="text-sm text-gray-600 mt-1">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
