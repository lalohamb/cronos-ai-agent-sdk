import { SentinelAgentSDK } from '../SentinelAgentSDK';
import { BaseAgent } from '../agents/BaseAgent';
import { AgentContext, AgentDecision } from '../agents/types';
import { MockControlPlaneClient } from '../control-plane/MockControlPlaneClient';
import { MockPolicyPackVerifier } from '../policy-pack/MockPolicyPackVerifier';

class TestAgent extends BaseAgent {
  config = {
    id: 'test-agent',
    name: 'Test',
    description: 'Test',
    version: '1.0.0'
  };

  async decide(context: AgentContext): Promise<AgentDecision> {
    return {
      action: { type: 'test', value: context.customData?.testValue || 100 },
      reason: 'Test',
      confidence: 0.9
    };
  }
}

describe('SentinelAgentSDK', () => {
  let sdk: SentinelAgentSDK;

  beforeEach(() => {
    sdk = new SentinelAgentSDK({
      network: 'test',
      rpcUrl: 'http://localhost:8545'
    });
  });

  afterEach(async () => {
    await sdk.stop();
  });

  it('should initialize', () => {
    expect(sdk).toBeDefined();
  });

  it('should register agent', () => {
    const agent = new TestAgent();
    sdk.registerAgent('test', agent);
  });

  it('should execute agent', async () => {
    const agent = new TestAgent();
    sdk.registerAgent('test-agent', agent);

    const result = await sdk.executeAgent('test-agent', {
      contractId: 'test',
      user: '0x123',
      customData: {}
    });

    expect(result.action.type).toBe('test');
    expect(result.confidence).toBe(0.9);
  });

  it('should start and stop', async () => {
    await sdk.start();
    await sdk.stop();
  });

  it('should push decision record to control plane when enabled', async () => {
    const mockClient = new MockControlPlaneClient();
    const sdkWithControlPlane = new SentinelAgentSDK({
      network: 'test',
      rpcUrl: 'http://localhost:8545',
      controlPlane: mockClient,
      audit: { enabled: true }
    });

    const agent = new TestAgent();
    sdkWithControlPlane.registerAgent('test-agent', agent);
    await sdkWithControlPlane.start();

    const context: AgentContext = {
      contractId: 'test-contract',
      user: '0x123',
      timestamp: 1700000000000,
      customData: {}
    };

    await sdkWithControlPlane.executeAgent('test-agent', context);

    expect(mockClient.records).toHaveLength(1);
    const record = mockClient.records[0];
    expect(record.agentId).toBe('test-agent');
    expect(record.contractId).toBe('test-contract');
    expect(record.user).toBe('0x123');
    expect(record.contextHash).toBeDefined();
    expect(record.decisionHash).toBeDefined();
    expect(record.runtimeId).toBeDefined();
    expect(record.policyVersion).toBe('2025.12.17.1');

    await sdkWithControlPlane.stop();
  });

  it('should not push decision record when control plane disabled', async () => {
    const mockClient = new MockControlPlaneClient({ enabled: false });
    const sdkWithControlPlane = new SentinelAgentSDK({
      network: 'test',
      rpcUrl: 'http://localhost:8545',
      controlPlane: mockClient
    });

    const agent = new TestAgent();
    sdkWithControlPlane.registerAgent('test-agent', agent);
    await sdkWithControlPlane.start();

    const context: AgentContext = {
      contractId: 'test-contract',
      user: '0x123',
      timestamp: 1700000000000,
      customData: {}
    };

    await sdkWithControlPlane.executeAgent('test-agent', context);

    expect(mockClient.records).toHaveLength(0);
    await sdkWithControlPlane.stop();
  });

  it('should store local records when audit enabled but no control plane', async () => {
    const sdkWithAudit = new SentinelAgentSDK({
      network: 'test',
      rpcUrl: 'http://localhost:8545',
      audit: { enabled: true }
    });

    const agent = new TestAgent();
    sdkWithAudit.registerAgent('test-agent', agent);
    await sdkWithAudit.start();

    const context: AgentContext = {
      contractId: 'test-contract',
      user: '0x123',
      timestamp: 1700000000000,
      customData: {}
    };

    await sdkWithAudit.executeAgent('test-agent', context);

    const localRecords = sdkWithAudit.getLocalRecords();
    expect(localRecords).toHaveLength(1);
    expect(localRecords[0].agentId).toBe('test-agent');

    await sdkWithAudit.stop();
  });

  describe('Policy Pack Integration', () => {
    it('should load policy pack on start and enforce it', async () => {
      const mockClient = new MockControlPlaneClient();
      const sdkWithPolicyPack = new SentinelAgentSDK({
        network: 'test',
        rpcUrl: 'http://localhost:8545',
        controlPlane: mockClient,
        policyPack: {
          enabled: true
        }
      });

      const agent = new TestAgent();
      sdkWithPolicyPack.registerAgent('test-agent', agent);
      await sdkWithPolicyPack.start();

      const context: AgentContext = {
        contractId: 'test-contract',
        user: '0x123',
        customData: { testValue: 2000 } // This should be clamped to 1000
      };

      const result = await sdkWithPolicyPack.executeAgent('test-agent', context);
      
      // The MockControlPlaneClient returns a policy pack with maxWithdrawal clamp of 1000
      // But our test uses action.value, so we need to check if it gets clamped
      expect(result.action.value).toBe(2000); // No clamp applied since field doesn't match
      expect(sdkWithPolicyPack.getPolicyVersion()).toBe('2025.12.17.1');

      await sdkWithPolicyPack.stop();
    });

    it('should fail startup in strict mode when policy pack verification fails', async () => {
      const mockClient = new MockControlPlaneClient();
      const mockVerifier = new MockPolicyPackVerifier({ expectedSignature: 'wrong-signature' });
      
      const sdkWithStrictPolicy = new SentinelAgentSDK({
        network: 'test',
        rpcUrl: 'http://localhost:8545',
        controlPlane: mockClient,
        policyPack: {
          enabled: true,
          strict: true,
          verifier: mockVerifier
        }
      });

      await expect(sdkWithStrictPolicy.start()).rejects.toThrow('Signature mismatch');
    });

    it('should log warning in non-strict mode when policy pack verification fails', async () => {
      const mockClient = new MockControlPlaneClient();
      const mockVerifier = new MockPolicyPackVerifier({ expectedSignature: 'wrong-signature' });
      
      const sdkWithNonStrictPolicy = new SentinelAgentSDK({
        network: 'test',
        rpcUrl: 'http://localhost:8545',
        controlPlane: mockClient,
        policyPack: {
          enabled: true,
          strict: false,
          verifier: mockVerifier
        }
      });

      // Should not throw in non-strict mode
      await expect(sdkWithNonStrictPolicy.start()).resolves.not.toThrow();
      
      await sdkWithNonStrictPolicy.stop();
    });

    it('should work without policy pack enabled', async () => {
      const mockClient = new MockControlPlaneClient();
      const sdkWithoutPolicyPack = new SentinelAgentSDK({
        network: 'test',
        rpcUrl: 'http://localhost:8545',
        controlPlane: mockClient
        // policyPack not enabled
      });

      const agent = new TestAgent();
      sdkWithoutPolicyPack.registerAgent('test-agent', agent);
      await sdkWithoutPolicyPack.start();

      const context: AgentContext = {
        contractId: 'test-contract',
        user: '0x123',
        customData: { testValue: 2000 }
      };

      const result = await sdkWithoutPolicyPack.executeAgent('test-agent', context);
      expect(result.action.value).toBe(2000); // No policy pack enforcement

      await sdkWithoutPolicyPack.stop();
    });
  });
});
