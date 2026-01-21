import { MockControlPlaneClient } from '../MockControlPlaneClient';
import { DecisionRecord } from '../ControlPlaneClient';

describe('MockControlPlaneClient', () => {
  let client: MockControlPlaneClient;

  beforeEach(() => {
    client = new MockControlPlaneClient();
  });

  it('should identify runtime', async () => {
    const result = await client.identifyRuntime({
      appName: 'test-app',
      env: 'test',
      version: '1.0.0'
    });
    
    expect(result.runtimeId).toBeDefined();
    expect(typeof result.runtimeId).toBe('string');
  });

  it('should pull policy pack', async () => {
    const result = await client.pullPolicyPack({ runtimeId: 'test-runtime' });
    
    expect(result.pack.packVersion).toBe('2025.12.17.1');
    expect(result.pack.rulesets).toBeDefined();
    expect(result.pack.signature).toBeDefined();
    expect(result.etag).toBeDefined();
  });

  it('should store decision records', async () => {
    const record: DecisionRecord = {
      recordVersion: 1,
      runtimeId: 'test-runtime',
      agentId: 'test-agent',
      agentVersion: '1.0.0',
      policyVersion: '1.0.0',
      contractId: 'test-contract',
      user: '0x123',
      timestamp: 1700000000000,
      contextHash: 'context-hash',
      decisionHash: 'decision-hash',
      decision: { action: { type: 'test' }, reason: 'test', confidence: 0.9 },
      reason: 'test',
      confidence: 0.9,
      createdAt: Date.now()
    };

    await client.pushDecisionRecord(record);
    
    expect(client.records).toHaveLength(1);
    expect(client.records[0]).toEqual(record);
  });

  it('should store telemetry events', async () => {
    const event = {
      type: 'test-event',
      timestamp: Date.now(),
      data: { key: 'value' }
    };

    await client.pushTelemetry(event);
    
    expect(client.telemetryEvents).toHaveLength(1);
    expect(client.telemetryEvents[0]).toEqual(event);
  });

  it('should respect enabled flag', async () => {
    const disabledClient = new MockControlPlaneClient({ enabled: false });
    
    expect(disabledClient.isEnabled()).toBe(false);
    
    const record: DecisionRecord = {
      recordVersion: 1,
      agentId: 'test-agent',
      agentVersion: '1.0.0',
      contractId: 'test-contract',
      user: '0x123',
      timestamp: 1700000000000,
      contextHash: 'context-hash',
      decisionHash: 'decision-hash',
      decision: { action: { type: 'test' }, reason: 'test', confidence: 0.9 },
      reason: 'test',
      confidence: 0.9,
      createdAt: Date.now()
    };

    await disabledClient.pushDecisionRecord(record);
    expect(disabledClient.records).toHaveLength(0);
  });

  it('should clear records', () => {
    client.records.push({} as DecisionRecord);
    client.telemetryEvents.push({} as any);
    
    client.clear();
    
    expect(client.records).toHaveLength(0);
    expect(client.telemetryEvents).toHaveLength(0);
  });
});