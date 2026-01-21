import { ControlPlaneClient, RuntimeIdentification, PolicyPack, DecisionRecord, TelemetryEvent } from './ControlPlaneClient';

export class MockControlPlaneClient implements ControlPlaneClient {
  public records: DecisionRecord[] = [];
  public telemetryEvents: TelemetryEvent[] = [];
  private enabled: boolean;
  private runtimeId: string;

  constructor(options: { enabled?: boolean } = {}) {
    this.enabled = options.enabled ?? true;
    this.runtimeId = `runtime-${Date.now()}`;
  }

  async identifyRuntime(input: RuntimeIdentification): Promise<{ runtimeId: string }> {
    if (!this.enabled) return { runtimeId: this.runtimeId };
    return { runtimeId: this.runtimeId };
  }

  async pullPolicyPack(input: { runtimeId?: string }): Promise<{ pack: PolicyPack; etag?: string }> {
    if (!this.enabled) {
      return {
        pack: {
          packVersion: '1.0.0',
          issuedAt: Date.now(),
          rulesets: []
        }
      };
    }
    return {
      pack: {
        packVersion: '2025.12.17.1',
        issuedAt: Date.now(),
        issuer: 'cronos-agent-control-plane',
        signature: 'mock-signature',
        rulesets: [
          {
            id: 'global-clamp-rules',
            scope: 'global',
            priority: 100,
            enabled: true,
            rules: [
              { type: 'clamp', field: 'maxWithdrawal', max: 1000 }
            ],
            reason: 'Global withdrawal limits'
          }
        ]
      },
      etag: 'mock-etag-123'
    };
  }

  async pushDecisionRecord(record: DecisionRecord): Promise<void> {
    if (!this.enabled) return;
    this.records.push(record);
  }

  async pushTelemetry(event: TelemetryEvent): Promise<void> {
    if (!this.enabled) return;
    this.telemetryEvents.push(event);
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  clear(): void {
    this.records = [];
    this.telemetryEvents = [];
  }
}