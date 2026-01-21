import { BaseAgent } from '../BaseAgent';
import { AgentContext, AgentDecision } from '../types';

export interface PaymentContext {
  amount: number;
  currency: string;
  paymentMethod?: string;
  userId?: string;
}

export interface PaymentAction {
  type: 'PAYMENT_REQUIRED' | 'PAYMENT_APPROVED' | 'PAYMENT_FAILED';
  amount?: number;
  currency?: string;
  transactionId?: string;
  reason: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export class X402PaymentAgent extends BaseAgent {
  config = {
    id: 'x402-payment-agent',
    name: 'x402 Payment Agent',
    description: 'Handles HTTP 402 payment-required flows for micropayments and pay-per-use APIs',
    version: '1.0.0'
  };

  async decide(context: AgentContext): Promise<AgentDecision> {
    this.validateContext(context);

    const { amount, currency, paymentMethod, userId } = context.customData as PaymentContext;

    if (!amount || !currency) {
      throw new Error('X402PaymentAgent requires amount and currency in customData');
    }

    // Payment thresholds
    const microPaymentThreshold = 1.0; // $1 USD equivalent
    const standardPaymentThreshold = 10.0; // $10 USD equivalent

    // Determine payment requirement
    if (amount <= 0) {
      return {
        action: {
          type: 'PAYMENT_FAILED',
          reason: 'Invalid payment amount',
          severity: 'HIGH'
        } as PaymentAction,
        reason: 'Payment amount must be greater than zero',
        confidence: 1.0
      };
    }

    // Micropayment - auto-approve
    if (amount < microPaymentThreshold) {
      return {
        action: {
          type: 'PAYMENT_APPROVED',
          amount,
          currency,
          transactionId: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          reason: 'Micropayment auto-approved',
          severity: 'LOW'
        } as PaymentAction,
        reason: `Micropayment of ${amount} ${currency} approved automatically`,
        confidence: 0.95
      };
    }

    // Standard payment - require confirmation
    if (amount < standardPaymentThreshold) {
      return {
        action: {
          type: 'PAYMENT_REQUIRED',
          amount,
          currency,
          reason: 'Payment confirmation required',
          severity: 'MEDIUM'
        } as PaymentAction,
        reason: `Payment of ${amount} ${currency} requires user confirmation`,
        confidence: 0.9
      };
    }

    // Large payment - require enhanced verification
    return {
      action: {
        type: 'PAYMENT_REQUIRED',
        amount,
        currency,
        reason: 'Enhanced verification required for large payment',
        severity: 'HIGH'
      } as PaymentAction,
      reason: `Large payment of ${amount} ${currency} requires enhanced verification`,
      confidence: 0.85
    };
  }

  // Helper method to process payment
  async processPayment(amount: number, currency: string, paymentMethod: string): Promise<{
    success: boolean;
    transactionId?: string;
    error?: string;
  }> {
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock success (in production, this would call actual payment provider)
      return {
        success: true,
        transactionId: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing failed'
      };
    }
  }
}
