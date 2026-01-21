export interface APIRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  body?: any;
  headers?: Record<string, string>;
}

export interface APIResponse {
  status: number;
  data?: any;
  error?: string;
}

export interface AgentExecuteRequest {
  agentId: string;
  context: {
    contractId: string;
    user: string;
    customData?: Record<string, any>;
  };
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  recipient: string;
  providerId?: string;
}

export interface WebhookEvent {
  contractId: string;
  eventName: string;
  data: any;
  blockNumber: number;
  transactionHash: string;
}