import { SentinelAgentSDK } from '../SentinelAgentSDK';
import { WebhookEvent } from './types';

export class WebhookHandler {
  constructor(private sdk: SentinelAgentSDK) {}

  async processEvent(event: WebhookEvent): Promise<void> {
    try {
      // Execute relevant agents based on the event
      const agentIds = this.getRelevantAgents(event);
      
      for (const agentId of agentIds) {
        await this.sdk.executeAgent(agentId, {
          contractId: event.contractId,
          user: event.data.user || '0x0',
          customData: {
            eventName: event.eventName,
            eventData: event.data,
            blockNumber: event.blockNumber,
            transactionHash: event.transactionHash
          }
        });
      }
    } catch (error) {
      console.error('Webhook processing failed:', error);
    }
  }

  private getRelevantAgents(event: WebhookEvent): string[] {
    const agents: string[] = [];
    
    // Map events to relevant agents
    switch (event.eventName) {
      case 'Deposited':
      case 'Withdrawn':
        agents.push('risk-monitor', 'threshold-guard');
        break;
      case 'LiquidityAdded':
      case 'LiquidityRemoved':
        agents.push('liquidity-optimizer');
        break;
      case 'EmergencyStop':
        agents.push('emergency-brake');
        break;
      default:
        agents.push('anomaly-detector');
    }
    
    return agents;
  }

  createWebhookEndpoint() {
    return async (req: any, res: any) => {
      try {
        const event: WebhookEvent = req.body;
        await this.processEvent(event);
        res.status(200).json({ success: true });
      } catch (error) {
        res.status(500).json({ error: 'Webhook processing failed' });
      }
    };
  }
}