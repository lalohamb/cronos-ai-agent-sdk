import { JsonRpcProvider, Wallet } from 'ethers';
import { AgentRegistry } from './agents/AgentRegistry';
import { BaseAgent } from './agents/BaseAgent';
import { AgentContext, AgentDecision } from './agents/types';
import { ContractRegistry } from './contracts/ContractRegistry';
import { ContractConfig } from './contracts/types';
import { EventListener } from './events/EventListener';
import { EventHandler, EventSubscription } from './events/types';
import { PolicyEngine } from './policies/PolicyEngine';
import { Policy } from './policies/types';
import { OpenAIProvider } from './ai/OpenAIProvider';
import { AIProvider, AIProviderConfig } from './ai/types';
import { Logger, LogLevel } from './utils/logger';
import { ControlPlaneClient } from './control-plane/ControlPlaneClient';
import { DecisionRecord, AuditConfig } from './audit/types';
import { hashObject } from './utils/hash';
import { PolicyPackVerifier } from './policy-pack/verifier';
import { NoopPolicyPackVerifier } from './policy-pack/NoopPolicyPackVerifier';
import { PolicyPack } from './policy-pack/types';
import { PaymentManager, PaymentConfig, UsageTracker, MobileWalletManager, EnterpriseConnector, CronosProvider } from './payments';

export interface SDKConfig {
  network: string;
  rpcUrl: string;
  privateKey?: string;
  aiProvider?: 'openai';
  aiApiKey?: string;
  aiModel?: string;
  logLevel?: LogLevel;
  controlPlane?: ControlPlaneClient;
  runtime?: { appName?: string; env?: string; version?: string };
  audit?: AuditConfig;
  policyPack?: {
    enabled?: boolean;
    strict?: boolean;
    verifier?: PolicyPackVerifier;
    refreshMs?: number;
  };
  payments?: PaymentConfig;
}

export class SentinelAgentSDK {
  private config: SDKConfig;
  private provider: JsonRpcProvider;
  private wallet?: Wallet;
  private agentRegistry: AgentRegistry;
  private contractRegistry: ContractRegistry;
  private eventListener: EventListener;
  private policyEngine: PolicyEngine;
  private aiProvider?: AIProvider;
  private logger: Logger;
  private isStarted: boolean = false;
  private runtimeId?: string;
  private policyVersion?: string;
  private localRecords: DecisionRecord[] = [];
  private policyPackVerifier: PolicyPackVerifier;
  private policyPackRefreshTimer?: NodeJS.Timeout;
  private paymentManager?: PaymentManager;
  private usageTracker?: UsageTracker;
  private mobileWalletManager?: MobileWalletManager;
  private enterpriseConnector?: EnterpriseConnector;

  constructor(config: SDKConfig) {
    this.config = config;
    this.logger = new Logger('CronosSDK', config.logLevel || LogLevel.INFO);
    
    // Initialize provider
    this.provider = new JsonRpcProvider(config.rpcUrl);
    
    // Initialize wallet if private key provided
    if (config.privateKey) {
      this.wallet = new Wallet(config.privateKey, this.provider);
    }

    // Initialize core components
    this.agentRegistry = new AgentRegistry();
    this.contractRegistry = new ContractRegistry(this.provider);
    this.eventListener = new EventListener(this.contractRegistry);
    this.policyEngine = new PolicyEngine();

    // Initialize AI provider if configured
    if (config.aiProvider === 'openai' && config.aiApiKey) {
      const aiConfig: AIProviderConfig = {
        provider: 'openai',
        apiKey: config.aiApiKey,
        model: config.aiModel || 'gpt-4'
      };
      this.aiProvider = new OpenAIProvider(aiConfig);
    }

    // Initialize policy pack verifier
    this.policyPackVerifier = config.policyPack?.verifier || new NoopPolicyPackVerifier();

    // Initialize payment system if configured
    if (config.payments) {
      this.initializePaymentSystem(config.payments);
    }

    this.logger.info('SentinelAgentSDK initialized', { network: config.network });
  }

  // Agent Management
  registerAgent(id: string, agent: BaseAgent): void {
    this.agentRegistry.register(id, agent);
    this.logger.info(`Agent registered: ${id}`);
  }

  unregisterAgent(id: string): boolean {
    const result = this.agentRegistry.unregister(id);
    if (result) {
      this.logger.info(`Agent unregistered: ${id}`);
    }
    return result;
  }

  listAgents(): string[] {
    return this.agentRegistry.list().map(agent => agent.getId());
  }

  async executeAgent(agentId: string, context: AgentContext): Promise<AgentDecision> {
    this.logger.debug(`Executing agent: ${agentId}`, context);
    
    const decision = await this.agentRegistry.execute(agentId, context);
    // Pass context with agentId for policy pack enforcement
    const contextWithAgent = { ...context, customData: { ...context.customData, agentId } };
    const enforcedDecision = this.policyEngine.enforce(decision, contextWithAgent);
    
    if (!this.policyEngine.validate(enforcedDecision)) {
      throw new Error('Decision violates policy constraints');
    }

    // Create audit record if enabled
    if (this.config.audit?.enabled || this.config.controlPlane?.isEnabled()) {
      await this.createDecisionRecord(agentId, context, enforcedDecision);
    }

    this.logger.debug(`Agent decision: ${agentId}`, enforcedDecision);
    return enforcedDecision;
  }

  // Contract Management
  async registerContract(id: string, config: ContractConfig): Promise<void> {
    this.contractRegistry.register(id, config);
    this.logger.info(`Contract registered: ${id} at ${config.address}`);
  }

  unregisterContract(id: string): boolean {
    const result = this.contractRegistry.unregister(id);
    if (result) {
      this.logger.info(`Contract unregistered: ${id}`);
    }
    return result;
  }

  getContract(id: string) {
    return this.contractRegistry.get(id);
  }

  listContracts(): string[] {
    return this.contractRegistry.list();
  }

  getContractDetails(id: string): { id: string; address: string; network: string } | null {
    const adapter = this.contractRegistry.get(id);
    if (!adapter) return null;
    return {
      id,
      address: adapter.getAddress(),
      network: adapter.getNetwork()
    };
  }

  getAllContractDetails(): Array<{ id: string; address: string; network: string }> {
    return this.contractRegistry.list().map(id => {
      const adapter = this.contractRegistry.get(id)!;
      return {
        id,
        address: adapter.getAddress(),
        network: adapter.getNetwork()
      };
    });
  }

  // Event Management
  onContractEvent(contractId: string, eventName: string, handler: EventHandler): EventSubscription {
    const subscription = this.eventListener.subscribe(contractId, eventName, handler);
    this.logger.info(`Event subscription created: ${contractId}.${eventName}`);
    return subscription;
  }

  // Policy Management
  addPolicy(policy: Policy): void {
    this.policyEngine.addPolicy(policy);
    this.logger.info(`Policy added: ${policy.id}`);
  }

  removePolicy(id: string): boolean {
    const result = this.policyEngine.removePolicy(id);
    if (result) {
      this.logger.info(`Policy removed: ${id}`);
    }
    return result;
  }

  // AI Provider Access
  getAIProvider(): AIProvider | undefined {
    return this.aiProvider;
  }

  // Lifecycle Management
  async start(): Promise<void> {
    if (this.isStarted) {
      this.logger.warn('SDK already started');
      return;
    }

    this.logger.info('Starting SentinelAgentSDK...');
    
    // Initialize control plane if enabled
    if (this.config.controlPlane?.isEnabled()) {
      try {
        const result = await this.config.controlPlane.identifyRuntime({
          appName: this.config.runtime?.appName,
          env: this.config.runtime?.env,
          version: this.config.runtime?.version,
          chain: this.config.network,
          rpcUrl: this.config.rpcUrl
        });
        this.runtimeId = result.runtimeId;
        
        // Pull policy pack for version tracking (but only apply if enabled)
        const policyResult = await this.config.controlPlane.pullPolicyPack({ runtimeId: this.runtimeId });
        this.policyVersion = policyResult.pack.packVersion;
        
        // Load and apply policy pack if enabled
        if (this.config.policyPack?.enabled) {
          await this.loadPolicyPack();
          
          // Set up periodic refresh if configured
          if (this.config.policyPack.refreshMs) {
            this.policyPackRefreshTimer = setInterval(() => {
              this.loadPolicyPack().catch(error => {
                this.logger.warn('Failed to refresh policy pack', error);
              });
            }, this.config.policyPack.refreshMs);
          }
        }
        
        this.logger.info('Control plane initialized', { runtimeId: this.runtimeId, policyVersion: this.policyVersion });
      } catch (error) {
        // Re-throw policy pack errors in strict mode
        if (this.config.policyPack?.strict && error instanceof Error && error.message.includes('Policy pack verification failed')) {
          throw error;
        }
        this.logger.warn('Failed to initialize control plane', error);
      }
    }
    
    this.isStarted = true;
    this.logger.info('SentinelAgentSDK started successfully');
  }

  async stop(): Promise<void> {
    if (!this.isStarted) {
      this.logger.warn('SDK not started');
      return;
    }

    this.logger.info('Stopping SentinelAgentSDK...');
    
    // Clear policy pack refresh timer
    if (this.policyPackRefreshTimer) {
      clearInterval(this.policyPackRefreshTimer);
      this.policyPackRefreshTimer = undefined;
    }
    
    this.eventListener.unsubscribeAll();
    this.isStarted = false;
    this.logger.info('SentinelAgentSDK stopped');
  }

  // Utility Methods
  isRunning(): boolean {
    return this.isStarted;
  }

  getRuntimeId(): string | undefined {
    return this.runtimeId;
  }

  getPolicyVersion(): string | undefined {
    return this.policyVersion;
  }

  getProvider(): JsonRpcProvider {
    return this.provider;
  }

  getWallet(): Wallet | undefined {
    return this.wallet;
  }

  getNetwork(): string {
    return this.config.network;
  }

  // Payment Methods
  getPaymentManager(): PaymentManager | undefined {
    return this.paymentManager;
  }

  getUsageTracker(): UsageTracker | undefined {
    return this.usageTracker;
  }

  async processPayment(amount: number, currency: string, recipient: string, providerId?: string): Promise<any> {
    if (!this.paymentManager) {
      throw new Error('Payment system not initialized');
    }
    
    const result = await this.paymentManager.processPayment({
      amount,
      currency,
      recipient
    }, providerId);
    
    if (!result.success && result.error?.statusCode === 402) {
      this.logger.warn('Payment required (402)', result.error);
    }
    
    return result;
  }

  trackUsage(userId: string, service: string, amount: number, currency: string): void {
    if (this.usageTracker) {
      this.usageTracker.track(userId, service, amount, currency);
    }
  }

  private initializePaymentSystem(config: PaymentConfig): void {
    // Add Cronos provider if wallet is available
    if (this.wallet) {
      const cronosProvider = new CronosProvider(this.provider, this.wallet);
      config.providers.push(cronosProvider);
    }

    this.paymentManager = new PaymentManager(config);
    this.usageTracker = new UsageTracker();
    
    if (config.mobileWallets) {
      this.mobileWalletManager = new MobileWalletManager(config.mobileWallets);
    }
    
    if (config.enterpriseConnectors) {
      this.enterpriseConnector = new EnterpriseConnector(config.enterpriseConnectors);
    }
    
    this.logger.info('Payment system initialized');
  }

  private async createDecisionRecord(agentId: string, context: AgentContext, decision: AgentDecision): Promise<void> {
    try {
      let agentVersion = '1.0.0';
      try {
        const agent = this.agentRegistry.get(agentId);
        agentVersion = agent?.config?.version || '1.0.0';
      } catch {
        // Agent not found, use default version
      }
      
      // Apply redaction if configured
      const sanitizedContext = this.config.audit?.redact ? this.config.audit.redact(context) : context;
      
      const record: DecisionRecord = {
        recordVersion: 1,
        runtimeId: this.runtimeId,
        agentId,
        agentVersion,
        policyVersion: this.policyVersion,
        contractId: context.contractId,
        user: context.user,
        timestamp: context.timestamp || Date.now(),
        contextHash: hashObject(sanitizedContext),
        decisionHash: hashObject(decision),
        decision,
        reason: decision.reason,
        confidence: decision.confidence,
        metadata: decision.metadata,
        createdAt: Date.now()
      };
      
      // Push to control plane if enabled
      if (this.config.controlPlane?.isEnabled()) {
        await this.config.controlPlane.pushDecisionRecord(record);
      } else if (this.config.audit?.enabled) {
        // Store locally if audit enabled but no control plane
        this.localRecords.push(record);
        // Keep only last 100 records to prevent memory issues
        if (this.localRecords.length > 100) {
          this.localRecords = this.localRecords.slice(-100);
        }
      }
    } catch (error) {
      this.logger.warn('Failed to create decision record', error);
    }
  }

  getLocalRecords(): DecisionRecord[] {
    return [...this.localRecords];
  }

  private async loadPolicyPack(): Promise<void> {
    if (!this.config.controlPlane?.isEnabled()) return;

    try {
      const result = await this.config.controlPlane.pullPolicyPack({ runtimeId: this.runtimeId });
      const pack = result.pack;
      
      // Verify policy pack
      const verification = await this.policyPackVerifier.verify(pack);
      if (!verification.ok) {
        const message = `Policy pack verification failed: ${verification.reason}`;
        if (this.config.policyPack?.strict) {
          throw new Error(message);
        } else {
          this.logger.warn(message);
          return;
        }
      }
      
      // Apply policy pack
      this.policyEngine.setPolicyPack(pack);
      this.policyVersion = pack.packVersion;
      
      this.logger.info('Policy pack loaded', { packVersion: pack.packVersion, rulesets: pack.rulesets.length });
    } catch (error) {
      const message = `Failed to load policy pack: ${error}`;
      if (this.config.policyPack?.strict) {
        throw error;
      } else {
        this.logger.warn(message);
      }
    }
  }
}