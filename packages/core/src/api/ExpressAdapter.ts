import { APIServer } from './APIServer';
import { SentinelAgentSDK } from '../SentinelAgentSDK';

export class ExpressAdapter {
  private apiServer: APIServer;

  constructor(sdk: SentinelAgentSDK) {
    this.apiServer = new APIServer(sdk);
  }

  getRoutes() {
    return {
      'POST /agents/execute': this.executeAgent.bind(this),
      'GET /agents': this.listAgents.bind(this),
      'POST /contracts': this.registerContract.bind(this),
      'GET /contracts': this.listContracts.bind(this),
      'POST /payments': this.processPayment.bind(this),
      'POST /webhooks/events': this.handleWebhook.bind(this),
      'GET /usage/:userId': this.getUsage.bind(this)
    };
  }

  private async executeAgent(req: any, res: any) {
    const response = await this.apiServer.handleRequest('POST', '/agents/execute', req.body);
    res.status(response.status).json(response.data || { error: response.error });
  }

  private async listAgents(req: any, res: any) {
    const response = await this.apiServer.handleRequest('GET', '/agents');
    res.status(response.status).json(response.data || { error: response.error });
  }

  private async registerContract(req: any, res: any) {
    const response = await this.apiServer.handleRequest('POST', '/contracts', req.body);
    res.status(response.status).json(response.data || { error: response.error });
  }

  private async listContracts(req: any, res: any) {
    const response = await this.apiServer.handleRequest('GET', '/contracts');
    res.status(response.status).json(response.data || { error: response.error });
  }

  private async processPayment(req: any, res: any) {
    const response = await this.apiServer.handleRequest('POST', '/payments', req.body);
    res.status(response.status).json(response.data || { error: response.error });
  }

  private async handleWebhook(req: any, res: any) {
    const response = await this.apiServer.handleRequest('POST', '/webhooks/events', req.body);
    res.status(response.status).json(response.data || { error: response.error });
  }

  private async getUsage(req: any, res: any) {
    const response = await this.apiServer.handleRequest('GET', `/usage/${req.params.userId}`);
    res.status(response.status).json(response.data || { error: response.error });
  }
}