export interface RuntimeIdentification {
  appName?: string;
  env?: string;
  version?: string;
  chain?: string;
  rpcUrl?: string;
  runtimeId?: string;
}

export interface PolicyPack {
  packVersion: string;
  issuedAt: number;
  issuer?: string;
  signature?: string;
  publicKeyId?: string;
  rulesets: Array<{
    id: string;
    scope: "global" | "agent" | "contract";
    agentId?: string;
    contractId?: string;
    priority: number;
    enabled: boolean;
    rules: Array<
      | { type: "clamp"; field: string; min?: number; max?: number }
      | { type: "denyIf"; field: string; op: ">" | ">=" | "<" | "<=" | "==" | "!="; value: number | string | boolean }
      | { type: "requireTag"; tag: string }
    >;
    reason?: string;
  }>;
}

export interface DecisionRecord {
  recordVersion: number;
  runtimeId?: string;
  agentId: string;
  agentVersion: string;
  policyVersion?: string;
  contractId: string;
  user: string;
  timestamp: number;
  contextHash: string;
  decisionHash: string;
  decision: any;
  reason: string;
  confidence: number;
  metadata?: Record<string, any>;
  createdAt: number;
}

export interface TelemetryEvent {
  type: string;
  timestamp: number;
  data: Record<string, any>;
}

export interface ControlPlaneClient {
  identifyRuntime(input: RuntimeIdentification): Promise<{ runtimeId: string }>;
  pullPolicyPack(input: { runtimeId?: string }): Promise<{ pack: PolicyPack; etag?: string }>;
  pushDecisionRecord(record: DecisionRecord): Promise<void>;
  pushTelemetry(event: TelemetryEvent): Promise<void>;
  isEnabled(): boolean;
}