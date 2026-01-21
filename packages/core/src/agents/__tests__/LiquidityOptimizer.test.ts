import { LiquidityOptimizer } from '../builtin/LiquidityOptimizer';
import { AgentContext } from '../types';

describe('LiquidityOptimizer', () => {
  let agent: LiquidityOptimizer;

  beforeEach(() => {
    agent = new LiquidityOptimizer();
  });

  it('should remove excess liquidity', async () => {
    const context: AgentContext = {
      contractId: 'test',
      user: '0x123',
      timestamp: Date.now(),
      customData: {
        currentPrice: '100',
        liquidity: '100',
        targetRatio: 0.5
      }
    };

    const decision = await agent.decide(context);
    expect(decision.action.type).toBe('REMOVE');
    expect(Number(decision.action.value)).toBeGreaterThan(0);
  });

  it('should remove excess liquidity when below target', async () => {
    const context: AgentContext = {
      contractId: 'test',
      user: '0x123',
      timestamp: Date.now(),
      customData: {
        currentPrice: '100',
        liquidity: '1',
        targetRatio: 0.8
      }
    };

    const decision = await agent.decide(context);
    expect(decision.action.type).toBe('REMOVE');
  });

  it('should hold optimal liquidity', async () => {
    const context: AgentContext = {
      contractId: 'test',
      user: '0x123',
      timestamp: Date.now(),
      customData: {
        currentPrice: '100',
        liquidity: '95',
        targetRatio: 0.95
      }
    };

    const decision = await agent.decide(context);
    expect(decision.action.type).toBe('HOLD');
  });
});
