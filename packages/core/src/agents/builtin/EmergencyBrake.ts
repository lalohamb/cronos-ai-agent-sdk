import { BaseAgent } from '../BaseAgent';
import { AgentContext, AgentDecision } from '../types';

export interface EmergencyContext {
  metric: number;
  criticalThreshold: number;
}

export interface EmergencyAction {
  type: 'PAUSE' | 'RESUME';
  reason: string;
}

export class EmergencyBrake extends BaseAgent {
  config = {
    id: 'emergency-brake',
    name: 'Emergency Brake',
    description: 'Triggers emergency stops when critical thresholds are breached',
    version: '1.0.0'
  };

  async decide(context: AgentContext): Promise<AgentDecision> {
    this.validateContext(context);
    
    const { metric, criticalThreshold } = context.customData;
    
    if (!metric || !criticalThreshold) {
      throw new Error('EmergencyBrake requires metric and criticalThreshold in customData');
    }

    if (metric >= criticalThreshold) {
      return {
        action: { type: 'PAUSE', reason: 'Critical threshold breached', severity: 'CRITICAL' },
        reason: `Metric ${metric} exceeded critical threshold ${criticalThreshold}`,
        confidence: 1.0
      };
    }

    return {
      action: { type: 'RESUME', reason: 'System operating normally', severity: 'LOW' },
      reason: 'All metrics within safe range',
      confidence: 0.95
    };
  }
}
