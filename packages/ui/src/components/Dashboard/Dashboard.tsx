import React, { useState, useEffect } from 'react';
import { SentinelAgentSDK } from '@sentinel/ai-agent-sdk';

interface DashboardProps {
  sdk: SentinelAgentSDK;
}

interface DashboardStats {
  activeAgents: number;
  registeredContracts: number;
  activePolicies: number;
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: Date;
  }>;
}

export function Dashboard({ sdk }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    activeAgents: 0,
    registeredContracts: 0,
    activePolicies: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, [sdk]);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Get registered agents count
      const agentRegistry = (sdk as any).agentRegistry;
      const activeAgents = agentRegistry ? Object.keys(agentRegistry.agents || {}).length : 5;
      
      // Get registered contracts count
      const contractRegistry = (sdk as any).contractRegistry;
      const registeredContracts = contractRegistry ? Object.keys(contractRegistry.contracts || {}).length : 0;
      
      // Mock policy count for now
      const activePolicies = 0;
      
      // Mock recent activity
      const recentActivity = [
        {
          id: '1',
          type: 'agent-execution',
          message: 'Risk monitor executed for vault contract',
          timestamp: new Date(Date.now() - 5 * 60 * 1000)
        },
        {
          id: '2',
          type: 'contract-event',
          message: 'New deposit detected in vault',
          timestamp: new Date(Date.now() - 15 * 60 * 1000)
        }
      ];
      
      setStats({
        activeAgents,
        registeredContracts,
        activePolicies,
        recentActivity
      });
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Cronos AI Agent Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: 'white' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Agents</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0', color: '#007bff' }}>
            {stats.activeAgents}
          </p>
          <p style={{ color: '#666', margin: 0 }}>Active agents</p>
        </div>

        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: 'white' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Contracts</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0', color: '#28a745' }}>
            {stats.registeredContracts}
          </p>
          <p style={{ color: '#666', margin: 0 }}>Registered contracts</p>
        </div>

        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: 'white' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Policies</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0', color: '#ffc107' }}>
            {stats.activePolicies}
          </p>
          <p style={{ color: '#666', margin: 0 }}>Active policies</p>
        </div>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: 'white' }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>Recent Activity</h3>
        {stats.recentActivity.length > 0 ? (
          <div>
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} style={{
                padding: '10px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    backgroundColor: '#e9ecef',
                    borderRadius: '12px',
                    fontSize: '12px',
                    marginRight: '10px'
                  }}>
                    {activity.type}
                  </span>
                  {activity.message}
                </div>
                <span style={{ color: '#666', fontSize: '14px' }}>
                  {activity.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#666', margin: 0 }}>No recent activity</p>
        )}
      </div>
    </div>
  );
}
