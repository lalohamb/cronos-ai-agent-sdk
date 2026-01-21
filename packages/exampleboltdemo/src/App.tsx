import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { SentinelAgentSDK, RiskMonitor, LiquidityOptimizer, EmergencyBrake, ThresholdGuard, AnomalyDetector } from '@sentinel/ai-agent-sdk';
import HomePage from './pages/HomePage';
import UserStoriesPage from './pages/UserStoriesPage';
import DocumentationPage from './pages/DocumentationPage';
import AgentDashboard from './components/AgentDashboard';
import { SDKHealthChecker, SDKHealthResults } from './utils/sdkHealthChecker';

function App() {
  const [sdk, setSdk] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [healthStatus, setHealthStatus] = useState<SDKHealthResults | null>(null);

  useEffect(() => {
    initializeSDK();
  }, []);

  const initializeSDK = async () => {
    console.log('🚀 Starting SDK health check...');
    setIsReady(false);
    
    const healthChecker = new SDKHealthChecker();
    const results = await healthChecker.runHealthCheck();
    
    setHealthStatus(results);
    setIsReady(healthChecker.isAllHealthy());
    
    console.log('SDK Health Results:', results);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage sdk={sdk} isReady={isReady} />} />
        <Route path="/user-stories" element={<UserStoriesPage />} />
        <Route path="/documentation" element={<DocumentationPage />} />
        <Route path="/dashboard" element={<AgentDashboard sdk={sdk} isReady={isReady} healthStatus={healthStatus} />} />
      </Routes>
    </Router>
  );
}

export default App;
