import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';
import { Shield, TrendingUp, AlertTriangle, Zap, Activity, DollarSign, Store, ArrowLeft } from 'lucide-react';
import { SalesLanding } from './components/SalesLanding';
import { CommercialDashboard } from './components/CommercialDashboard';
import { MerchantCopilot } from './components/MerchantCopilot';
// import { SentinelAgentSDK, RiskMonitor, LiquidityOptimizer, EmergencyBrake } from '@sentinel/ai-agent-sdk';

type ViewMode = 'landing' | 'defi' | 'commercial' | 'merchant';

const App = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [riskLevel, setRiskLevel] = useState(0.3);
  const [totalValue, setTotalValue] = useState(125000);
  const [agentActivity, setAgentActivity] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Mock data for charts
  const portfolioData = [
    { time: '00:00', value: 120000, risk: 0.2 },
    { time: '04:00', value: 122000, risk: 0.25 },
    { time: '08:00', value: 118000, risk: 0.4 },
    { time: '12:00', value: 125000, risk: 0.3 },
    { time: '16:00', value: 127000, risk: 0.2 },
    { time: '20:00', value: 125000, risk: 0.3 }
  ];

  useEffect(() => {
    initializeSDK();
    simulateRealTimeData();
  }, []);

  const initializeSDK = async () => {
    // Demo mode - SDK simulation active
    console.log('Demo mode - SDK simulation active');
    setIsConnected(true);
  };

  const simulateRealTimeData = () => {
    setInterval(() => {
      setRiskLevel(prev => Math.max(0.1, Math.min(0.9, prev + (Math.random() - 0.5) * 0.1)));
      setTotalValue(prev => prev + (Math.random() - 0.5) * 2000);
      
      if (Math.random() > 0.7) {
        const activities = ['Risk Assessment', 'Liquidity Optimization', 'Emergency Check', 'Threshold Validation'];
        const newActivity = {
          id: Date.now(),
          type: activities[Math.floor(Math.random() * activities.length)],
          status: Math.random() > 0.2 ? 'success' : 'warning',
          timestamp: new Date().toLocaleTimeString()
        };
        setAgentActivity(prev => [newActivity, ...prev.slice(0, 4)]);
      }
    }, 3000);
  };

  const getRiskColor = (risk: number) => {
    if (risk < 0.3) return '#10B981';
    if (risk < 0.6) return '#F59E0B';
    return '#EF4444';
  };

  const getRiskLabel = (risk: number) => {
    if (risk < 0.3) return 'Low Risk';
    if (risk < 0.6) return 'Medium Risk';
    return 'High Risk';
  };

  // Show landing page
  if (viewMode === 'landing') {
    return <SalesLanding onGetStarted={() => setViewMode('defi')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header with Navigation */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-6 border-b border-purple-500/20"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Cronos AI Agent SDK
              </h1>
              <p className="text-slate-400">
                {viewMode === 'defi' && 'DeFi Portfolio Management'}
                {viewMode === 'commercial' && 'Agent-as-a-Service Dashboard'}
                {viewMode === 'merchant' && 'Merchant AI Ops Copilot'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewMode('landing')}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 border border-purple-500/30 rounded-lg hover:border-purple-500/50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Sales</span>
            </button>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 mt-6">
          <button
            onClick={() => setViewMode('defi')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'defi'
                ? 'bg-purple-500 text-white'
                : 'bg-slate-800/30 text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>DeFi Demo</span>
            </div>
          </button>
          <button
            onClick={() => setViewMode('commercial')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'commercial'
                ? 'bg-purple-500 text-white'
                : 'bg-slate-800/30 text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span>AaaS Dashboard</span>
            </div>
          </button>
          <button
            onClick={() => setViewMode('merchant')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'merchant'
                ? 'bg-purple-500 text-white'
                : 'bg-slate-800/30 text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Store className="w-4 h-4" />
              <span>Merchant Copilot</span>
            </div>
          </button>
        </div>
      </motion.header>

      <div className="p-6">
        {/* Render different dashboards based on view mode */}
        {viewMode === 'commercial' && <CommercialDashboard />}
        {viewMode === 'merchant' && <MerchantCopilot />}

        {/* Original DeFi Dashboard */}
        {viewMode === 'defi' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Overview */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Portfolio Performance</h2>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span className="text-2xl font-bold text-green-400">
                ${totalValue.toLocaleString()}
              </span>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={portfolioData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8B5CF6" 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Risk Monitor */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-6 h-6 text-purple-400" />
            <h3 className="text-lg font-semibold">AI Risk Monitor</h3>
          </div>
          
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-slate-700"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke={getRiskColor(riskLevel)}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${riskLevel * 351.86} 351.86`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: getRiskColor(riskLevel) }}>
                    {Math.round(riskLevel * 100)}%
                  </div>
                  <div className="text-xs text-slate-400">Risk Level</div>
                </div>
              </div>
            </div>
            
            <div className="text-sm font-medium" style={{ color: getRiskColor(riskLevel) }}>
              {getRiskLabel(riskLevel)}
            </div>
          </div>
        </motion.div>

        {/* Agent Activity */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="lg:col-span-3 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Activity className="w-6 h-6 text-green-400" />
            <h3 className="text-lg font-semibold">Live Agent Activity</h3>
          </div>
          
          <div className="space-y-3">
            <AnimatePresence>
              {agentActivity.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 300, opacity: 0 }}
                  className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600/50"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-400' : 'bg-yellow-400'
                    }`}></div>
                    <span className="font-medium">{activity.type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-400">{activity.timestamp}</span>
                    {activity.status === 'success' ? 
                      <TrendingUp className="w-4 h-4 text-green-400" /> : 
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    }
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {agentActivity.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Waiting for agent activity...</p>
              </div>
            )}
          </div>
        </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;