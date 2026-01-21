import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { DollarSign, TrendingUp, Users, Zap, Activity, CreditCard, Shield, AlertCircle } from 'lucide-react';

export const CommercialDashboard: React.FC = () => {
  const [mrr, setMrr] = useState(47500);
  const [activeCustomers, setActiveCustomers] = useState(23);
  const [transactionFees, setTransactionFees] = useState(8420);
  const [agentExecutions, setAgentExecutions] = useState(156789);

  // Revenue data
  const revenueData = [
    { month: 'Jul', aaas: 12000, txFees: 2100, licenses: 5000 },
    { month: 'Aug', aaas: 18500, txFees: 3400, licenses: 10000 },
    { month: 'Sep', aaas: 25000, txFees: 5200, licenses: 15000 },
    { month: 'Oct', aaas: 32000, txFees: 6800, licenses: 20000 },
    { month: 'Nov', aaas: 40000, txFees: 7500, licenses: 25000 },
    { month: 'Dec', aaas: 47500, txFees: 8420, licenses: 30000 }
  ];

  // Customer tier distribution
  const tierData = [
    { tier: 'Starter', count: 15, revenue: 4485 },
    { tier: 'Growth', count: 6, revenue: 13500 },
    { tier: 'Enterprise', count: 2, revenue: 29515 }
  ];

  // Agent usage metrics
  const agentUsageData = [
    { agent: 'RiskMonitor', executions: 45230, revenue: 2261 },
    { agent: 'LiquidityOptimizer', executions: 38450, revenue: 1923 },
    { agent: 'EmergencyBrake', executions: 28340, revenue: 1417 },
    { agent: 'ThresholdGuard', executions: 25890, revenue: 1295 },
    { agent: 'AnomalyDetector', executions: 18879, revenue: 944 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMrr(prev => prev + Math.random() * 100);
      setTransactionFees(prev => prev + Math.random() * 10);
      setAgentExecutions(prev => prev + Math.floor(Math.random() * 50));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const MetricCard = ({ icon: Icon, label, value, change, color }: any) => (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ y: -5 }}
      className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div className="flex items-center space-x-1 text-green-400 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+{change}%</span>
          </div>
        )}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-slate-400 text-sm">{label}</div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={DollarSign}
          label="Monthly Recurring Revenue"
          value={`$${mrr.toLocaleString()}`}
          change={28}
          color="from-green-500 to-emerald-500"
        />
        <MetricCard
          icon={Users}
          label="Active Customers"
          value={activeCustomers}
          change={15}
          color="from-blue-500 to-cyan-500"
        />
        <MetricCard
          icon={CreditCard}
          label="Transaction Fees (MTD)"
          value={`$${transactionFees.toLocaleString()}`}
          change={42}
          color="from-purple-500 to-pink-500"
        />
        <MetricCard
          icon={Zap}
          label="Agent Executions"
          value={agentExecutions.toLocaleString()}
          change={67}
          color="from-orange-500 to-red-500"
        />
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Revenue Breakdown</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span className="text-slate-400">AaaS</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-pink-500 rounded"></div>
              <span className="text-slate-400">Tx Fees</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-cyan-500 rounded"></div>
              <span className="text-slate-400">Licenses</span>
            </div>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="aaas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="txFees" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EC4899" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#EC4899" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="licenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #8B5CF6', borderRadius: '8px' }}
              />
              <Area type="monotone" dataKey="aaas" stackId="1" stroke="#8B5CF6" fill="url(#aaas)" />
              <Area type="monotone" dataKey="txFees" stackId="1" stroke="#EC4899" fill="url(#txFees)" />
              <Area type="monotone" dataKey="licenses" stackId="1" stroke="#06B6D4" fill="url(#licenses)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Customer Tiers & Agent Usage */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Customer Tier Distribution */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold mb-6">Customer Tier Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tierData}>
                <XAxis dataKey="tier" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #8B5CF6', borderRadius: '8px' }}
                />
                <Bar dataKey="revenue" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
            {tierData.map((tier, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-slate-300">{tier.tier}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-slate-400">{tier.count} customers</span>
                  <span className="font-semibold">${tier.revenue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Agent Usage & Revenue */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold mb-6">Agent Performance</h3>
          <div className="space-y-4">
            {agentUsageData.map((agent, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-purple-400" />
                    <span className="font-medium">{agent.agent}</span>
                  </div>
                  <span className="text-slate-400">${agent.revenue.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(agent.executions / 50000) * 100}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    />
                  </div>
                  <span className="text-xs text-slate-400 w-16 text-right">
                    {agent.executions.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <Activity className="w-6 h-6 text-green-400" />
          <h3 className="text-xl font-semibold">Live Revenue Events</h3>
        </div>
        <div className="space-y-3">
          {[
            { customer: 'Acme DeFi Protocol', event: 'Growth plan renewal', amount: 2500, time: '2m ago' },
            { customer: 'CryptoVault DAO', event: 'Transaction fees', amount: 127, time: '5m ago' },
            { customer: 'LiquidSwap', event: 'Enterprise upgrade', amount: 15000, time: '12m ago' },
            { customer: 'SafeYield Finance', event: 'Agent execution fees', amount: 89, time: '18m ago' }
          ].map((event, i) => (
            <motion.div
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:border-purple-500/30 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">{event.customer}</div>
                  <div className="text-sm text-slate-400">{event.event}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-green-400">+${event.amount.toLocaleString()}</div>
                <div className="text-xs text-slate-400">{event.time}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

