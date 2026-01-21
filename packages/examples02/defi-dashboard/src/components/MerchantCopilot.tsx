import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { 
  AlertTriangle, CheckCircle, TrendingUp, TrendingDown, 
  DollarSign, CreditCard, Shield, Zap, Clock, Globe 
} from 'lucide-react';

export const MerchantCopilot: React.FC = () => {
  const [paymentVolume, setPaymentVolume] = useState(284750);
  const [successRate, setSuccessRate] = useState(97.8);
  const [avgSettlement, setAvgSettlement] = useState(2.4);

  // Payment volume trend
  const volumeData = [
    { time: '00:00', volume: 12500, failed: 280 },
    { time: '04:00', volume: 8200, failed: 150 },
    { time: '08:00', volume: 18900, failed: 420 },
    { time: '12:00', volume: 32400, failed: 680 },
    { time: '16:00', volume: 28700, failed: 590 },
    { time: '20:00', volume: 24300, failed: 510 }
  ];

  // Payment method distribution
  const methodData = [
    { name: 'Cronos Pay', value: 45, color: '#8B5CF6' },
    { name: 'Crypto.com', value: 30, color: '#EC4899' },
    { name: 'Direct Wallet', value: 20, color: '#06B6D4' },
    { name: 'Other', value: 5, color: '#64748B' }
  ];

  // AI Insights
  const insights = [
    {
      type: 'optimization',
      icon: TrendingUp,
      title: 'Liquidity Optimization Opportunity',
      description: 'Switch 15% of settlements to off-peak hours to save $1,240/month in gas fees',
      impact: '+$14.9K/year',
      color: 'from-green-500 to-emerald-500'
    },
    {
      type: 'warning',
      icon: AlertTriangle,
      title: 'Elevated Failure Rate Detected',
      description: 'Payment failures increased 12% in the last 2 hours. Likely cause: Network congestion',
      impact: '-$2.3K potential loss',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      type: 'fraud',
      icon: Shield,
      title: 'Anomaly Detected',
      description: '3 transactions flagged for unusual patterns. Auto-held for review',
      impact: 'Risk prevented',
      color: 'from-red-500 to-pink-500'
    }
  ];

  // Failed payment analysis
  const failureReasons = [
    { reason: 'Insufficient gas', count: 142, percentage: 38 },
    { reason: 'Network timeout', count: 98, percentage: 26 },
    { reason: 'Invalid signature', count: 76, percentage: 20 },
    { reason: 'Rate limit', count: 45, percentage: 12 },
    { reason: 'Other', count: 15, percentage: 4 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPaymentVolume(prev => prev + Math.random() * 500);
      setSuccessRate(prev => Math.max(95, Math.min(99, prev + (Math.random() - 0.5) * 0.5)));
      setAvgSettlement(prev => Math.max(1.5, Math.min(4, prev + (Math.random() - 0.5) * 0.2)));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { 
            icon: DollarSign, 
            label: '24h Payment Volume', 
            value: `$${paymentVolume.toLocaleString()}`,
            change: '+12.4%',
            positive: true,
            color: 'from-green-500 to-emerald-500'
          },
          { 
            icon: CheckCircle, 
            label: 'Success Rate', 
            value: `${successRate.toFixed(1)}%`,
            change: '-0.3%',
            positive: false,
            color: 'from-blue-500 to-cyan-500'
          },
          { 
            icon: Clock, 
            label: 'Avg Settlement Time', 
            value: `${avgSettlement.toFixed(1)}h`,
            change: '-8.2%',
            positive: true,
            color: 'from-purple-500 to-pink-500'
          },
          { 
            icon: Globe, 
            label: 'Active Regions', 
            value: '47',
            change: '+3',
            positive: true,
            color: 'from-orange-500 to-red-500'
          }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                {stat.positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{stat.change}</span>
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-slate-400 text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* AI Insights */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <Zap className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-semibold">AI-Powered Insights</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {insights.map((insight, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-5 hover:border-purple-500/30 transition-all"
            >
              <div className={`w-10 h-10 bg-gradient-to-r ${insight.color} rounded-lg flex items-center justify-center mb-4`}>
                <insight.icon className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-semibold mb-2">{insight.title}</h4>
              <p className="text-sm text-slate-400 mb-3">{insight.description}</p>
              <div className="text-sm font-semibold text-purple-400">{insight.impact}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Payment Analytics */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Volume Trend */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold mb-6">Payment Volume Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={volumeData}>
                <defs>
                  <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #8B5CF6', borderRadius: '8px' }}
                />
                <Line
                  type="monotone"
                  dataKey="volume"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold mb-6">Payment Method Distribution</h3>
          <div className="flex items-center justify-center h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={methodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {methodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #8B5CF6', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {methodData.map((method, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: method.color }}></div>
                <span className="text-sm text-slate-300">{method.name}</span>
                <span className="text-sm text-slate-400">{method.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Failed Payment Analysis */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Failed Payment Analysis</h3>
          <div className="text-sm text-slate-400">Last 24 hours</div>
        </div>
        <div className="space-y-4">
          {failureReasons.map((failure, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                  <span className="font-medium">{failure.reason}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-slate-400">{failure.count} failures</span>
                  <span className="font-semibold w-12 text-right">{failure.percentage}%</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${failure.percentage}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Recommendation */}
        <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">AI Recommendation</h4>
              <p className="text-sm text-slate-300">
                Implement automatic gas price adjustment to reduce "Insufficient gas" failures by ~60%.
                Estimated recovery: <span className="text-green-400 font-semibold">$3,200/month</span>
              </p>
              <button className="mt-3 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-sm font-medium transition-colors">
                Enable Auto-Optimization
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Liquidity Forecast */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Liquidity Forecast (Next 7 Days)</h3>
          <div className="flex items-center space-x-2 text-green-400 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Healthy</span>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-2">Current Balance</div>
            <div className="text-2xl font-bold text-green-400">$127,450</div>
            <div className="text-xs text-slate-500 mt-1">Across 3 chains</div>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-2">Projected Outflow</div>
            <div className="text-2xl font-bold text-orange-400">$89,200</div>
            <div className="text-xs text-slate-500 mt-1">Settlements + fees</div>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-2">Recommended Top-up</div>
            <div className="text-2xl font-bold text-purple-400">$25,000</div>
            <div className="text-xs text-slate-500 mt-1">By Dec 22, 2025</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

