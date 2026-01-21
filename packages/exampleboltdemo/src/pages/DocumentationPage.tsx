import { BookOpen, ExternalLink, FileText, Code2, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

const resources = [
  {
    icon: BookOpen,
    title: 'Interactive Wiki',
    description: 'Complete walkthrough of the Cronos AI Agent SDK with live examples, architecture diagrams, and step-by-step tutorials.',
    link: '/docs/wiki/index.html',
    external: true,
    highlight: 'Start Here'
  },
  {
    icon: FileText,
    title: 'Getting Started Guide',
    description: 'Quick start guide to install the SDK, register your first agent, and execute automated decisions.',
    link: '/user-stories',
    external: false,
    highlight: 'Beginner Friendly'
  },
  {
    icon: Code2,
    title: 'Technical Stories',
    description: 'Real-world implementation examples across DeFi, NFTs, gaming, and stablecoins with complete code samples.',
    link: '/user-stories',
    external: false,
    highlight: 'Code Examples'
  },
  {
    icon: Zap,
    title: 'Built-in Agents',
    description: 'Documentation for all 5 built-in agents: RiskMonitor, LiquidityOptimizer, EmergencyBrake, ThresholdGuard, and AnomalyDetector.',
    link: '/dashboard',
    external: false,
    highlight: '5 Agents'
  },
  {
    icon: Shield,
    title: 'UI Components',
    description: 'Reference for Dashboard, AgentConsole, EventMonitor, ContractRegistry, and PolicyManager React components.',
    link: '/#solutions',
    external: false,
    highlight: 'React Ready'
  }
];

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="bg-gradient-to-br from-slate-50 via-cyan-50 to-slate-50 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Documentation
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl">
            Everything you need to build intelligent, autonomous systems with the Cronos AI Agent SDK.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Wiki Demo Highlight */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-8 md:p-12 text-white mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-bold mb-4">📚 Interactive Wiki Demo</h2>
              <p className="text-cyan-100 text-lg max-w-2xl">
                Explore our comprehensive interactive wiki with detailed architecture diagrams, 
                code examples, and step-by-step tutorials. Perfect for beginners and advanced developers alike.
              </p>
            </div>
            <a
              href="/docs/wiki/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white text-cyan-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-cyan-50 transition-colors whitespace-nowrap"
            >
              Open Wiki Demo
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Resource Cards */}
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Resources</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            const content = (
              <div className="group bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-cyan-500 hover:shadow-lg transition-all duration-300 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-cyan-100 p-3 rounded-xl group-hover:bg-cyan-600 transition-colors">
                    <Icon className="w-6 h-6 text-cyan-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-xs font-semibold text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full">
                    {resource.highlight}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  {resource.title}
                  {resource.external && <ExternalLink className="w-4 h-4 text-gray-400" />}
                </h3>
                <p className="text-gray-600 leading-relaxed">{resource.description}</p>
              </div>
            );

            if (resource.external) {
              return (
                <a key={index} href={resource.link} target="_blank" rel="noopener noreferrer">
                  {content}
                </a>
              );
            }
            return (
              <Link key={index} to={resource.link}>
                {content}
              </Link>
            );
          })}
        </div>

        {/* Quick Links */}
        <div className="mt-16 bg-gradient-to-br from-slate-50 to-cyan-50 rounded-2xl p-8 border-2 border-cyan-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Links</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href="https://github.com/AizelNetwork/cronos-ai-agent-sdk"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-700 hover:text-cyan-600 transition-colors"
            >
              <div className="w-2 h-2 bg-cyan-600 rounded-full"></div>
              GitHub Repository
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="https://www.npmjs.com/package/@cronos/ai-agent-sdk"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-700 hover:text-cyan-600 transition-colors"
            >
              <div className="w-2 h-2 bg-cyan-600 rounded-full"></div>
              NPM Package
              <ExternalLink className="w-4 h-4" />
            </a>
            <Link
              to="/dashboard"
              className="flex items-center gap-3 text-gray-700 hover:text-cyan-600 transition-colors"
            >
              <div className="w-2 h-2 bg-cyan-600 rounded-full"></div>
              Live Agent Dashboard
            </Link>
            <Link
              to="/user-stories"
              className="flex items-center gap-3 text-gray-700 hover:text-cyan-600 transition-colors"
            >
              <div className="w-2 h-2 bg-cyan-600 rounded-full"></div>
              Technical User Stories
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

