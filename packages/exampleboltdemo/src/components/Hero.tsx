import { ArrowRight, Zap, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
// import { SentinelAgentSDK } from '@sentinel/ai-agent-sdk';

interface HeroProps {
  sdk: any;
  isReady: boolean;
}

export default function Hero({ sdk, isReady }: HeroProps) {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-cyan-50 to-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            Production-Grade AI Automation for Cronos
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            The AI Automation Layer for{' '}
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Cronos
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
            Enable payments, DeFi, and treasury workflows to operate autonomously, safely, and at scale.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/dashboard"
              className="group bg-cyan-600 text-white px-8 py-4 rounded-lg hover:bg-cyan-700 transition-all font-semibold text-lg flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Activity className="w-5 h-5" />
              Live Agent Demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#solutions"
              className="bg-white text-gray-900 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg border-2 border-gray-200"
            >
              View Solutions
            </a>
          </div>

          {/* SDK Status */}
          <div className="mt-8 flex justify-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              isReady 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isReady ? 'bg-green-500' : 'bg-yellow-500'
              }`}></div>
              {isReady ? 'SDK Ready - 5 Agents Active' : 'SDK Initializing...'}
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-gray-900">$75k+</div>
              <div className="text-sm text-gray-600 mt-1">Target MRR</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">5-30 bps</div>
              <div className="text-sm text-gray-600 mt-1">Transaction Fees</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600 mt-1">Autonomous Ops</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">Enterprise</div>
              <div className="text-sm text-gray-600 mt-1">Grade Security</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
