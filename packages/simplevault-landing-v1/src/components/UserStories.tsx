import { Quote, TrendingUp, DollarSign, Clock, Users, Zap, ArrowRight, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const stories = [
  {
    role: 'DeFi Protocol CTO',
    challenge: 'Automating liquidity pool monitoring and rebalancing',
    impact: 'saving 20 hrs/week and improving efficiency by 35%',
    icon: TrendingUp,
    metrics: [
      { label: 'Time Saved', value: '20 hrs/week' },
      { label: 'Efficiency Gain', value: '+35%' }
    ]
  },
  {
    role: 'E-commerce Head of Payments',
    challenge: 'Using AI dashboard to reduce payment failures',
    impact: 'from 12% to 4%, recovering $45k monthly',
    icon: DollarSign,
    metrics: [
      { label: 'Failure Rate', value: '12% → 4%' },
      { label: 'Monthly Recovery', value: '$45k' }
    ]
  },
  {
    role: 'DAO Treasury Manager',
    challenge: 'Deploying autonomous agents for $12M treasury',
    impact: 'reducing governance overhead by 70%',
    icon: Users,
    metrics: [
      { label: 'Treasury Size', value: '$12M' },
      { label: 'Overhead Reduced', value: '-70%' }
    ]
  },
  {
    role: 'Wallet Provider Product Lead',
    challenge: 'White-labeling the SDK to ship AI features',
    impact: 'in 6 weeks instead of 12 months, increasing user engagement by 40%',
    icon: Zap,
    metrics: [
      { label: 'Time to Market', value: '6 weeks' },
      { label: 'Engagement', value: '+40%' }
    ]
  },
  {
    role: 'Payment Gateway Engineering Lead',
    challenge: 'Using Premium SDK to deploy merchant automation',
    impact: 'in 8 weeks, saving clients 2.3% on settlement costs',
    icon: Clock,
    metrics: [
      { label: 'Deployment Time', value: '8 weeks' },
      { label: 'Cost Savings', value: '2.3%' }
    ]
  }
];

export default function UserStories() {
  return (
    <section id="user-stories" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-cyan-50 to-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Real Impact from Real Teams
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how leading teams across DeFi, payments, and treasury management are transforming their operations with our AI automation platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, index) => {
            const Icon = story.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-cyan-500 transition-all hover:shadow-xl"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="bg-gradient-to-br from-cyan-100 to-blue-100 w-12 h-12 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-cyan-700" />
                  </div>
                  <Quote className="w-8 h-8 text-cyan-200" />
                </div>

                <h3 className="text-lg font-bold text-cyan-700 mb-4">
                  {story.role}
                </h3>

                <p className="text-gray-700 mb-4 leading-relaxed">
                  {story.challenge} <span className="font-semibold text-gray-900">{story.impact}</span>
                </p>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t-2 border-gray-100">
                  {story.metrics.map((metric, idx) => (
                    <div key={idx}>
                      <div className="text-2xl font-bold text-gray-900">
                        {metric.value}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-white rounded-2xl p-10 border-2 border-cyan-200 shadow-lg">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Join teams achieving measurable results
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              From reducing operational overhead to recovering lost revenue, our platform delivers tangible impact across every use case.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-cyan-600 text-white px-8 py-4 rounded-lg hover:bg-cyan-700 transition-all font-semibold shadow-lg hover:shadow-xl"
              >
                Start Your Success Story
                <ArrowRight className="w-5 h-5" />
              </a>
              <Link
                to="/user-stories"
                className="inline-flex items-center gap-2 bg-white text-cyan-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-all font-semibold border-2 border-cyan-600"
              >
                <Code2 className="w-5 h-5" />
                View Technical Stories
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
