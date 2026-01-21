import { BaseAgent } from './BaseAgent';
import { AgentContext, AgentDecision } from './types';

export interface GeniusActConfig {
  maxTransactionAmount: bigint;
  whitelistedTokens: string[];
  requireKYC: boolean;
  dailyLimit: bigint;
}

export class GeniusActComplianceAgent extends BaseAgent {
  config = {
    id: 'genius-act-compliance',
    name: 'Genius Act Compliance Agent',
    description: 'Validates token transactions against Genius Act regulations',
    version: '1.0.0'
  };

  private complianceConfig: GeniusActConfig;

  constructor(config: GeniusActConfig) {
    super();
    this.complianceConfig = config;
  }

  async decide(context: AgentContext): Promise<AgentDecision> {
    const { tokenAddress, amount, userAddress } = context.customData;

    // Check 1: Token whitelist
    if (!this.isTokenWhitelisted(tokenAddress)) {
      return {
        action: { 
          type: 'BLOCK', 
          reason: 'Token not approved under Genius Act regulations' 
        },
        reason: 'Token not approved under Genius Act regulations',
        confidence: 1.0,
        metadata: { 
          complianceCheck: 'failed',
          violation: 'non-whitelisted-token',
          tokenAddress 
        }
      };
    }

    // Check 2: Transaction amount limits
    if (amount > this.complianceConfig.maxTransactionAmount) {
      return {
        action: { 
          type: 'BLOCK', 
          reason: 'Transaction exceeds Genius Act maximum limit' 
        },
        reason: 'Transaction exceeds Genius Act maximum limit',
        confidence: 1.0,
        metadata: { 
          complianceCheck: 'failed',
          violation: 'amount-exceeded',
          amount: amount.toString(),
          limit: this.complianceConfig.maxTransactionAmount.toString()
        }
      };
    }

    // Check 3: KYC requirement (simplified)
    if (this.complianceConfig.requireKYC && !this.isKYCCompliant(userAddress)) {
      return {
        action: { 
          type: 'BLOCK', 
          reason: 'User KYC verification required for Genius Act compliance' 
        },
        reason: 'User KYC verification required for Genius Act compliance',
        confidence: 0.9,
        metadata: { 
          complianceCheck: 'failed',
          violation: 'kyc-required',
          userAddress 
        }
      };
    }

    return {
      action: { type: 'ALLOW' },
      reason: 'All Genius Act compliance checks passed',
      confidence: 1.0,
      metadata: { 
        complianceCheck: 'passed',
        tokenAddress,
        amount: amount.toString()
      }
    };
  }

  private isTokenWhitelisted(tokenAddress: string): boolean {
    return this.complianceConfig.whitelistedTokens
      .map(addr => addr.toLowerCase())
      .includes(tokenAddress.toLowerCase());
  }

  private isKYCCompliant(userAddress: string): boolean {
    // Simplified KYC check - in production, integrate with KYC provider
    // For now, assume addresses starting with '0x1' are KYC verified
    return userAddress.toLowerCase().startsWith('0x1');
  }
}