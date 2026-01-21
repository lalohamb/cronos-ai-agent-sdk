import { BaseAgent } from '../BaseAgent';
import { AgentContext, AgentDecision } from '../types';
import { parseEther, formatEther } from 'ethers';

export class LiquidityOptimizer extends BaseAgent {
  config = {
    id: 'liquidity-optimizer',
    name: 'Liquidity Optimizer Agent',
    description: 'Optimizes liquidity allocation based on market conditions',
    version: '1.0.0'
  };

  async decide(context: AgentContext): Promise<AgentDecision> {
    this.validateContext(context);

    const { currentPrice, liquidity, targetRatio } = context.customData;
    
    if (!currentPrice || !liquidity || targetRatio === undefined) {
      throw new Error('LiquidityOptimizer requires currentPrice, liquidity, and targetRatio in customData');
    }

    const liquidityBN = BigInt(liquidity.toString());
    const targetLiquidity = (liquidityBN * BigInt(Math.floor(targetRatio * 100))) / 100n;
    const difference = liquidityBN - targetLiquidity;
    const threshold = targetLiquidity / 5n; // 20% threshold for more tolerance
    const absDifference = difference < 0n ? -difference : difference;

    if (absDifference <= threshold) {
      return {
        action: {
          type: 'HOLD',
          reason: 'Liquidity within target range'
        },
        reason: `Current liquidity ${liquidityBN.toString()} is within target range`,
        confidence: 0.8
      };
    }

    if (difference > 0n) {
      return {
        action: {
          type: 'REMOVE',
          value: difference.toString(),
          reason: 'Excess liquidity detected'
        },
        reason: `Remove ${difference.toString()} excess liquidity`,
        confidence: 0.85
      };
    }

    return {
      action: {
        type: 'ADD',
        value: absDifference.toString(),
        reason: 'Insufficient liquidity'
      },
      reason: `Add ${absDifference.toString()} liquidity to reach target`,
      confidence: 0.85
    };
  }
}