# API Reference

## SentinelAgentSDK

### Constructor

```typescript
new SentinelAgentSDK(config: SDKConfig)
```

**SDKConfig:**
- `network: string` - Network name (e.g., 'cronos-testnet', 'cronos-mainnet')
- `rpcUrl: string` - RPC endpoint URL
- `privateKey?: string` - Private key for signing transactions
- `aiProvider?: 'openai'` - AI provider to use
- `aiApiKey?: string` - API key for AI provider
- `aiModel?: string` - AI model to use (default: 'gpt-4')
- `logLevel?: LogLevel` - Logging level (DEBUG, INFO, WARN, ERROR)
- `controlPlane?: ControlPlaneClient` - Enterprise control plane client
- `runtime?: { appName?: string; env?: string; version?: string }` - Runtime identification
- `audit?: AuditConfig` - Audit configuration
- `policyPack?: PolicyPackConfig` - Policy pack configuration

### Methods

#### registerContract
```typescript
async registerContract(id: string, config: ContractConfig): Promise<void>
```

#### unregisterContract
```typescript
unregisterContract(id: string): boolean
```

#### getContractAdapter
```typescript
getContractAdapter(id: string): ContractAdapter
```

#### registerAgent
```typescript
registerAgent(id: string, agent: BaseAgent): void
```

#### unregisterAgent
```typescript
unregisterAgent(id: string): boolean
```

#### executeAgent
```typescript
async executeAgent(agentId: string, context: AgentContext): Promise<AgentDecision>
```

#### onContractEvent
```typescript
onContractEvent(contractId: string, eventName: string, handler: EventHandler): EventSubscription
```

#### addPolicy
```typescript
addPolicy(policy: Policy): void
```

#### removePolicy
```typescript
removePolicy(id: string): boolean
```

#### getAIProvider
```typescript
getAIProvider(): AIProvider | undefined
```

#### start
```typescript
async start(): Promise<void>
```

#### stop
```typescript
async stop(): Promise<void>
```

#### isRunning
```typescript
isRunning(): boolean
```

#### getRuntimeId
```typescript
getRuntimeId(): string | undefined
```

#### getPolicyVersion
```typescript
getPolicyVersion(): string | undefined
```

#### getProvider
```typescript
getProvider(): JsonRpcProvider
```

#### getWallet
```typescript
getWallet(): Wallet | undefined
```

#### getNetwork
```typescript
getNetwork(): string
```

#### getLocalRecords
```typescript
getLocalRecords(): DecisionRecord[]
```

## BaseAgent

### Abstract Class

```typescript
abstract class BaseAgent
```

### Properties

- `abstract config: AgentConfig` - Agent configuration

### Methods

#### decide (abstract)
```typescript
abstract decide(context: AgentContext): Promise<AgentDecision>
```

#### getId
```typescript
getId(): string
```

#### getName
```typescript
getName(): string
```

#### getVersion
```typescript
getVersion(): string
```

#### validateContext (protected)
```typescript
protected validateContext(context: AgentContext): void
```

## Types

### AgentConfig
```typescript
interface AgentConfig {
  id: string;
  name: string;
  description: string;
  version: string;
}
```

### AgentContext
```typescript
interface AgentContext {
  contractId: string;
  user: string;
  blockNumber?: number;
  timestamp?: number;
  customData: Record<string, any>;
}
```

### AgentAction
```typescript
interface AgentAction {
  type: string;
  value?: BigNumberish | string | number;
  reason?: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}
```

### AgentDecision
```typescript
interface AgentDecision {
  action: AgentAction;
  reason: string;
  confidence: number;
  metadata?: Record<string, any>;
}
```

### Policy
```typescript
interface Policy {
  id: string;
  name: string;
  description: string;
  validate(decision: AgentDecision): boolean;
  enforce?(decision: AgentDecision): AgentDecision;
}
```

### ContractConfig
```typescript
interface ContractConfig {
  address: string;
  abi: any[];
  network: string;
}
```

### EventHandler
```typescript
type EventHandler = (event: any) => Promise<void> | void;
```

### EventSubscription
```typescript
interface EventSubscription {
  unsubscribe(): void;
}
```
