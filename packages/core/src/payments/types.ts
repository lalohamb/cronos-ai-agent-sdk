export interface PaymentProvider {
  id: string;
  name: string;
  processPayment(request: PaymentRequest): Promise<PaymentResult>;
  verifyPayment(transactionId: string): Promise<PaymentVerification>;
  getBalance?(address: string): Promise<number>;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  recipient: string;
  metadata?: Record<string, any>;
  retryCount?: number;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: PaymentError;
  requiresRetry?: boolean;
}

export interface PaymentError {
  code: string;
  message: string;
  statusCode: number;
  retryable: boolean;
}

export interface PaymentVerification {
  verified: boolean;
  status: 'pending' | 'confirmed' | 'failed';
  confirmations?: number;
}

export interface UsageRecord {
  id: string;
  userId: string;
  service: string;
  amount: number;
  currency: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface BillingConfig {
  provider: string;
  apiKey: string;
  webhookSecret?: string;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface MobileWalletConfig {
  provider: 'apple-pay' | 'google-pay' | 'samsung-pay';
  merchantId: string;
  environment: 'sandbox' | 'production';
}

export interface EnterpriseConnectorConfig {
  type: 'sap' | 'oracle' | 'quickbooks' | 'custom';
  endpoint: string;
  credentials: Record<string, string>;
}

export interface PaymentConfig {
  providers: PaymentProvider[];
  defaultProvider?: string;
  billing?: BillingConfig;
  mobileWallets?: MobileWalletConfig[];
  enterpriseConnectors?: EnterpriseConnectorConfig[];
  retryConfig?: {
    maxAttempts: number;
    baseDelay: number;
    maxDelay: number;
  };
}