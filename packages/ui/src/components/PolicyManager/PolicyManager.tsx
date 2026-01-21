import React, { useState, useEffect } from 'react';
import { SentinelAgentSDK, PolicyPack, PolicyRuleset } from '@sentinel/ai-agent-sdk';

interface PolicyManagerProps {
  sdk: SentinelAgentSDK;
}

export function PolicyManager({ sdk }: PolicyManagerProps) {
  const [policyPack, setPolicyPack] = useState<PolicyPack | undefined>(undefined);
  const [expandedRuleset, setExpandedRuleset] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPolicyPack();
  }, []);

  const loadPolicyPack = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would load from the SDK
      // For now, we'll show a placeholder using the correct types
      const mockPolicyPack: PolicyPack = {
        packVersion: '2025.12.17.1',
        issuedAt: Date.now(),
        issuer: 'cronos-agent-control-plane',
        rulesets: [
          {
            id: 'risk-management',
            scope: 'global',
            priority: 100,
            enabled: true,
            rules: [
              {
                type: 'clamp',
                field: 'balance',
                max: 1000
              },
              {
                type: 'denyIf',
                field: 'riskScore',
                op: '>',
                value: 0.8
              }
            ],
            reason: 'Risk monitoring and threshold policies'
          },
          {
            id: 'contract-specific',
            scope: 'contract',
            contractId: 'vault-contract',
            priority: 50,
            enabled: true,
            rules: [
              {
                type: 'requireTag',
                tag: 'verified'
              }
            ],
            reason: 'Contract-specific validation rules'
          }
        ]
      };
      setPolicyPack(mockPolicyPack);
    } catch (error) {
      console.error('Failed to load policy pack:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRuleset = (rulesetId: string) => {
    setExpandedRuleset(expandedRuleset === rulesetId ? null : rulesetId);
  };

  const formatRuleDescription = (rule: PolicyRuleset['rules'][0]): string => {
    switch (rule.type) {
      case 'clamp':
        const parts = [];
        if (rule.min !== undefined) parts.push(`min: ${rule.min}`);
        if (rule.max !== undefined) parts.push(`max: ${rule.max}`);
        return `Clamp ${rule.field} (${parts.join(', ')})`;
      case 'denyIf':
        return `Deny if ${rule.field} ${rule.op} ${rule.value}`;
      case 'requireTag':
        return `Require tag: ${rule.tag}`;
      default:
        return 'Unknown rule type';
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading policy pack...
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      backgroundColor: 'white'
    }}>
      <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>Policy Manager</h2>
      
      <div style={{ marginTop: '20px' }}>
        <div style={{
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Policy Pack Status</h3>
          {policyPack ? (
            <div>
              <p style={{ color: '#666', margin: '0 0 10px 0' }}>
                <strong>Version:</strong> {policyPack.packVersion}
              </p>
              <p style={{ color: '#666', margin: '0 0 10px 0' }}>
                <strong>Issuer:</strong> {policyPack.issuer || 'Unknown'}
              </p>
              <p style={{ color: '#666', margin: 0 }}>
                {policyPack.rulesets.length} ruleset(s) loaded
              </p>
            </div>
          ) : (
            <p style={{ color: '#666', margin: 0 }}>No policy pack loaded</p>
          )}
        </div>

        {policyPack && (
          <div>
            <h3 style={{ margin: '0 0 15px 0', color: '#495057' }}>Rulesets</h3>
            {policyPack.rulesets.map((ruleset) => (
              <div key={ruleset.id} style={{
                border: '1px solid #e9ecef',
                borderRadius: '6px',
                marginBottom: '10px'
              }}>
                <div 
                  style={{
                    padding: '12px 15px',
                    backgroundColor: ruleset.enabled ? '#f8f9fa' : '#f5f5f5',
                    cursor: 'pointer',
                    borderRadius: '6px 6px 0 0'
                  }}
                  onClick={() => toggleRuleset(ruleset.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <strong>{ruleset.id}</strong>
                        <span style={{
                          padding: '2px 8px',
                          backgroundColor: ruleset.enabled ? '#28a745' : '#6c757d',
                          color: 'white',
                          borderRadius: '12px',
                          fontSize: '12px'
                        }}>
                          {ruleset.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                        <span style={{
                          padding: '2px 8px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          borderRadius: '12px',
                          fontSize: '12px'
                        }}>
                          {ruleset.scope}
                        </span>
                      </div>
                      <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
                        Priority: {ruleset.priority} | {ruleset.rules.length} rule(s)
                      </p>
                      {ruleset.reason && (
                        <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
                          {ruleset.reason}
                        </p>
                      )}
                    </div>
                    <span style={{ color: '#666' }}>
                      {expandedRuleset === ruleset.id ? '▼' : '▶'}
                    </span>
                  </div>
                </div>
                
                {expandedRuleset === ruleset.id && (
                  <div style={{ padding: '15px' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>Rules</h4>
                    {ruleset.rules.map((rule, index) => (
                      <div key={index} style={{
                        padding: '10px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '4px',
                        marginBottom: '8px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong>{formatRuleDescription(rule)}</strong>
                            <code style={{ 
                              backgroundColor: '#e9ecef', 
                              padding: '2px 6px', 
                              borderRadius: '3px',
                              fontSize: '12px',
                              marginLeft: '10px'
                            }}>
                              {rule.type}
                            </code>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
