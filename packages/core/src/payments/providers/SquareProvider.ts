import { PaymentProvider, PaymentRequest, PaymentResult } from '../types';

export interface SquareConfig {
  applicationId: string;
  locationId: string;
  environment: 'sandbox' | 'production';
}

export class SquareProvider implements PaymentProvider {
  id = 'square';
  name = 'Square Payment';
  private config: SquareConfig;
  private payments: any;

  constructor(config: SquareConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    // Load Square Web Payments SDK
    if (typeof window !== 'undefined' && !(window as any).Square) {
      await this.loadSquareSDK();
    }
    
    if ((window as any).Square) {
      this.payments = (window as any).Square.payments(
        this.config.applicationId,
        this.config.locationId
      );
    }
  }

  private async loadSquareSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = this.config.environment === 'sandbox'
        ? 'https://sandbox.web.squarecdn.com/v1/square.js'
        : 'https://web.squarecdn.com/v1/square.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Square SDK'));
      document.head.appendChild(script);
    });
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    try {
      if (!this.payments) {
        await this.initialize();
      }

      // Create card payment
      const card = await this.payments.card();
      await card.attach('#card-container');

      // Tokenize card
      const tokenResult = await card.tokenize();
      
      if (tokenResult.status === 'OK') {
        // In production, send token to your backend to process payment
        // For now, simulate success
        return {
          success: true,
          transactionId: `sqr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
      }

      return {
        success: false,
        error: {
          code: 'TOKENIZATION_FAILED',
          message: tokenResult.errors?.[0]?.message || 'Card tokenization failed',
          statusCode: 400,
          retryable: true
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'PAYMENT_FAILED',
          message: error instanceof Error ? error.message : 'Payment processing failed',
          statusCode: 500,
          retryable: true
        }
      };
    }
  }

  async verifyPayment(transactionId: string): Promise<{
    verified: boolean;
    status: 'pending' | 'confirmed' | 'failed';
    confirmations?: number;
  }> {
    // In production, verify with Square API
    return {
      verified: true,
      status: 'confirmed',
      confirmations: 1
    };
  }
}
