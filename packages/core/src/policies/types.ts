import { AgentDecision } from '../agents/types';

export interface Policy {
  id: string;
  name: string;
  description: string;
  validate(decision: AgentDecision): boolean;
  enforce?(decision: AgentDecision): AgentDecision;
}

export interface PolicyConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}