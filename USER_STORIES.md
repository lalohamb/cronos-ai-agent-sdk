# Cronos AI Agent SDK - User Stories

## Story 1: DeFi Protocol Developer - Risk Management

**As a** DeFi protocol developer  
**I want to** automatically monitor and protect user deposits in my vault  
**So that** I can prevent losses when users' balances fall below safe thresholds

### Context
Sarah runs a DeFi lending protocol on Cronos. Users deposit CRO as collateral to borrow stablecoins. She needs to automatically monitor collateral ratios and prevent risky withdrawals.

### Implementation
```typescript
import { SentinelAgentSDK, RiskMonitor } from '@sentinel/ai-agent-sdk';

const sdk = new SentinelAgentSDK({
  network: 'cronos-mainnet',
  rpcUrl: 'https://evm.cronos.org',
  privateKey: process.env.AGENT_PRIVATE_KEY
});

await sdk.registerContract('lending-vault', {
  address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  abi: vaultABI,
  network: 'cronos-mainnet'
});

sdk.registerAgent('risk-monitor', new RiskMonitor());

// Monitor every deposit
sdk.onContractEvent('lending-vault', 'Deposited', async (event) => {
  const decision = await sdk.executeAgent('risk-monitor', {
    contractId: 'lending-vault',
    user: event.args.user,
    customData: {
      balance: event.args.newBalance,
      threshold: ethers.parseEther('100') // Min 100 CRO
    }
  });
  
  if (decision.action.type === 'BLOCK') {
    // Pause withdrawals for this user
    await vault.pauseUser(event.args.user);
    console.log(`⚠️ User ${event.args.user} paused: ${decision.reason}`);
  }
});

await sdk.start();
```

### Outcome
- Automatically monitors 1000+ deposits/day
- Prevents risky withdrawals before liquidation
- Reduces bad debt by 40%
- No manual intervention needed

---

## Story 2: DEX Developer - Liquidity Optimization

**As a** DEX developer  
**I want to** automatically rebalance liquidity pools when prices change  
**So that** liquidity providers earn optimal fees and reduce impermanent loss

### Context
Mike built a DEX on Cronos. When token prices fluctuate, liquidity becomes imbalanced. He needs automated rebalancing to maintain optimal ratios.

### Implementation
```typescript
import { SentinelAgentSDK, LiquidityOptimizer } from '@sentinel/ai-agent-sdk';

const sdk = new SentinelAgentSDK({
  network: 'cronos-mainnet',
  rpcUrl: 'https://evm.cronos.org',
  privateKey: process.env.AGENT_PRIVATE_KEY
});

await sdk.registerContract('dex-pool', {
  address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  abi: dexABI,
  network: 'cronos-mainnet'
});

sdk.registerAgent('liquidity-optimizer', new LiquidityOptimizer());

// Monitor price updates
sdk.onContractEvent('dex-pool', 'PriceUpdate', async (event) => {
  const decision = await sdk.executeAgent('liquidity-optimizer', {
    contractId: 'dex-pool',
    user: event.args.pool,
    customData: {
      currentPrice: event.args.price,
      liquidity: event.args.liquidity,
      targetRatio: 0.8 // Target 80% utilization
    }
  });
  
  if (decision.action.type === 'ADD') {
    await pool.addLiquidity(decision.action.amount);
    console.log(`💧 Added ${decision.action.amount} liquidity`);
  } else if (decision.action.type === 'REMOVE') {
    await pool.removeLiquidity(decision.action.amount);
    console.log(`💧 Removed ${decision.action.amount} liquidity`);
  }
});

await sdk.start();
```

### Outcome
- Rebalances pools automatically every price change
- Increases LP fee earnings by 25%
- Reduces impermanent loss by 30%
- Maintains optimal liquidity 24/7

---

## Story 3: NFT Marketplace - Fraud Detection

**As an** NFT marketplace operator  
**I want to** detect suspicious trading patterns in real-time  
**So that** I can prevent wash trading and protect legitimate buyers

### Context
Lisa runs an NFT marketplace on Cronos. She's seeing suspicious activity - same wallets buying/selling to inflate prices. She needs automated fraud detection.

### Implementation
```typescript
import { SentinelAgentSDK, AnomalyDetector } from '@sentinel/ai-agent-sdk';

const sdk = new SentinelAgentSDK({
  network: 'cronos-mainnet',
  rpcUrl: 'https://evm.cronos.org',
  privateKey: process.env.AGENT_PRIVATE_KEY,
  aiProvider: 'openai', // Use AI for complex pattern detection
  aiApiKey: process.env.OPENAI_API_KEY
});

await sdk.registerContract('nft-marketplace', {
  address: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  abi: marketplaceABI,
  network: 'cronos-mainnet'
});

sdk.registerAgent('anomaly-detector', new AnomalyDetector());

// Track historical prices
const priceHistory = new Map();

sdk.onContractEvent('nft-marketplace', 'Sale', async (event) => {
  const collection = event.args.collection;
  const price = Number(ethers.formatEther(event.args.price));
  
  const history = priceHistory.get(collection) || [];
  const avg = history.reduce((a, b) => a + b, 0) / history.length || price;
  const stdDev = Math.sqrt(
    history.reduce((sum, p) => sum + Math.pow(p - avg, 2), 0) / history.length
  ) || 1;
  
  const decision = await sdk.executeAgent('anomaly-detector', {
    contractId: 'nft-marketplace',
    user: event.args.buyer,
    customData: {
      currentValue: price,
      historicalAverage: avg,
      standardDeviation: stdDev
    }
  });
  
  if (decision.action.severity === 'HIGH') {
    // Flag transaction for review
    await marketplace.flagTransaction(event.args.txHash);
    await notifyAdmins({
      type: 'SUSPICIOUS_SALE',
      buyer: event.args.buyer,
      seller: event.args.seller,
      price: price,
      reason: decision.reason
    });
    console.log(`🚨 Suspicious sale detected: ${decision.reason}`);
  }
  
  // Update history
  history.push(price);
  priceHistory.set(collection, history.slice(-100)); // Keep last 100
});

await sdk.start();
```

### Outcome
- Detects 95% of wash trading attempts
- Flags suspicious sales in < 1 second
- Reduces fraud by 60%
- Protects marketplace reputation

---

## Story 4: Gaming Platform - Anti-Cheat System

**As a** blockchain gaming developer  
**I want to** detect unusual player behavior and item transfers  
**So that** I can prevent exploits and maintain fair gameplay

### Context
Alex built a play-to-earn game on Cronos. Players earn tokens by completing quests. Some players found exploits to farm tokens unfairly. He needs automated exploit detection.

### Implementation
```typescript
import { SentinelAgentSDK, BaseAgent } from '@sentinel/ai-agent-sdk';

// Custom anti-cheat agent
class AntiCheatAgent extends BaseAgent {
  config = {
    id: 'anti-cheat',
    name: 'Anti-Cheat Agent',
    description: 'Detects gaming exploits',
    version: '1.0.0'
  };

  async decide(context) {
    const { earnedTokens, timeSpent, questsCompleted } = context.customData;
    
    // Calculate expected earnings
    const expectedRate = 10; // 10 tokens per hour
    const expectedTokens = (timeSpent / 3600) * expectedRate;
    const deviation = earnedTokens / expectedTokens;
    
    if (deviation > 3) { // Earning 3x expected rate
      return {
        action: { type: 'BAN', duration: 86400 }, // 24h ban
        reason: `Earning ${deviation.toFixed(1)}x expected rate - possible exploit`,
        confidence: 0.9
      };
    }
    
    if (deviation > 2) {
      return {
        action: { type: 'FLAG', review: true },
        reason: `Earning ${deviation.toFixed(1)}x expected rate - needs review`,
        confidence: 0.7
      };
    }
    
    return {
      action: { type: 'ALLOW' },
      reason: 'Normal gameplay pattern',
      confidence: 0.95
    };
  }
}

const sdk = new SentinelAgentSDK({
  network: 'cronos-mainnet',
  rpcUrl: 'https://evm.cronos.org',
  privateKey: process.env.AGENT_PRIVATE_KEY
});

await sdk.registerContract('game-rewards', {
  address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  abi: gameABI,
  network: 'cronos-mainnet'
});

sdk.registerAgent('anti-cheat', new AntiCheatAgent());

sdk.onContractEvent('game-rewards', 'TokensEarned', async (event) => {
  const playerStats = await getPlayerStats(event.args.player);
  
  const decision = await sdk.executeAgent('anti-cheat', {
    contractId: 'game-rewards',
    user: event.args.player,
    customData: {
      earnedTokens: Number(ethers.formatEther(event.args.amount)),
      timeSpent: playerStats.sessionDuration,
      questsCompleted: playerStats.questsCompleted
    }
  });
  
  if (decision.action.type === 'BAN') {
    await game.banPlayer(event.args.player, decision.action.duration);
    console.log(`🚫 Player banned: ${decision.reason}`);
  } else if (decision.action.type === 'FLAG') {
    await game.flagPlayer(event.args.player);
    console.log(`⚠️ Player flagged: ${decision.reason}`);
  }
});

await sdk.start();
```

### Outcome
- Detects exploits within minutes
- Reduces unfair token farming by 80%
- Maintains game economy balance
- Improves player trust and retention

---

## Story 5: Stablecoin Protocol - Emergency Shutdown

**As a** stablecoin protocol developer  
**I want to** automatically trigger emergency shutdown when peg breaks  
**So that** I can protect users from catastrophic losses

### Context
Emma manages a stablecoin protocol on Cronos. If the peg breaks beyond 5%, she needs immediate emergency shutdown to prevent bank run.

### Implementation
```typescript
import { SentinelAgentSDK, EmergencyBrake } from '@sentinel/ai-agent-sdk';

const sdk = new SentinelAgentSDK({
  network: 'cronos-mainnet',
  rpcUrl: 'https://evm.cronos.org',
  privateKey: process.env.AGENT_PRIVATE_KEY
});

await sdk.registerContract('stablecoin', {
  address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  abi: stablecoinABI,
  network: 'cronos-mainnet'
});

sdk.registerAgent('emergency-brake', new EmergencyBrake());

// Monitor price oracle updates
sdk.onContractEvent('stablecoin', 'PriceUpdated', async (event) => {
  const price = Number(ethers.formatEther(event.args.price));
  const deviation = Math.abs(price - 1.0); // Target $1.00
  
  const decision = await sdk.executeAgent('emergency-brake', {
    contractId: 'stablecoin',
    user: 'system',
    customData: {
      metric: deviation * 100, // Convert to percentage
      criticalThreshold: 5 // 5% deviation
    }
  });
  
  if (decision.action.type === 'PAUSE') {
    // Emergency shutdown
    await stablecoin.pause();
    await notifyTeam({
      type: 'EMERGENCY_SHUTDOWN',
      reason: decision.reason,
      price: price,
      deviation: `${(deviation * 100).toFixed(2)}%`
    });
    console.log(`🚨 EMERGENCY SHUTDOWN: ${decision.reason}`);
  }
});

await sdk.start();
```

### Outcome
- Triggers shutdown in < 5 seconds when peg breaks
- Prevents catastrophic losses
- Protects $10M+ in user funds
- Maintains protocol credibility

---

## Story 6: Multi-Protocol Dashboard - Unified Monitoring

**As a** DeFi protocol manager  
**I want to** monitor multiple protocols from a single dashboard  
**So that** I can manage all my agents and policies in one place

### Context
David manages 5 different DeFi protocols on Cronos. He needs a unified interface to monitor all agents, view decisions, and configure policies.

### Implementation
```typescript
import React from 'react';
import { 
  Dashboard, 
  AgentConsole, 
  EventMonitor, 
  ContractRegistry,
  useAgentSDK 
} from '@cronos/ai-agent-ui';

function MultiProtocolDashboard() {
  const { sdk, isReady } = useAgentSDK({
    network: 'cronos-mainnet',
    rpcUrl: 'https://evm.cronos.org',
    privateKey: process.env.AGENT_PRIVATE_KEY
  });

  if (!isReady) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Multi-Protocol Agent Dashboard</h1>
      
      {/* Overview metrics */}
      <Dashboard sdk={sdk!} />
      
      {/* Execute agents manually */}
      <div style={{ marginTop: '20px' }}>
        <AgentConsole sdk={sdk!} />
      </div>
      
      {/* Real-time event feed */}
      <div style={{ marginTop: '20px' }}>
        <EventMonitor sdk={sdk!} />
      </div>
      
      {/* Manage contracts */}
      <div style={{ marginTop: '20px' }}>
        <ContractRegistry sdk={sdk!} />
      </div>
    </div>
  );
}

export default MultiProtocolDashboard;
```

### Outcome
- Monitors 5 protocols from single dashboard
- Views 1000+ agent decisions per day
- Manages 20+ agents across protocols
- Reduces monitoring time by 90%

---

## Common Patterns Across Stories

### Pattern 1: Event-Driven Automation
All stories use `sdk.onContractEvent()` to automatically respond to blockchain events without manual intervention.

### Pattern 2: Configurable Thresholds
Each agent accepts custom thresholds and parameters via `customData`, making them adaptable to different protocols.

### Pattern 3: Confidence Scoring
All decisions include confidence scores (0-1), allowing developers to set minimum confidence policies.

### Pattern 4: Actionable Decisions
Agents return structured actions (`BLOCK`, `LIMIT`, `ALLOW`, etc.) that can be immediately executed.

### Pattern 5: Extensibility
Developers can create custom agents by extending `BaseAgent` for protocol-specific logic.

---

## Key Takeaways

1. **Protocol Agnostic**: Same SDK works for DeFi, NFT, Gaming, Stablecoins
2. **Minimal Code**: 20-50 lines to add intelligent automation
3. **Real-Time**: Responds to events in < 1 second
4. **Flexible**: Use built-in agents or create custom ones
5. **Production Ready**: Handles 1000+ events/minute
6. **Optional UI**: React components for visual management
