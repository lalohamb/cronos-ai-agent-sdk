import { BaseAgent } from '../BaseAgent';
import { AgentContext, AgentDecision } from '../types';

export interface ThresholdContext {
  value: bigint;
  minThreshold: bigint;
  maxThreshold: bigint;
}

export interface ThresholdAction {
  type: 'APPROVE' | 'REJECT';
  adjustedValue?: bigint;
}

export class ThresholdGuard extends BaseAgent {
  config = {
    id: 'threshold-guard',
    name: 'Threshold Guard',
    description: 'Enforces threshold limits on operations',
    version: '1.0.0'
  };

  async decide(context: AgentContext): Promise<AgentDecision> {
    this.validateContext(context);
    
    const { value, minThreshold, maxThreshold } = context.customData;
    
    if (!value || !minThreshold || !maxThreshold) {
      throw new Error('ThresholdGuard requires value, minThreshold, and maxThreshold in customData');
    }
    
    const valueBN = BigInt(value.toString());
    const minBN = BigInt(minThreshold.toString());
    const maxBN = BigInt(maxThreshold.toString());

    if (valueBN < minBN) {
      return {
        action: { type: 'REJECT', reason: 'Below minimum threshold', severity: 'HIGH' },
        reason: `Value ${valueBN} below minimum threshold ${minBN}`,
        confidence: 1.0
      };
    }

    if (valueBN > maxBN) {
      return {
        action: { type: 'APPROVE', value: maxBN.toString(), reason: 'Capped at maximum', severity: 'MEDIUM' },
        reason: `Value capped at maximum threshold ${maxBN}`,
        confidence: 0.9
      };
    }

    return {
      action: { type: 'APPROVE', reason: 'Within thresholds', severity: 'LOW' },
      reason: 'Value within acceptable thresholds',
      confidence: 1.0
    };
  }
}
