# Custom Agent Types - Complete Implementation Guide

This guide provides detailed implementations for different types of custom agents you can create with the Cronos AI Agent SDK.

## 🚀 Quick Start - Minimum Steps

### Build an Agent in 3 Simple Steps:

**Step 1: Create the Agent File**
```typescript
// MyAgent.ts
import { BaseAgent } from '@sentinel/ai-agent-sdk';

export class MyAgent extends BaseAgent {
  config = {
    id: 'my-agent',
    name: 'My Custom Agent',
    description: 'Does something useful',
    version: '1.0.0'
  };

  async decide(context) {
    const value = context.customData?.amount || 0;
    
    if (value > 100) {
      return {
        action: { type: 'BLOCK' },
        reason: 'Amount too high',
        confidence: 0.9
      };
    }
    
    return {
      action: { type: 'ALLOW' },
      reason: 'Amount acceptable',
      confidence: 0.8
    };
  }
}
```

**Step 2: Register the Agent**
```typescript
// app.ts
import { SentinelAgentSDK } from '@sentinel/ai-agent-sdk';
import { MyAgent } from './MyAgent';

const sdk = new SentinelAgentSDK({ network: 'cronos-testnet' });
sdk.registerAgent('my-agent', new MyAgent());
```

**Step 3: Use the Agent**
```typescript
const result = await sdk.executeAgent('my-agent', {
  contractId: 'vault-001',
  user: '0xabc...',
  customData: { amount: 50 }
});

console.log(result); // { action: { type: 'ALLOW' }, reason: '...', confidence: 0.8 }
```

### That's It! 🎉

**What you get:**
- ✅ Working custom agent
- ✅ Integrated with SDK
- ✅ Ready for production
- ✅ Type-safe with TypeScript

**Next Steps:**
- Add more complex logic in `decide()` method
- Use multiple input parameters from `context.customData`
- Return different action types: `ALLOW`, `BLOCK`, `LIMIT`, `REVIEW`
- Add metadata for debugging and analytics

---

## Table of Contents

1. [Basic Custom Agent](#1-basic-custom-agent)
2. [Threshold-Based Agent](#2-threshold-based-agent)
3. [AI-Powered Agent](#3-ai-powered-agent)
4. [Stateful Agent](#4-stateful-agent)
5. [Multi-Condition Agent](#5-multi-condition-agent)
6. [Time-Based Agent](#6-time-based-agent)
7. [External API Agent](#7-external-api-agent)
8. [Composite Agent](#8-composite-agent)
9. [Machine Learning Agent](#9-machine-learning-agent)
10. [Event-Driven Agent](#10-event-driven-agent)

---

## 1. Basic Custom Agent

**Use Case**: Simple business logic validation

### Manual Steps:
1. Create new file: `BasicCustomAgent.ts`
2. Import required types from SDK
3. Extend BaseAgent class
4. Define config object with agent metadata
5. Implement decide() method with your business logic
6. Export the class
7. Register agent in your main application
8. Test with sample data

```typescript
import { BaseAgent, AgentConfig, AgentContext, AgentDecision } from '@sentinel/ai-agent-sdk';

export class BasicCustomAgent extends BaseAgent {
  config: AgentConfig = {
    id: 'basic-custom',
    name: 'Basic Custom Agent',
    description: 'Simple validation logic',
    version: '1.0.0'
  };

  async decide(context: AgentContext): Promise<AgentDecision> {
    const { customData } = context;
    const amount = customData?.amount || 0;

    // Simple validation rule
    if (amount > 1000) {
      return {
        action: { type: 'BLOCK', value: amount },
        reason: 'Amount exceeds maximum limit of 1000',
        confidence: 0.95,
        metadata: { limit: 1000, actual: amount }
      };
    }

    return {
      action: { type: 'ALLOW', value: amount },
      reason: 'Amount within acceptable range',
      confidence: 0.9,
      metadata: { validated: true }
    };
  }
}

// Usage
const sdk = new SentinelAgentSDK({ network: 'cronos-testnet' });
sdk.registerAgent('basic', new BasicCustomAgent());

const result = await sdk.executeAgent('basic', {
  contractId: 'vault-001',
  user: '0xabc...',
  customData: { amount: 500 }
});
```

---

## 2. Threshold-Based Agent

**Use Case**: Multiple threshold validation with different actions

### Manual Steps:
1. Create file: `ThresholdAgent.ts`
2. Define threshold configuration object
3. Create helper method for tier multipliers
4. Implement threshold comparison logic
5. Map threshold levels to actions (ALLOW/LIMIT/BLOCK/REVIEW)
6. Add user tier support
7. Test with different user tiers and amounts
8. Configure thresholds for your use case

```typescript
export class ThresholdAgent extends BaseAgent {
  private thresholds = {
    low: 100,
    medium: 500,
    high: 1000,
    critical: 5000
  };

  config: AgentConfig = {
    id: 'threshold-agent',
    name: 'Threshold Agent',
    description: 'Multi-level threshold validation',
    version: '1.0.0'
  };

  async decide(context: AgentContext): Promise<AgentDecision> {
    const { customData } = context;
    const value = customData?.value || 0;
    const userTier = customData?.userTier || 'basic';

    // Adjust thresholds based on user tier
    const multiplier = this.getTierMultiplier(userTier);
    const adjustedThresholds = {
      low: this.thresholds.low * multiplier,
      medium: this.thresholds.medium * multiplier,
      high: this.thresholds.high * multiplier,
      critical: this.thresholds.critical * multiplier
    };

    if (value >= adjustedThresholds.critical) {
      return {
        action: { type: 'BLOCK', value: 0 },
        reason: 'Critical threshold exceeded - transaction blocked',
        confidence: 1.0,
        metadata: { 
          level: 'critical', 
          threshold: adjustedThresholds.critical,
          userTier 
        }
      };
    }

    if (value >= adjustedThresholds.high) {
      return {
        action: { type: 'LIMIT', value: adjustedThresholds.high },
        reason: 'High threshold exceeded - value capped',
        confidence: 0.95,
        metadata: { 
          level: 'high', 
          originalValue: value,
          cappedValue: adjustedThresholds.high 
        }
      };
    }

    if (value >= adjustedThresholds.medium) {
      return {
        action: { type: 'REVIEW', value: value },
        reason: 'Medium threshold exceeded - requires review',
        confidence: 0.8,
        metadata: { level: 'medium', requiresApproval: true }
      };
    }

    return {
      action: { type: 'ALLOW', value: value },
      reason: 'Value within normal limits',
      confidence: 0.9,
      metadata: { level: 'normal' }
    };
  }

  private getTierMultiplier(tier: string): number {
    const multipliers = {
      'basic': 1,
      'premium': 2,
      'enterprise': 5
    };
    return multipliers[tier] || 1;
  }
}
```

---

## 3. AI-Powered Agent

**Use Case**: Intelligent decision making using OpenAI

### Manual Steps:
1. Install OpenAI SDK: `npm install openai`
2. Get OpenAI API key from platform.openai.com
3. Create file: `AIAgent.ts`
4. Set up OpenAI client in constructor
5. Create prompt building method
6. Implement API call with error handling
7. Parse JSON response from AI
8. Add fallback logic for API failures
9. Set environment variable: `OPENAI_API_KEY=your_key`
10. Test with various transaction scenarios

```typescript
import { OpenAI } from 'openai';

export class AIAgent extends BaseAgent {
  private openai: OpenAI;
  private model: string;

  config: AgentConfig = {
    id: 'ai-agent',
    name: 'AI-Powered Agent',
    description: 'Uses OpenAI for intelligent analysis',
    version: '1.0.0'
  };

  constructor(apiKey: string, model: string = 'gpt-4') {
    super();
    this.openai = new OpenAI({ apiKey });
    this.model = model;
  }

  async decide(context: AgentContext): Promise<AgentDecision> {
    try {
      const prompt = this.buildPrompt(context);
      
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a DeFi risk assessment AI. Respond with JSON: {"action": "ALLOW|BLOCK|LIMIT", "reason": "explanation", "confidence": 0.0-1.0, "riskScore": 0-100}'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 200
      });

      const aiResponse = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        action: { 
          type: aiResponse.action || 'BLOCK',
          value: context.customData?.value 
        },
        reason: aiResponse.reason || 'AI analysis completed',
        confidence: Math.min(aiResponse.confidence || 0.5, 1.0),
        metadata: {
          aiModel: this.model,
          riskScore: aiResponse.riskScore,
          tokens: response.usage?.total_tokens
        }
      };

    } catch (error) {
      // Fallback to conservative decision
      return {
        action: { type: 'BLOCK' },
        reason: 'AI analysis failed - defaulting to safe mode',
        confidence: 0.3,
        metadata: { error: error.message, fallback: true }
      };
    }
  }

  private buildPrompt(context: AgentContext): string {
    return `
Analyze this DeFi transaction:
- User: ${context.user}
- Contract: ${context.contractId}
- Amount: ${context.customData?.amount || 'N/A'}
- Transaction Type: ${context.customData?.type || 'unknown'}
- User History: ${context.customData?.userHistory || 'new user'}
- Market Conditions: ${context.customData?.marketVolatility || 'normal'}

Assess the risk and provide a decision.
    `.trim();
  }
}

// Usage with environment variable
const aiAgent = new AIAgent(process.env.OPENAI_API_KEY!);
sdk.registerAgent('ai-risk', aiAgent);
```

---

## 4. Stateful Agent

**Use Case**: Track user behavior and adapt decisions over time

### Manual Steps:
1. Create file: `StatefulAgent.ts`
2. Define UserState interface for tracking data
3. Initialize Map for storing user states
4. Create getUserState() helper method
5. Implement state update logic in decide()
6. Add risk score calculation method
7. Create pattern detection algorithms
8. Add methods for state management (reset, get stats)
9. Test with multiple users and transactions
10. Monitor memory usage for production

```typescript
interface UserState {
  transactionCount: number;
  totalVolume: number;
  riskScore: number;
  lastActivity: Date;
  flags: string[];
}

export class StatefulAgent extends BaseAgent {
  private userStates = new Map<string, UserState>();
  private globalStats = {
    totalTransactions: 0,
    averageVolume: 0,
    riskEvents: 0
  };

  config: AgentConfig = {
    id: 'stateful-agent',
    name: 'Stateful Agent',
    description: 'Tracks user behavior over time',
    version: '1.0.0'
  };

  async decide(context: AgentContext): Promise<AgentDecision> {
    const userState = this.getUserState(context.user);
    const amount = context.customData?.amount || 0;

    // Update user state
    userState.transactionCount++;
    userState.totalVolume += amount;
    userState.lastActivity = new Date();

    // Update global stats
    this.globalStats.totalTransactions++;
    this.updateAverageVolume(amount);

    // Calculate dynamic risk score
    const riskScore = this.calculateRiskScore(userState, amount);
    userState.riskScore = riskScore;

    // Make decision based on risk score and patterns
    if (riskScore > 80) {
      userState.flags.push('high-risk');
      return {
        action: { type: 'BLOCK' },
        reason: `High risk score: ${riskScore}`,
        confidence: 0.95,
        metadata: { 
          riskScore, 
          userTransactions: userState.transactionCount,
          flags: userState.flags 
        }
      };
    }

    if (this.detectAnomalousPattern(userState, amount)) {
      userState.flags.push('anomalous-pattern');
      return {
        action: { type: 'REVIEW', value: amount },
        reason: 'Anomalous transaction pattern detected',
        confidence: 0.85,
        metadata: { 
          pattern: 'anomalous',
          userHistory: this.getUserSummary(userState) 
        }
      };
    }

    return {
      action: { type: 'ALLOW', value: amount },
      reason: 'Transaction approved based on user history',
      confidence: 0.9,
      metadata: { 
        riskScore,
        userTier: this.getUserTier(userState) 
      }
    };
  }

  private getUserState(user: string): UserState {
    if (!this.userStates.has(user)) {
      this.userStates.set(user, {
        transactionCount: 0,
        totalVolume: 0,
        riskScore: 50,
        lastActivity: new Date(),
        flags: []
      });
    }
    return this.userStates.get(user)!;
  }

  private calculateRiskScore(userState: UserState, currentAmount: number): number {
    let score = 0;

    // Volume-based risk
    const avgTransaction = userState.totalVolume / userState.transactionCount;
    if (currentAmount > avgTransaction * 3) score += 20;

    // Frequency-based risk
    if (userState.transactionCount > 100) score += 10;

    // Flag-based risk
    score += userState.flags.length * 15;

    // Time-based risk (rapid transactions)
    const timeSinceLastActivity = Date.now() - userState.lastActivity.getTime();
    if (timeSinceLastActivity < 60000) score += 25; // Less than 1 minute

    return Math.min(score, 100);
  }

  private detectAnomalousPattern(userState: UserState, amount: number): boolean {
    const avgAmount = userState.totalVolume / userState.transactionCount;
    return amount > avgAmount * 5 && userState.transactionCount > 5;
  }

  private getUserTier(userState: UserState): string {
    if (userState.totalVolume > 100000) return 'whale';
    if (userState.totalVolume > 10000) return 'premium';
    if (userState.transactionCount > 50) return 'active';
    return 'basic';
  }

  private getUserSummary(userState: UserState) {
    return {
      transactions: userState.transactionCount,
      volume: userState.totalVolume,
      avgTransaction: userState.totalVolume / userState.transactionCount,
      tier: this.getUserTier(userState)
    };
  }

  private updateAverageVolume(amount: number) {
    this.globalStats.averageVolume = 
      (this.globalStats.averageVolume * (this.globalStats.totalTransactions - 1) + amount) 
      / this.globalStats.totalTransactions;
  }

  // Public method to get user statistics
  public getUserStats(user: string) {
    return this.userStates.get(user) || null;
  }

  // Public method to reset user state
  public resetUserState(user: string) {
    this.userStates.delete(user);
  }
}
```

---

## 5. Multi-Condition Agent

**Use Case**: Complex business rules with multiple conditions

### Manual Steps:
1. Create file: `MultiConditionAgent.ts`
2. Define BusinessRule interface
3. Create array of rule objects with conditions
4. Implement rule evaluation logic
5. Add priority-based rule sorting
6. Create executeRule() method for each action type
7. Add helper methods (isWeekend, etc.)
8. Implement rule management methods (add/remove)
9. Test rule priority and conflicts
10. Document your business rules

```typescript
interface BusinessRule {
  id: string;
  condition: (context: AgentContext) => boolean;
  action: string;
  priority: number;
  reason: string;
}

export class MultiConditionAgent extends BaseAgent {
  private rules: BusinessRule[] = [
    {
      id: 'weekend-limit',
      condition: (ctx) => this.isWeekend() && (ctx.customData?.amount || 0) > 500,
      action: 'LIMIT',
      priority: 1,
      reason: 'Weekend transactions limited to 500'
    },
    {
      id: 'new-user-restriction',
      condition: (ctx) => ctx.customData?.accountAge < 30 && (ctx.customData?.amount || 0) > 1000,
      action: 'BLOCK',
      priority: 2,
      reason: 'New users cannot transact more than 1000'
    },
    {
      id: 'high-volatility-pause',
      condition: (ctx) => ctx.customData?.marketVolatility > 0.8,
      action: 'PAUSE',
      priority: 3,
      reason: 'High market volatility - transactions paused'
    },
    {
      id: 'vip-user-bypass',
      condition: (ctx) => ctx.customData?.userTier === 'vip',
      action: 'ALLOW',
      priority: 0,
      reason: 'VIP user - all restrictions bypassed'
    }
  ];

  config: AgentConfig = {
    id: 'multi-condition',
    name: 'Multi-Condition Agent',
    description: 'Complex business rule engine',
    version: '1.0.0'
  };

  async decide(context: AgentContext): Promise<AgentDecision> {
    // Sort rules by priority (lower number = higher priority)
    const sortedRules = this.rules.sort((a, b) => a.priority - b.priority);
    
    // Find first matching rule
    for (const rule of sortedRules) {
      if (rule.condition(context)) {
        return this.executeRule(rule, context);
      }
    }

    // Default action if no rules match
    return {
      action: { type: 'ALLOW', value: context.customData?.amount },
      reason: 'No specific rules triggered - default approval',
      confidence: 0.8,
      metadata: { rulesEvaluated: this.rules.length }
    };
  }

  private executeRule(rule: BusinessRule, context: AgentContext): AgentDecision {
    const amount = context.customData?.amount || 0;
    
    switch (rule.action) {
      case 'LIMIT':
        return {
          action: { type: 'LIMIT', value: 500 },
          reason: rule.reason,
          confidence: 0.9,
          metadata: { 
            ruleId: rule.id, 
            originalAmount: amount,
            limitedAmount: 500 
          }
        };
        
      case 'BLOCK':
        return {
          action: { type: 'BLOCK' },
          reason: rule.reason,
          confidence: 0.95,
          metadata: { ruleId: rule.id, blockedAmount: amount }
        };
        
      case 'PAUSE':
        return {
          action: { type: 'PAUSE' },
          reason: rule.reason,
          confidence: 0.85,
          metadata: { ruleId: rule.id, pauseDuration: '1h' }
        };
        
      default:
        return {
          action: { type: 'ALLOW', value: amount },
          reason: rule.reason,
          confidence: 0.9,
          metadata: { ruleId: rule.id }
        };
    }
  }

  private isWeekend(): boolean {
    const day = new Date().getDay();
    return day === 0 || day === 6; // Sunday = 0, Saturday = 6
  }

  // Method to add custom rules at runtime
  public addRule(rule: BusinessRule) {
    this.rules.push(rule);
  }

  // Method to remove rules
  public removeRule(ruleId: string) {
    this.rules = this.rules.filter(rule => rule.id !== ruleId);
  }

  // Method to get all active rules
  public getRules(): BusinessRule[] {
    return [...this.rules];
  }
}
```

---

## 6. Time-Based Agent

**Use Case**: Decisions based on time patterns and schedules

### Manual Steps:
1. Create file: `TimeBasedAgent.ts`
2. Define TimeWindow interface
3. Configure time windows array with schedules
4. Implement time parsing and comparison logic
5. Add timezone support
6. Create maintenance window detection
7. Add holiday checking logic
8. Implement time-based limit calculations
9. Test across different timezones
10. Configure for your business hours

```typescript
interface TimeWindow {
  start: string; // HH:MM format
  end: string;   // HH:MM format
  timezone: string;
  action: string;
  reason: string;
}

export class TimeBasedAgent extends BaseAgent {
  private timeWindows: TimeWindow[] = [
    {
      start: '09:00',
      end: '17:00',
      timezone: 'UTC',
      action: 'ALLOW',
      reason: 'Business hours - normal operations'
    },
    {
      start: '17:00',
      end: '21:00',
      timezone: 'UTC',
      action: 'LIMIT',
      reason: 'After hours - limited transactions'
    },
    {
      start: '21:00',
      end: '09:00',
      timezone: 'UTC',
      action: 'REVIEW',
      reason: 'Night hours - requires review'
    }
  ];

  config: AgentConfig = {
    id: 'time-based',
    name: 'Time-Based Agent',
    description: 'Time-aware transaction control',
    version: '1.0.0'
  };

  async decide(context: AgentContext): Promise<AgentDecision> {
    const now = new Date();
    const amount = context.customData?.amount || 0;
    const userTimezone = context.customData?.timezone || 'UTC';

    // Get current time window
    const currentWindow = this.getCurrentTimeWindow(now, userTimezone);
    
    // Check for special dates (holidays, maintenance)
    if (this.isMaintenanceWindow(now)) {
      return {
        action: { type: 'BLOCK' },
        reason: 'System maintenance in progress',
        confidence: 1.0,
        metadata: { maintenanceWindow: true }
      };
    }

    if (this.isHoliday(now)) {
      return {
        action: { type: 'LIMIT', value: Math.min(amount, 100) },
        reason: 'Holiday restrictions - limited transactions',
        confidence: 0.9,
        metadata: { holiday: true, maxAmount: 100 }
      };
    }

    // Apply time window rules
    switch (currentWindow.action) {
      case 'LIMIT':
        const limitAmount = this.calculateTimeBasedLimit(now, amount);
        return {
          action: { type: 'LIMIT', value: limitAmount },
          reason: currentWindow.reason,
          confidence: 0.85,
          metadata: { 
            timeWindow: currentWindow,
            originalAmount: amount,
            limitedAmount: limitAmount 
          }
        };

      case 'REVIEW':
        return {
          action: { type: 'REVIEW', value: amount },
          reason: currentWindow.reason,
          confidence: 0.8,
          metadata: { 
            timeWindow: currentWindow,
            requiresApproval: true 
          }
        };

      default:
        return {
          action: { type: 'ALLOW', value: amount },
          reason: currentWindow.reason,
          confidence: 0.9,
          metadata: { timeWindow: currentWindow }
        };
    }
  }

  private getCurrentTimeWindow(date: Date, timezone: string): TimeWindow {
    const timeStr = date.toLocaleTimeString('en-US', { 
      timeZone: timezone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });

    for (const window of this.timeWindows) {
      if (this.isTimeInWindow(timeStr, window)) {
        return window;
      }
    }

    // Default window
    return this.timeWindows[0];
  }

  private isTimeInWindow(timeStr: string, window: TimeWindow): boolean {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const currentMinutes = hours * 60 + minutes;

    const [startHours, startMinutes] = window.start.split(':').map(Number);
    const startTotalMinutes = startHours * 60 + startMinutes;

    const [endHours, endMinutes] = window.end.split(':').map(Number);
    let endTotalMinutes = endHours * 60 + endMinutes;

    // Handle overnight windows
    if (endTotalMinutes < startTotalMinutes) {
      endTotalMinutes += 24 * 60;
      if (currentMinutes < startTotalMinutes) {
        return currentMinutes + 24 * 60 >= startTotalMinutes && 
               currentMinutes + 24 * 60 < endTotalMinutes;
      }
    }

    return currentMinutes >= startTotalMinutes && currentMinutes < endTotalMinutes;
  }

  private calculateTimeBasedLimit(date: Date, amount: number): number {
    const hour = date.getUTCHours();
    
    // Reduce limits during off-hours
    if (hour >= 22 || hour < 6) {
      return Math.min(amount, 500); // Night limit
    } else if (hour >= 17) {
      return Math.min(amount, 1000); // Evening limit
    }
    
    return amount; // No limit during business hours
  }

  private isMaintenanceWindow(date: Date): boolean {
    // Example: Maintenance every Sunday 2-4 AM UTC
    const day = date.getUTCDay();
    const hour = date.getUTCHours();
    return day === 0 && hour >= 2 && hour < 4;
  }

  private isHoliday(date: Date): boolean {
    // Simple holiday check - in production, use a proper holiday library
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    
    // New Year's Day
    if (month === 0 && day === 1) return true;
    // Christmas
    if (month === 11 && day === 25) return true;
    
    return false;
  }

  // Method to add custom time windows
  public addTimeWindow(window: TimeWindow) {
    this.timeWindows.push(window);
  }

  // Method to get current status
  public getCurrentStatus(timezone: string = 'UTC') {
    const now = new Date();
    const window = this.getCurrentTimeWindow(now, timezone);
    return {
      currentTime: now.toISOString(),
      timezone,
      activeWindow: window,
      isMaintenanceWindow: this.isMaintenanceWindow(now),
      isHoliday: this.isHoliday(now)
    };
  }
}
```

---

## 7. External API Agent

**Use Case**: Integrate with external services for decision making

### Manual Steps:
1. Install axios: `npm install axios`
2. Create file: `ExternalAPIAgent.ts`
3. Get API keys from external providers
4. Configure API endpoints
5. Implement API call methods with timeout
6. Add Promise.allSettled for parallel calls
7. Create fallback logic for API failures
8. Implement confidence calculation
9. Add API connectivity test method
10. Set environment variables for API keys
11. Test with mock API responses first

```typescript
import axios from 'axios';

interface ExternalRiskData {
  riskScore: number;
  blacklisted: boolean;
  reputation: number;
  lastSeen: string;
}

export class ExternalAPIAgent extends BaseAgent {
  private apiEndpoints = {
    riskCheck: 'https://api.riskprovider.com/check',
    reputation: 'https://api.reputation.com/score',
    blacklist: 'https://api.blacklist.com/verify'
  };

  private apiKey: string;
  private timeout: number = 5000; // 5 second timeout

  config: AgentConfig = {
    id: 'external-api',
    name: 'External API Agent',
    description: 'Integrates with external risk APIs',
    version: '1.0.0'
  };

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }

  async decide(context: AgentContext): Promise<AgentDecision> {
    const { user, customData } = context;
    const amount = customData?.amount || 0;

    try {
      // Parallel API calls for better performance
      const [riskData, reputationScore, blacklistStatus] = await Promise.allSettled([
        this.checkRisk(user, amount),
        this.getReputationScore(user),
        this.checkBlacklist(user)
      ]);

      // Process results
      const risk = this.extractValue(riskData, { riskScore: 50, blacklisted: false });
      const reputation = this.extractValue(reputationScore, 50);
      const isBlacklisted = this.extractValue(blacklistStatus, false);

      // Make decision based on external data
      if (isBlacklisted) {
        return {
          action: { type: 'BLOCK' },
          reason: 'User is blacklisted by external provider',
          confidence: 0.99,
          metadata: { 
            blacklisted: true,
            source: 'external-blacklist' 
          }
        };
      }

      if (risk.riskScore > 80) {
        return {
          action: { type: 'BLOCK' },
          reason: `High risk score from external provider: ${risk.riskScore}`,
          confidence: 0.9,
          metadata: { 
            externalRiskScore: risk.riskScore,
            reputation,
            source: 'external-risk-api' 
          }
        };
      }

      if (reputation < 30) {
        return {
          action: { type: 'REVIEW', value: amount },
          reason: 'Low reputation score requires manual review',
          confidence: 0.8,
          metadata: { 
            reputationScore: reputation,
            threshold: 30 
          }
        };
      }

      // Calculate confidence based on external data quality
      const confidence = this.calculateConfidence(risk.riskScore, reputation);

      return {
        action: { type: 'ALLOW', value: amount },
        reason: 'External validation passed',
        confidence,
        metadata: {
          externalRiskScore: risk.riskScore,
          reputationScore: reputation,
          dataQuality: 'high'
        }
      };

    } catch (error) {
      // Fallback decision when external APIs fail
      return {
        action: { type: 'REVIEW', value: amount },
        reason: 'External API unavailable - requires manual review',
        confidence: 0.5,
        metadata: { 
          error: error.message,
          fallback: true,
          apiStatus: 'failed' 
        }
      };
    }
  }

  private async checkRisk(user: string, amount: number): Promise<ExternalRiskData> {
    const response = await axios.post(
      this.apiEndpoints.riskCheck,
      { address: user, amount },
      {
        headers: { 'Authorization': `Bearer ${this.apiKey}` },
        timeout: this.timeout
      }
    );
    return response.data;
  }

  private async getReputationScore(user: string): Promise<number> {
    const response = await axios.get(
      `${this.apiEndpoints.reputation}/${user}`,
      {
        headers: { 'Authorization': `Bearer ${this.apiKey}` },
        timeout: this.timeout
      }
    );
    return response.data.score;
  }

  private async checkBlacklist(user: string): Promise<boolean> {
    const response = await axios.get(
      `${this.apiEndpoints.blacklist}/${user}`,
      {
        headers: { 'Authorization': `Bearer ${this.apiKey}` },
        timeout: this.timeout
      }
    );
    return response.data.blacklisted;
  }

  private extractValue<T>(result: PromiseSettledResult<T>, defaultValue: T): T {
    return result.status === 'fulfilled' ? result.value : defaultValue;
  }

  private calculateConfidence(riskScore: number, reputation: number): number {
    // Higher confidence when both scores are good
    const riskConfidence = (100 - riskScore) / 100;
    const reputationConfidence = reputation / 100;
    return Math.min((riskConfidence + reputationConfidence) / 2, 0.95);
  }

  // Method to test API connectivity
  public async testConnectivity(): Promise<boolean> {
    try {
      await Promise.all([
        axios.get(this.apiEndpoints.riskCheck, { timeout: 3000 }),
        axios.get(this.apiEndpoints.reputation, { timeout: 3000 }),
        axios.get(this.apiEndpoints.blacklist, { timeout: 3000 })
      ]);
      return true;
    } catch {
      return false;
    }
  }
}
```

---

## 8. Composite Agent

**Use Case**: Combine multiple agents for complex decision making

### Manual Steps:
1. Create file: `CompositeAgent.ts`
2. Import all sub-agent classes
3. Set up Maps for agents and weights
4. Initialize sub-agents in constructor
5. Implement parallel decision gathering
6. Create weighted decision calculation
7. Add consensus logic for conflicting decisions
8. Implement sub-agent management methods
9. Test with different weight combinations
10. Monitor performance with multiple agents

```typescript
export class CompositeAgent extends BaseAgent {
  private subAgents: Map<string, BaseAgent> = new Map();
  private weights: Map<string, number> = new Map();

  config: AgentConfig = {
    id: 'composite-agent',
    name: 'Composite Agent',
    description: 'Combines multiple agents with weighted decisions',
    version: '1.0.0'
  };

  constructor() {
    super();
    this.initializeSubAgents();
  }

  private initializeSubAgents() {
    // Add sub-agents with their weights
    this.addSubAgent('risk', new BasicCustomAgent(), 0.4);
    this.addSubAgent('threshold', new ThresholdAgent(), 0.3);
    this.addSubAgent('time', new TimeBasedAgent(), 0.2);
    this.addSubAgent('reputation', new ExternalAPIAgent('demo-key'), 0.1);
  }

  async decide(context: AgentContext): Promise<AgentDecision> {
    const decisions: Array<{
      agentId: string;
      decision: AgentDecision;
      weight: number;
    }> = [];

    // Get decisions from all sub-agents
    for (const [agentId, agent] of this.subAgents) {
      try {
        const decision = await agent.decide(context);
        const weight = this.weights.get(agentId) || 0;
        decisions.push({ agentId, decision, weight });
      } catch (error) {
        // Log error but continue with other agents
        console.warn(`Sub-agent ${agentId} failed:`, error.message);
      }
    }

    if (decisions.length === 0) {
      return {
        action: { type: 'BLOCK' },
        reason: 'All sub-agents failed',
        confidence: 0.1,
        metadata: { error: 'no-decisions' }
      };
    }

    // Calculate weighted decision
    return this.calculateWeightedDecision(decisions, context);
  }

  private calculateWeightedDecision(
    decisions: Array<{ agentId: string; decision: AgentDecision; weight: number }>,
    context: AgentContext
  ): AgentDecision {
    let totalWeight = 0;
    let weightedConfidence = 0;
    const actionScores = new Map<string, number>();
    const reasons: string[] = [];
    const metadata: any = { subAgentDecisions: {} };

    // Process each decision
    for (const { agentId, decision, weight } of decisions) {
      totalWeight += weight;
      weightedConfidence += decision.confidence * weight;
      
      // Track action votes
      const actionType = decision.action.type;
      actionScores.set(actionType, (actionScores.get(actionType) || 0) + weight);
      
      // Collect reasons and metadata
      reasons.push(`${agentId}: ${decision.reason}`);
      metadata.subAgentDecisions[agentId] = {
        action: decision.action,
        confidence: decision.confidence,
        weight
      };
    }

    // Determine final action based on weighted votes
    let finalAction = 'ALLOW';
    let maxScore = 0;
    
    for (const [action, score] of actionScores) {
      if (score > maxScore) {
        maxScore = score;
        finalAction = action;
      }
    }

    // Apply consensus rules
    const blockScore = actionScores.get('BLOCK') || 0;
    const allowScore = actionScores.get('ALLOW') || 0;
    
    // If any significant weight votes BLOCK, be conservative
    if (blockScore > totalWeight * 0.3) {
      finalAction = 'BLOCK';
    }

    const finalConfidence = Math.min(weightedConfidence / totalWeight, 0.95);
    const amount = context.customData?.amount || 0;

    return {
      action: { 
        type: finalAction,
        value: finalAction === 'ALLOW' ? amount : 0
      },
      reason: `Composite decision: ${reasons.join('; ')}`,
      confidence: finalConfidence,
      metadata: {
        ...metadata,
        totalWeight,
        actionScores: Object.fromEntries(actionScores),
        consensusStrength: maxScore / totalWeight
      }
    };
  }

  // Method to add sub-agents
  public addSubAgent(id: string, agent: BaseAgent, weight: number) {
    this.subAgents.set(id, agent);
    this.weights.set(id, weight);
  }

  // Method to remove sub-agents
  public removeSubAgent(id: string) {
    this.subAgents.delete(id);
    this.weights.delete(id);
  }

  // Method to update weights
  public updateWeight(id: string, weight: number) {
    if (this.subAgents.has(id)) {
      this.weights.set(id, weight);
    }
  }

  // Method to get sub-agent status
  public getSubAgentStatus() {
    const status: any = {};
    for (const [id, agent] of this.subAgents) {
      status[id] = {
        config: agent.config,
        weight: this.weights.get(id)
      };
    }
    return status;
  }
}
```

---

## 9. Machine Learning Agent

**Use Case**: Use ML models for pattern recognition and prediction

### Manual Steps:
1. Create file: `MLAgent.ts`
    -Create packages/core/src/agents/builtin/MLAgent.ts
    -Add it to the exports in packages/core/src/agents/builtin/index.ts
    -Add it to the main SDK exports
1. Define MLModel interface
2. Create FeatureExtractor class
3. Implement feature extraction methods
4. Add model loading logic (placeholder)
5. Create fallback rule-based decision
6. Implement training data collection
7. Add model retraining method
8.  Create feature normalization
9.  Test with synthetic data first
10. Plan for model deployment and updates

```typescript
interface MLModel {
  predict(features: number[]): Promise<{ prediction: number; confidence: number }>;
}

interface TrainingData {
  features: number[];
  label: number; // 0 = allow, 1 = block
  timestamp: Date;
}

export class MLAgent extends BaseAgent {
  private model: MLModel | null = null;
  private trainingData: TrainingData[] = [];
  private featureExtractor: FeatureExtractor;

  config: AgentConfig = {
    id: 'ml-agent',
    name: 'Machine Learning Agent',
    description: 'Uses ML models for intelligent decisions',
    version: '1.0.0'
  };

  constructor() {
    super();
    this.featureExtractor = new FeatureExtractor();
    this.loadModel();
  }

  async decide(context: AgentContext): Promise<AgentDecision> {
    try {
      // Extract features from context
      const features = this.featureExtractor.extract(context);
      
      if (!this.model) {
        // Fallback to rule-based decision if model not available
        return this.fallbackDecision(context, features);
      }

      // Get ML prediction
      const { prediction, confidence } = await this.model.predict(features);
      
      // Convert ML output to decision
      const shouldBlock = prediction > 0.5;
      const adjustedConfidence = Math.min(confidence * 0.9, 0.95); // Cap ML confidence

      const decision: AgentDecision = {
        action: { 
          type: shouldBlock ? 'BLOCK' : 'ALLOW',
          value: shouldBlock ? 0 : context.customData?.amount 
        },
        reason: `ML model prediction: ${(prediction * 100).toFixed(1)}% risk`,
        confidence: adjustedConfidence,
        metadata: {
          mlPrediction: prediction,
          features: this.featureExtractor.getFeatureNames().reduce((obj, name, i) => {
            obj[name] = features[i];
            return obj;
          }, {} as any),
          modelVersion: '1.0'
        }
      };

      // Store decision for future training
      this.recordDecision(features, shouldBlock ? 1 : 0);

      return decision;

    } catch (error) {
      return {
        action: { type: 'REVIEW' },
        reason: 'ML model error - requires manual review',
        confidence: 0.3,
        metadata: { error: error.message, fallback: true }
      };
    }
  }

  private fallbackDecision(context: AgentContext, features: number[]): AgentDecision {
    // Simple rule-based fallback
    const amount = context.customData?.amount || 0;
    const riskScore = this.calculateRuleBasedRisk(features);

    if (riskScore > 0.8) {
      return {
        action: { type: 'BLOCK' },
        reason: 'Rule-based high risk detection',
        confidence: 0.7,
        metadata: { riskScore, fallback: true }
      };
    }

    return {
      action: { type: 'ALLOW', value: amount },
      reason: 'Rule-based approval',
      confidence: 0.6,
      metadata: { riskScore, fallback: true }
    };
  }

  private calculateRuleBasedRisk(features: number[]): number {
    // Simple weighted sum of normalized features
    const weights = [0.3, 0.2, 0.2, 0.1, 0.1, 0.1]; // Adjust based on feature importance
    let risk = 0;
    
    for (let i = 0; i < Math.min(features.length, weights.length); i++) {
      risk += features[i] * weights[i];
    }
    
    return Math.min(Math.max(risk, 0), 1);
  }

  private recordDecision(features: number[], label: number) {
    this.trainingData.push({
      features: [...features],
      label,
      timestamp: new Date()
    });

    // Keep only recent data (last 1000 decisions)
    if (this.trainingData.length > 1000) {
      this.trainingData = this.trainingData.slice(-1000);
    }
  }

  private async loadModel() {
    try {
      // In a real implementation, load from file or API
      // this.model = await loadModelFromFile('model.json');
      console.log('ML model loading not implemented - using fallback');
    } catch (error) {
      console.warn('Failed to load ML model:', error.message);
    }
  }

  // Method to retrain model with accumulated data
  public async retrainModel(): Promise<boolean> {
    if (this.trainingData.length < 100) {
      return false; // Need more data
    }

    try {
      // In a real implementation, retrain the model
      // this.model = await trainModel(this.trainingData);
      console.log(`Retraining with ${this.trainingData.length} samples`);
      return true;
    } catch (error) {
      console.error('Model retraining failed:', error.message);
      return false;
    }
  }

  // Method to get training data statistics
  public getTrainingStats() {
    const total = this.trainingData.length;
    const blocked = this.trainingData.filter(d => d.label === 1).length;
    const allowed = total - blocked;

    return {
      totalSamples: total,
      blockedSamples: blocked,
      allowedSamples: allowed,
      blockRate: total > 0 ? blocked / total : 0,
      oldestSample: this.trainingData[0]?.timestamp,
      newestSample: this.trainingData[total - 1]?.timestamp
    };
  }
}

class FeatureExtractor {
  extract(context: AgentContext): number[] {
    const { user, customData } = context;
    const amount = customData?.amount || 0;
    
    return [
      this.normalizeAmount(amount),                    // Feature 0: Transaction amount
      this.extractTimeFeature(),                       // Feature 1: Time of day
      this.extractUserFeature(user),                   // Feature 2: User hash
      customData?.userAge || 0,                        // Feature 3: Account age
      customData?.transactionCount || 0,               // Feature 4: User transaction count
      customData?.averageAmount || 0                   // Feature 5: User average amount
    ];
  }

  getFeatureNames(): string[] {
    return [
      'normalized_amount',
      'time_of_day',
      'user_hash',
      'user_age',
      'transaction_count',
      'average_amount'
    ];
  }

  private normalizeAmount(amount: number): number {
    // Log normalization for amount
    return Math.log(amount + 1) / Math.log(10000); // Normalize to 0-1 range
  }

  private extractTimeFeature(): number {
    const hour = new Date().getUTCHours();
    return hour / 24; // Normalize to 0-1 range
  }

  private extractUserFeature(user: string): number {
    // Simple hash of user address
    let hash = 0;
    for (let i = 0; i < user.length; i++) {
      hash = ((hash << 5) - hash + user.charCodeAt(i)) & 0xffffffff;
    }
    return Math.abs(hash) / 0xffffffff; // Normalize to 0-1 range
  }
}
```

---

## 10. Event-Driven Agent

**Use Case**: React to blockchain events and maintain event history

### Manual Steps:
1. Create file: `EventDrivenAgent.ts`
2. Define BlockchainEvent and EventPattern interfaces
3. Configure event patterns array
4. Implement event recording system
5. Create pattern analysis algorithms
6. Add sequence detection logic
7. Implement frequency analysis
8. Create cross-contract activity analysis
9. Add event cleanup for memory management
10. Test with simulated blockchain events
11. Configure patterns for your protocol

```typescript
interface BlockchainEvent {
  contractAddress: string;
  eventName: string;
  blockNumber: number;
  transactionHash: string;
  timestamp: Date;
  data: any;
}

interface EventPattern {
  name: string;
  events: string[];
  timeWindow: number; // milliseconds
  threshold: number;
  action: string;
  reason: string;
}

export class EventDrivenAgent extends BaseAgent {
  private eventHistory: BlockchainEvent[] = [];
  private eventPatterns: EventPattern[] = [
    {
      name: 'rapid-deposits',
      events: ['Deposit'],
      timeWindow: 60000, // 1 minute
      threshold: 5,
      action: 'REVIEW',
      reason: 'Rapid deposit pattern detected'
    },
    {
      name: 'large-withdrawals',
      events: ['Withdraw'],
      timeWindow: 300000, // 5 minutes
      threshold: 3,
      action: 'BLOCK',
      reason: 'Multiple large withdrawals detected'
    },
    {
      name: 'suspicious-sequence',
      events: ['Deposit', 'Swap', 'Withdraw'],
      timeWindow: 120000, // 2 minutes
      threshold: 1,
      action: 'BLOCK',
      reason: 'Suspicious transaction sequence'
    }
  ];

  config: AgentConfig = {
    id: 'event-driven',
    name: 'Event-Driven Agent',
    description: 'Reacts to blockchain event patterns',
    version: '1.0.0'
  };

  async decide(context: AgentContext): Promise<AgentDecision> {
    const { user, contractId, customData } = context;
    const amount = customData?.amount || 0;
    const eventType = customData?.eventType || 'Unknown';

    // Record current event
    const currentEvent: BlockchainEvent = {
      contractAddress: contractId,
      eventName: eventType,
      blockNumber: customData?.blockNumber || 0,
      transactionHash: customData?.txHash || '',
      timestamp: new Date(),
      data: customData
    };

    this.recordEvent(currentEvent);

    // Analyze event patterns
    const detectedPatterns = this.analyzePatterns(user, contractId);
    
    if (detectedPatterns.length > 0) {
      return this.handleDetectedPatterns(detectedPatterns, currentEvent);
    }

    // Check for anomalous event frequency
    const eventFrequency = this.calculateEventFrequency(user, eventType);
    if (eventFrequency.isAnomalous) {
      return {
        action: { type: 'REVIEW', value: amount },
        reason: `Anomalous ${eventType} frequency: ${eventFrequency.count} in ${eventFrequency.timeWindow}ms`,
        confidence: 0.8,
        metadata: {
          eventFrequency,
          eventType,
          anomalous: true
        }
      };
    }

    // Check for cross-contract patterns
    const crossContractRisk = this.analyzeCrossContractActivity(user);
    if (crossContractRisk.riskLevel > 0.7) {
      return {
        action: { type: 'LIMIT', value: Math.min(amount, 1000) },
        reason: 'High cross-contract activity risk',
        confidence: 0.85,
        metadata: {
          crossContractRisk,
          limitApplied: true
        }
      };
    }

    return {
      action: { type: 'ALLOW', value: amount },
      reason: 'No suspicious event patterns detected',
      confidence: 0.9,
      metadata: {
        eventType,
        patternsChecked: this.eventPatterns.length,
        eventHistorySize: this.eventHistory.length
      }
    };
  }

  private recordEvent(event: BlockchainEvent) {
    this.eventHistory.push(event);
    
    // Keep only recent events (last 24 hours)
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    this.eventHistory = this.eventHistory.filter(e => e.timestamp.getTime() > cutoff);
  }

  private analyzePatterns(user: string, contractId: string): EventPattern[] {
    const detectedPatterns: EventPattern[] = [];
    const now = Date.now();

    for (const pattern of this.eventPatterns) {
      const relevantEvents = this.eventHistory.filter(event => 
        event.data?.user === user &&
        event.contractAddress === contractId &&
        now - event.timestamp.getTime() <= pattern.timeWindow &&
        pattern.events.includes(event.eventName)
      );

      if (pattern.events.length === 1) {
        // Single event type pattern
        if (relevantEvents.length >= pattern.threshold) {
          detectedPatterns.push(pattern);
        }
      } else {
        // Sequence pattern
        if (this.detectSequencePattern(relevantEvents, pattern)) {
          detectedPatterns.push(pattern);
        }
      }
    }

    return detectedPatterns;
  }

  private detectSequencePattern(events: BlockchainEvent[], pattern: EventPattern): boolean {
    if (events.length < pattern.events.length) return false;

    // Sort events by timestamp
    const sortedEvents = events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    // Look for the sequence in the events
    let patternIndex = 0;
    for (const event of sortedEvents) {
      if (event.eventName === pattern.events[patternIndex]) {
        patternIndex++;
        if (patternIndex === pattern.events.length) {
          return true; // Complete sequence found
        }
      }
    }

    return false;
  }

  private handleDetectedPatterns(patterns: EventPattern[], currentEvent: BlockchainEvent): AgentDecision {
    // Use the most severe pattern
    const severityOrder = ['BLOCK', 'REVIEW', 'LIMIT', 'ALLOW'];
    let mostSeverePattern = patterns[0];
    
    for (const pattern of patterns) {
      if (severityOrder.indexOf(pattern.action) < severityOrder.indexOf(mostSeverePattern.action)) {
        mostSeverePattern = pattern;
      }
    }

    const amount = currentEvent.data?.amount || 0;

    switch (mostSeverePattern.action) {
      case 'BLOCK':
        return {
          action: { type: 'BLOCK' },
          reason: mostSeverePattern.reason,
          confidence: 0.9,
          metadata: {
            detectedPatterns: patterns.map(p => p.name),
            triggerPattern: mostSeverePattern.name,
            eventCount: this.eventHistory.length
          }
        };

      case 'LIMIT':
        return {
          action: { type: 'LIMIT', value: Math.min(amount, 500) },
          reason: mostSeverePattern.reason,
          confidence: 0.85,
          metadata: {
            detectedPatterns: patterns.map(p => p.name),
            originalAmount: amount,
            limitedAmount: 500
          }
        };

      default:
        return {
          action: { type: 'REVIEW', value: amount },
          reason: mostSeverePattern.reason,
          confidence: 0.8,
          metadata: {
            detectedPatterns: patterns.map(p => p.name),
            requiresManualReview: true
          }
        };
    }
  }

  private calculateEventFrequency(user: string, eventType: string) {
    const timeWindows = [60000, 300000, 900000]; // 1min, 5min, 15min
    const now = Date.now();
    
    for (const window of timeWindows) {
      const recentEvents = this.eventHistory.filter(event =>
        event.data?.user === user &&
        event.eventName === eventType &&
        now - event.timestamp.getTime() <= window
      );

      // Define normal frequency thresholds
      const normalThresholds = {
        60000: 3,   // 3 events per minute
        300000: 10, // 10 events per 5 minutes
        900000: 20  // 20 events per 15 minutes
      };

      if (recentEvents.length > normalThresholds[window]) {
        return {
          isAnomalous: true,
          count: recentEvents.length,
          timeWindow: window,
          threshold: normalThresholds[window]
        };
      }
    }

    return { isAnomalous: false, count: 0, timeWindow: 0, threshold: 0 };
  }

  private analyzeCrossContractActivity(user: string) {
    const now = Date.now();
    const timeWindow = 300000; // 5 minutes
    
    const recentEvents = this.eventHistory.filter(event =>
      event.data?.user === user &&
      now - event.timestamp.getTime() <= timeWindow
    );

    const uniqueContracts = new Set(recentEvents.map(e => e.contractAddress));
    const contractCount = uniqueContracts.size;
    
    // Risk increases with more contracts involved
    const riskLevel = Math.min(contractCount / 5, 1); // Max risk at 5+ contracts

    return {
      riskLevel,
      contractCount,
      uniqueContracts: Array.from(uniqueContracts),
      eventCount: recentEvents.length,
      timeWindow
    };
  }

  // Method to add custom event patterns
  public addEventPattern(pattern: EventPattern) {
    this.eventPatterns.push(pattern);
  }

  // Method to get event statistics
  public getEventStats() {
    const now = Date.now();
    const last24h = this.eventHistory.filter(e => now - e.timestamp.getTime() <= 24 * 60 * 60 * 1000);
    
    const eventTypes = new Map<string, number>();
    const contracts = new Map<string, number>();
    
    for (const event of last24h) {
      eventTypes.set(event.eventName, (eventTypes.get(event.eventName) || 0) + 1);
      contracts.set(event.contractAddress, (contracts.get(event.contractAddress) || 0) + 1);
    }

    return {
      totalEvents: this.eventHistory.length,
      last24hEvents: last24h.length,
      eventTypes: Object.fromEntries(eventTypes),
      activeContracts: Object.fromEntries(contracts),
      patternsConfigured: this.eventPatterns.length
    };
  }

  // Method to clear old events
  public clearOldEvents(maxAge: number = 24 * 60 * 60 * 1000) {
    const cutoff = Date.now() - maxAge;
    this.eventHistory = this.eventHistory.filter(e => e.timestamp.getTime() > cutoff);
  }
}
```

---

## Usage Examples

### Basic Usage
```typescript
import { SentinelAgentSDK } from '@sentinel/ai-agent-sdk';
import { BasicCustomAgent, ThresholdAgent, AIAgent } from './custom-agents';

const sdk = new SentinelAgentSDK({
  network: 'cronos-testnet',
  rpcUrl: 'https://evm-t3.cronos.org'
});

// Register multiple custom agents
sdk.registerAgent('basic', new BasicCustomAgent());
sdk.registerAgent('threshold', new ThresholdAgent());
sdk.registerAgent('ai', new AIAgent(process.env.OPENAI_API_KEY!));

// Execute agents
const result1 = await sdk.executeAgent('basic', {
  contractId: 'vault-001',
  user: '0xabc...',
  customData: { amount: 500 }
});

const result2 = await sdk.executeAgent('threshold', {
  contractId: 'vault-001',
  user: '0xdef...',
  customData: { value: 1500, userTier: 'premium' }
});
```

### Advanced Composite Setup
```typescript
const compositeAgent = new CompositeAgent();
compositeAgent.addSubAgent('risk', new BasicCustomAgent(), 0.3);
compositeAgent.addSubAgent('time', new TimeBasedAgent(), 0.2);
compositeAgent.addSubAgent('ml', new MLAgent(), 0.3);
compositeAgent.addSubAgent('events', new EventDrivenAgent(), 0.2);

sdk.registerAgent('composite', compositeAgent);
```

## 🛠️ Complete Setup Guide

### Step 1: Project Setup
```bash
# Create your custom agent project
mkdir my-custom-agents
cd my-custom-agents
npm init -y

# Install dependencies
npm install @sentinel/ai-agent-sdk
npm install --save-dev typescript ts-node @types/node

# Create TypeScript config
echo '{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true
  }
}' > tsconfig.json
```

### Step 2: Create Agent Files
```bash
# Create agents directory
mkdir agents

# Create your first agent
touch agents/BasicCustomAgent.ts
touch agents/ThresholdAgent.ts
# ... create other agent files as needed
```

### Step 3: Main Application Setup
```bash
# Create main application file
touch index.ts
```

**index.ts:**
```typescript
import { SentinelAgentSDK } from '@sentinel/ai-agent-sdk';
import { BasicCustomAgent } from './agents/BasicCustomAgent';
import { ThresholdAgent } from './agents/ThresholdAgent';

async function main() {
  const sdk = new SentinelAgentSDK({
    network: 'cronos-testnet',
    rpcUrl: 'https://evm-t3.cronos.org'
  });

  // Register your custom agents
  sdk.registerAgent('basic', new BasicCustomAgent());
  sdk.registerAgent('threshold', new ThresholdAgent());

  // Test your agents
  const result = await sdk.executeAgent('basic', {
    contractId: 'test-contract',
    user: '0x123...',
    customData: { amount: 500 }
  });

  console.log('Agent Result:', result);
}

main().catch(console.error);
```

### Step 4: Environment Configuration
```bash
# Create environment file
touch .env
```

**.env:**
```
OPENAI_API_KEY=your_openai_key_here
RISK_API_KEY=your_risk_api_key_here
CRONOS_RPC_URL=https://evm-t3.cronos.org
```

### Step 5: Testing Setup
```bash
# Create test file
touch test.ts
```

**test.ts:**
```typescript
import { BasicCustomAgent } from './agents/BasicCustomAgent';

async function testAgent() {
  const agent = new BasicCustomAgent();
  
  const testCases = [
    { amount: 100 },   // Should ALLOW
    { amount: 1500 },  // Should BLOCK
    { amount: 500 }    // Should ALLOW
  ];

  for (const testCase of testCases) {
    const result = await agent.decide({
      contractId: 'test',
      user: '0xtest',
      customData: testCase
    });
    
    console.log(`Amount: ${testCase.amount}, Action: ${result.action.type}, Reason: ${result.reason}`);
  }
}

testAgent();
```

### Step 6: Run Your Agents
```bash
# Run main application
npx ts-node index.ts

# Run tests
npx ts-node test.ts
```

### Step 7: Production Deployment
```bash
# Build for production
npx tsc

# Run compiled JavaScript
node dist/index.js
```

## 📋 Quick Checklist

**For Each Agent Type:**
- [ ] Create agent file in `agents/` directory
- [ ] Import required types from SDK
- [ ] Extend BaseAgent class
- [ ] Define config object
- [ ] Implement decide() method
- [ ] Add error handling
- [ ] Create test cases
- [ ] Register in main application
- [ ] Test with sample data
- [ ] Document configuration options

**For Production:**
- [ ] Add comprehensive error handling
- [ ] Implement logging
- [ ] Add monitoring and metrics
- [ ] Set up environment variables
- [ ] Create deployment scripts
- [ ] Add unit tests
- [ ] Document API endpoints (if using External API Agent)
- [ ] Set up CI/CD pipeline

## 🔧 Common Issues & Solutions

**Issue**: Agent not registering
**Solution**: Check that class extends BaseAgent and config is properly defined

**Issue**: TypeScript errors
**Solution**: Ensure all imports are correct and types match SDK interfaces

**Issue**: API timeouts (External API Agent)
**Solution**: Increase timeout values and add retry logic

**Issue**: Memory usage (Stateful/Event-Driven Agents)
**Solution**: Implement data cleanup and set maximum storage limits

**Issue**: ML model not loading
**Solution**: Implement proper fallback logic and model validation

This guide provides complete implementations for 10 different types of custom agents, each designed for specific use cases in DeFi and blockchain applications. Each agent can be used independently or combined for more sophisticated decision-making systems.