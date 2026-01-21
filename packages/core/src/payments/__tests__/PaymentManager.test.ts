import { PaymentManager } from '../PaymentManager';
import { PaymentProvider, PaymentRequest, PaymentResult } from '../types';

class MockPaymentProvider implements PaymentProvider {
  id = 'mock';
  name = 'Mock Provider';

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    if (request.amount < 0) {
      return {
        success: false,
        error: {
          code: 'INVALID_AMOUNT',
          message: 'Amount must be positive',
          statusCode: 400,
          retryable: false
        }
      };
    }

    if (request.retryCount && request.retryCount < 2) {
      return {
        success: false,
        error: {
          code: 'PAYMENT_REQUIRED',
          message: 'Payment required',
          statusCode: 402,
          retryable: true
        },
        requiresRetry: true
      };
    }

    return {
      success: true,
      transactionId: `mock_${Date.now()}`
    };
  }

  async verifyPayment(transactionId: string) {
    return {
      verified: true,
      status: 'confirmed' as const,
      confirmations: 6
    };
  }
}

describe('PaymentManager', () => {
  let paymentManager: PaymentManager;
  let mockProvider: MockPaymentProvider;

  beforeEach(() => {
    mockProvider = new MockPaymentProvider();
    paymentManager = new PaymentManager({
      providers: [mockProvider],
      defaultProvider: 'mock',
      retryConfig: {
        maxAttempts: 3,
        baseDelay: 100,
        maxDelay: 1000
      }
    });
  });

  test('should process payment successfully', async () => {
    const request: PaymentRequest = {
      amount: 10,
      currency: 'USD',
      recipient: 'test-recipient'
    };

    const result = await paymentManager.processPayment(request);
    expect(result.success).toBe(true);
    expect(result.transactionId).toBeDefined();
  });

  test('should handle 402 errors with retry', async () => {
    const request: PaymentRequest = {
      amount: 5,
      currency: 'USD',
      recipient: 'test-recipient'
    };

    const result = await paymentManager.processPayment(request);
    expect(result.success).toBe(true);
  });

  test('should verify payment', async () => {
    const verified = await paymentManager.verifyPayment('test-tx-id');
    expect(verified).toBe(true);
  });

  test('should handle invalid amounts', async () => {
    const request: PaymentRequest = {
      amount: -10,
      currency: 'USD',
      recipient: 'test-recipient'
    };

    const result = await paymentManager.processPayment(request);
    expect(result.success).toBe(false);
    expect(result.error?.statusCode).toBe(400);
  });
});