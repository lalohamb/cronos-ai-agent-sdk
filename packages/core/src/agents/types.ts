import { BigNumberish } from 'ethers';

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  version: string;
}

export interface AgentContext {
  contractId: string;
  user: string;
  blockNumber?: number;
  timestamp?: number;
  customData: Record<string, any>;
}

export interface AgentAction {
  type: string;
  value?: BigNumberish | string | number;
  reason?: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface AgentDecision {
  action: AgentAction;
  reason: string;
  confidence: number;
  metadata?: Record<string, any>;
}