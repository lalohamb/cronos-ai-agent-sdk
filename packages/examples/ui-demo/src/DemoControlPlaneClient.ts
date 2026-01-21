import { ControlPlaneClient, RuntimeIdentification, PolicyPack, DecisionRecord, TelemetryEvent } from '@sentinel/ai-agent-sdk';

export class DemoControlPlaneClient implements ControlPlaneClient {
  public records: DecisionRecord[] = [];
  public telemetryEvents: TelemetryEvent[] = [];
  private enabled: boolean = true;
  private runtimeId: string;

  constructor() {
    this.runtimeId = `demo-runtime-${Date.now()}`;
  }

  async identifyRuntime(_input: RuntimeIdentification): Promise<{ runtimeId: string }> {
    return { runtimeId: this.runtimeId };
  }

  async pullPolicyPack(_input: { runtimeId?: string }): Promise<{ pack: PolicyPack; etag?: string }> {
    return {
      pack: {
        packVersion: '2025.12.17.1',
        issuedAt: Date.now() - 3600000, // 1 hour ago
        issuer: 'cronos-agent-control-plane',
        signature: 'demo-signature-abc123',
        publicKeyId: 'key-2025-001',
        rulesets: [
          {
            id: 'global-safety-limits',
            scope: 'global',
            priority: 100,
            enabled: true,
            rules: [
              { type: 'clamp', field: 'action.value', max: 1000 },
              { type: 'requireTag', tag: 'approved' }
            ],
            reason: 'Global safety limits for all agents'
          },
          {
            id: 'risk-monitor-rules',
            scope: 'agent',
            agentId: 'risk-monitor',
            priority: 200,
            enabled: true,
            rules: [
              { type: 'denyIf', field: 'metadata.riskScore', op: '>', value: 85 },
              { type: 'clamp', field: 'confidence', min: 0.7 }
            ],
            reason: 'High-risk decision blocking for risk monitor'
          },
          {
            id: 'liquidity-constraints',
            scope: 'agent',
            agentId: 'liquidity-optimizer',
            priority: 150,
            enabled: true,
            rules: [
              { type: 'clamp', field: 'action.value', min: 100, max: 5000 },
              { type: 'denyIf', field: 'metadata.liquidityRatio', op: '<', value: 0.1 }
            ],
            reason: 'Liquidity optimization constraints'
          },
          {
            id: 'vault-contract-limits',
            scope: 'contract',
            contractId: 'vault-contract-001',
            priority: 180,
            enabled: true,
            rules: [
              { type: 'clamp', field: 'action.value', max: 2000 },
              { type: 'requireTag', tag: 'vault-approved' }
            ],
            reason: 'Vault-specific withdrawal limits'
          },
          {
            id: 'emergency-rules',
            scope: 'global',
            priority: 300,
            enabled: false, // Disabled for demo
            rules: [
              { type: 'denyIf', field: 'action.type', op: '==', value: 'emergency-stop' }
            ],
            reason: 'Emergency stop prevention (currently disabled)'
          }
        ]
      },
      etag: 'demo-etag-v2025.12.17.1'
    };
  }

  async pushDecisionRecord(record: DecisionRecord): Promise<void> {
    this.records.push(record);
    
    // Simulate some demo telemetry
    await this.pushTelemetry({
      type: 'decision_recorded',
      timestamp: Date.now(),
      data: {
        agentId: record.agentId,
        contractId: record.contractId,
        confidence: record.confidence,
        policyVersion: record.policyVersion
      }
    });
  }

  async pushTelemetry(event: TelemetryEvent): Promise<void> {
    this.telemetryEvents.push(event);
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  // Demo methods for UI testing
  getRuntimeId(): string {
    return this.runtimeId;
  }

  getRecordCount(): number {
    return this.records.length;
  }

  getTelemetryCount(): number {
    return this.telemetryEvents.length;
  }

  clear(): void {
    this.records = [];
    this.telemetryEvents = [];
  }
}