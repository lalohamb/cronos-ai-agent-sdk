import { APIServer } from '../APIServer';
import { SentinelAgentSDK } from '../../SentinelAgentSDK';
import { PaymentProvider, PaymentRequest, PaymentResult, PaymentVerification } from '../../payments/types';

class MockPaymentProvider implements PaymentProvider {
  id = 'mock-provider';
  name = 'Mock Provider';
  
  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    if (request.amount < 0) {
      return {
        success: false,
        error: {
          code: 'PAYMENT_REQUIRED',
          message: 'Payment required',
          statusCode: 402,
          retryable: false
        }
      };
    }
    
    return {
      success: true,
      transactionId: 'mock-tx-123'
    };
  }
  
  async verifyPayment(transactionId: string): Promise<PaymentVerification> {
    return {
      verified: true,
      status: 'confirmed',
      confirmations: 6
    };
  }
}

function createTestSDK(): SentinelAgentSDK {
  const mockProvider = new MockPaymentProvider();
  return new SentinelAgentSDK({
    network: 'cronos-testnet',
    rpcUrl: 'https://evm-t3.cronos.org',
    payments: {
      providers: [mockProvider],
      defaultProvider: 'mock-provider',
      retryConfig: { maxAttempts: 3, baseDelay: 100, maxDelay: 1000 }
    }
  });
}

describe('APIServer x402 Integration', () => {
  let apiServer: APIServer;
  let sdk: SentinelAgentSDK;

  beforeEach(async () => {
    sdk = createTestSDK();
    apiServer = new APIServer(sdk);
    await sdk.start();
  });

  test('should return 402 for payment required', async () => {
    const response = await apiServer.handleRequest('POST', '/payments', {
      amount: -1,
      currency: 'USD',
      recipient: 'test'
    });

    expect(response.status).toBe(402);
    expect(response.data?.paymentRequired).toBe(true);
  });

  test('should process valid payment', async () => {
    const response = await apiServer.handleRequest('POST', '/payments', {
      amount: 10,
      currency: 'USD',
      recipient: 'test-recipient'
    });

    expect(response.status).toBe(200);
    expect(response.data?.success).toBe(true);
  });
});