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

export interface AuditConfig {
  enabled?: boolean;
  redact?: (context: any) => any;
}