import { SentinelAgentSDK, PaymentConfig, MobileWalletConfig, EnterpriseConnectorConfig } from '../index';

// Example: Complete x402 Payment Integration Setup
async function setupPaymentIntegration() {
  // Configure mobile wallets
  const mobileWallets: MobileWalletConfig[] = [
    {
      provider: 'apple-pay',
      merchantId: 'merchant.com.example.app',
      environment: 'sandbox'
    },
    {
      provider: 'google-pay',
      merchantId: 'BCR2DN4T2QVQJZRD',
      environment: 'sandbox'
    }
  ];

  // Configure enterprise connectors
  const enterpriseConnectors: EnterpriseConnectorConfig[] = [
    {
      type: 'sap',
      endpoint: 'https://api.sap.com/billing',
      credentials: {
        apiKey: 'your-sap-api-key',
        clientId: 'your-client-id'
      }
    },
    {
      type: 'quickbooks',
      endpoint: 'https://sandbox-quickbooks.api.intuit.com',
      credentials: {
        accessToken: 'your-access-token',
        companyId: 'your-company-id'
      }
    }
  ];

  // Payment configuration
  const paymentConfig: PaymentConfig = {
    providers: [], // CronosProvider will be auto-added if wallet is available
    defaultProvider: 'cronos',
    mobileWallets,
    enterpriseConnectors,
    retryConfig: {
      maxAttempts: 3,
      baseDelay: 1000,
      maxDelay: 10000
    }
  };

  // Initialize SDK with payment integration
  const sdk = new SentinelAgentSDK({
    network: 'cronos-testnet',
    rpcUrl: 'https://evm-t3.cronos.org',
    privateKey: 'your-private-key',
    payments: paymentConfig
  });

  await sdk.start();

  // Example: Process payment with automatic retry
  try {
    const result = await sdk.processPayment(
      0.1, // amount
      'CRO', // currency
      '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6' // recipient
    );

    if (result.success) {
      console.log('Payment successful:', result.transactionId);
    } else if (result.error?.statusCode === 402) {
      console.log('Payment required - handle 402 error');
    }
  } catch (error) {
    console.error('Payment failed:', error);
  }

  // Example: Track usage for billing
  sdk.trackUsage('user123', 'ai-inference', 0.05, 'USD');
  
  // Example: Get usage data
  const usageTracker = sdk.getUsageTracker();
  if (usageTracker) {
    const usage = usageTracker.getUsage('user123');
    console.log('User usage:', usage);
  }

  return sdk;
}

// Example: Handle 402 Payment Required errors
async function handle402Error(sdk: SentinelAgentSDK, userId: string) {
  const paymentManager = sdk.getPaymentManager();
  if (!paymentManager) return;

  try {
    // Attempt payment to resolve 402 error
    const result = await paymentManager.processPayment({
      amount: 10, // $10 credit
      currency: 'USD',
      recipient: 'service-wallet-address'
    });

    if (result.success) {
      console.log('Payment processed, service access restored');
      return true;
    } else {
      console.log('Payment failed, retrying with different provider');
      return false;
    }
  } catch (error) {
    console.error('Payment error:', error);
    return false;
  }
}

export { setupPaymentIntegration, handle402Error };