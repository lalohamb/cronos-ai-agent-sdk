import { SentinelAgentSDK } from '../SentinelAgentSDK';
import { APIResponse, AgentExecuteRequest, PaymentRequest, WebhookEvent } from './types';

export class APIServer {
  constructor(private sdk: SentinelAgentSDK) {}

  async handleRequest(method: string, path: string, body?: any): Promise<APIResponse> {
    try {
      const route = `${method} ${path}`;
      
      switch (route) {
        case 'POST /agents/execute':
          return this.executeAgent(body);
        case 'GET /agents':
          return this.listAgents();
        case 'POST /contracts':
          return this.registerContract(body);
        case 'GET /contracts':
          return this.listContracts();
        case 'POST /payments':
          return this.processPayment(body);
        case 'POST /webhooks/events':
          return this.handleWebhook(body);
        case 'GET /usage/:userId':
          return this.getUsage(path.split('/')[2]);
        default:
          return { status: 404, error: 'Not found' };
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('Payment required')) {
        return { status: 402, error: 'Payment required', data: { paymentRequired: true } };
      }
      return { status: 500, error: error instanceof Error ? error.message : 'Internal error' };
    }
  }

  private async executeAgent(request: AgentExecuteRequest): Promise<APIResponse> {
    const context = {
      contractId: request.context.contractId,
      user: request.context.user,
      customData: request.context.customData || {}
    };
    const decision = await this.sdk.executeAgent(request.agentId, context);
    return { status: 200, data: decision };
  }

  private async listAgents(): Promise<APIResponse> {
    // Return empty array for now - would need SDK method to list agents
    return { status: 200, data: [] };
  }

  private async registerContract(body: any): Promise<APIResponse> {
    await this.sdk.registerContract(body.id, body.config);
    return { status: 201, data: { message: 'Contract registered' } };
  }

  private async listContracts(): Promise<APIResponse> {
    // Return empty array for now - would need SDK method to list contracts
    return { status: 200, data: [] };
  }

  private async processPayment(request: PaymentRequest): Promise<APIResponse> {
    const result = await this.sdk.processPayment(
      request.amount,
      request.currency,
      request.recipient,
      request.providerId
    );
    
    if (!result.success && result.error?.statusCode === 402) {
      return { 
        status: 402, 
        data: { ...result, paymentRequired: true } 
      };
    }
    
    return { status: result.success ? 200 : 402, data: result };
  }

  private async handleWebhook(event: WebhookEvent): Promise<APIResponse> {
    // Process webhook event
    return { status: 200, data: { received: true } };
  }

  private async getUsage(userId: string): Promise<APIResponse> {
    const tracker = this.sdk.getUsageTracker();
    if (!tracker) return { status: 404, error: 'Usage tracking not enabled' };
    
    const usage = tracker.getUsage(userId);
    return { status: 200, data: usage };
  }
}