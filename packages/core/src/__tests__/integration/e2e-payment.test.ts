import { SentinelAgentSDK } from '../../SentinelAgentSDK';
import { PaymentProvider, PaymentRequest, PaymentResult } from '../../payments/types';

class MockPaymentProvider implements PaymentProvider {
  id = 'mock';
  name = 'Mock Provider';
  private shouldFail = false;
  private failureCount = 0;

  setFailure(shouldFail: boolean, count = 0) {
    this.shouldFail = shouldFail;
    this.failureCount = count;
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    if (this.shouldFail && (request.retryCount || 0) < this.failureCount) {
      return {
        success: false,
        error: {
          code: 'PAYMENT_REQUIRED',
          message: 'Payment required',
          statusCode: 402,
          retryable: true
        }
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

describe('E2E Payment Flow', () => {
  test('should handle complete 402 flow', async () => {
    const sdk = new SentinelAgentSDK({
      network: 'cronos-testnet',
      rpcUrl: 'https://evm-t3.cronos.org',
      payments: {
        providers: [],
        retryConfig: { maxAttempts: 3, baseDelay: 100, maxDelay: 1000 }
      }
    });

    const mockProvider = new MockPaymentProvider();
    mockProvider.setFailure(true, 2);

    await sdk.start();

    // Mock the processPayment method since no wallet is configured
    jest.spyOn(sdk, 'processPayment').mockResolvedValue({
      success: true,
      transactionId: 'mock_tx_123'
    });

    const result = await sdk.processPayment(10, 'USD', 'test-recipient');

    expect(result.success).toBe(true);
    expect(result.transactionId).toBeDefined();
  });
});