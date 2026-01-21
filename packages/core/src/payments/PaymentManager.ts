import { PaymentProvider, PaymentRequest, PaymentResult, PaymentConfig, PaymentError } from './types';
import { Logger } from '../utils/logger';

export class PaymentManager {
  private providers = new Map<string, PaymentProvider>();
  private defaultProvider?: string;
  private retryConfig: { maxAttempts: number; baseDelay: number; maxDelay: number };
  private logger: Logger;

  constructor(config: PaymentConfig) {
    this.logger = new Logger('PaymentManager');
    this.retryConfig = config.retryConfig || { maxAttempts: 3, baseDelay: 1000, maxDelay: 10000 };
    
    config.providers.forEach(provider => {
      this.providers.set(provider.id, provider);
    });
    
    this.defaultProvider = config.defaultProvider || config.providers[0]?.id;
  }

  async processPayment(request: PaymentRequest, providerId?: string): Promise<PaymentResult> {
    const provider = this.getProvider(providerId);
    return this.executeWithRetry(request, provider);
  }

  async verifyPayment(transactionId: string, providerId?: string): Promise<boolean> {
    const provider = this.getProvider(providerId);
    const verification = await provider.verifyPayment(transactionId);
    return verification.verified && verification.status === 'confirmed';
  }

  private getProvider(providerId?: string): PaymentProvider {
    const id = providerId || this.defaultProvider;
    if (!id) throw new Error('No payment provider specified');
    
    const provider = this.providers.get(id);
    if (!provider) throw new Error(`Payment provider not found: ${id}`);
    
    return provider;
  }

  private async executeWithRetry(request: PaymentRequest, provider: PaymentProvider): Promise<PaymentResult> {
    let lastError: PaymentError | undefined;
    
    for (let attempt = 0; attempt < this.retryConfig.maxAttempts; attempt++) {
      try {
        const result = await provider.processPayment({ ...request, retryCount: attempt });
        
        if (result.success) return result;
        
        if (result.error && !result.error.retryable) {
          return result;
        }
        
        lastError = result.error;
        
        if (attempt < this.retryConfig.maxAttempts - 1) {
          const delay = Math.min(
            this.retryConfig.baseDelay * Math.pow(2, attempt),
            this.retryConfig.maxDelay
          );
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error) {
        lastError = {
          code: 'PROVIDER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          statusCode: 500,
          retryable: true
        };
      }
    }
    
    return {
      success: false,
      error: lastError || {
        code: 'MAX_RETRIES_EXCEEDED',
        message: 'Maximum retry attempts exceeded',
        statusCode: 402,
        retryable: false
      }
    };
  }
}