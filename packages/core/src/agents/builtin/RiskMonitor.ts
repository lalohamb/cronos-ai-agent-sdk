import { BaseAgent } from '../BaseAgent';
import { AgentContext, AgentDecision } from '../types';
import { parseEther, formatEther } from 'ethers';

export class RiskMonitor extends BaseAgent {
  config = {
    id: 'risk-monitor',
    name: 'Risk Monitor Agent',
    description: 'Monitors risk metrics and recommends protective actions',
    version: '1.0.0'
  };

  async decide(context: AgentContext): Promise<AgentDecision> {
    this.validateContext(context);

    const { balance, threshold } = context.customData;
    
    if (!balance || !threshold) {
      throw new Error('RiskMonitor requires balance and threshold in customData');
    }

    const balanceBN = BigInt(balance.toString());
    const thresholdBN = BigInt(threshold.toString());
    const criticalThreshold = thresholdBN / 4n; // 25% of threshold is critical

    if (balanceBN < criticalThreshold) {
      return {
        action: {
          type: 'BLOCK',
          reason: 'Balance critically low',
          severity: 'CRITICAL'
        },
        reason: `Balance ${balanceBN.toString()} is below critical threshold ${criticalThreshold.toString()}`,
        confidence: 0.95
      };
    }

    if (balanceBN < thresholdBN) {
      return {
        action: {
          type: 'LIMIT',
          value: (thresholdBN - balanceBN).toString(),
          reason: 'Balance below threshold',
          severity: 'HIGH'
        },
        reason: `Balance ${balanceBN.toString()} is below threshold ${thresholdBN.toString()}`,
        confidence: 0.85
      };
    }

    return {
      action: {
        type: 'ALLOW',
        reason: 'Risk acceptable',
        severity: 'LOW'
      },
      reason: 'Balance is within acceptable risk parameters',
      confidence: 0.9
    };
  }
}