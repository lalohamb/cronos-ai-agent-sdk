import { BaseAgent } from '../BaseAgent';
import { AgentContext, AgentDecision } from '../types';

export interface AnomalyContext {
  currentValue: number;
  historicalAverage: number;
  standardDeviation: number;
}

export interface AnomalyAction {
  type: 'NORMAL' | 'ANOMALY_DETECTED';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export class AnomalyDetector extends BaseAgent {
  config = {
    id: 'anomaly-detector',
    name: 'Anomaly Detector',
    description: 'Detects unusual patterns in contract behavior',
    version: '1.0.0'
  };

  async decide(context: AgentContext): Promise<AgentDecision> {
    this.validateContext(context);
    const { currentValue, historicalAverage, standardDeviation } = context.customData;
    const deviation = Math.abs(currentValue - historicalAverage);
    const zScore = standardDeviation > 0 ? deviation / standardDeviation : 0;

    if (zScore > 3) {
      return {
        action: { type: 'ANOMALY_DETECTED', severity: 'HIGH', reason: 'Severe anomaly detected' },
        reason: `Severe anomaly detected: ${zScore.toFixed(2)} standard deviations`,
        confidence: 0.95
      };
    }

    if (zScore > 2) {
      return {
        action: { type: 'ANOMALY_DETECTED', severity: 'MEDIUM', reason: 'Moderate anomaly detected' },
        reason: `Moderate anomaly detected: ${zScore.toFixed(2)} standard deviations`,
        confidence: 0.85
      };
    }

    if (zScore > 1.5) {
      return {
        action: { type: 'ANOMALY_DETECTED', severity: 'LOW', reason: 'Minor anomaly detected' },
        reason: `Minor anomaly detected: ${zScore.toFixed(2)} standard deviations`,
        confidence: 0.7
      };
    }

    return {
      action: { type: 'NORMAL', severity: 'LOW', reason: 'Behavior normal' },
      reason: 'Behavior within normal parameters',
      confidence: 0.9
    };
  }
}
