import { AgentContext, AgentDecision } from '../agents/types';

export interface AIProvider {
  generateDecision(prompt: string, context: AgentContext): Promise<AgentDecision>;
  isConfigured(): boolean;
}

export interface AIProviderConfig {
  provider: 'openai' | 'custom';
  apiKey?: string;
  model?: string;
  temperature?: number;
}