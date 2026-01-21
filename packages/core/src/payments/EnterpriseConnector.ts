import { EnterpriseConnectorConfig, UsageRecord } from './types';

export class EnterpriseConnector {
  private connectors = new Map<string, EnterpriseConnectorConfig>();

  constructor(configs: EnterpriseConnectorConfig[]) {
    configs.forEach(config => {
      this.connectors.set(config.type, config);
    });
  }

  async syncBillingData(type: string, records: UsageRecord[]): Promise<boolean> {
    const config = this.connectors.get(type);
    if (!config) return false;

    try {
      const payload = this.formatForConnector(type, records);
      
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(config)
        },
        body: JSON.stringify(payload)
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  private formatForConnector(type: string, records: UsageRecord[]): any {
    switch (type) {
      case 'sap':
        return {
          invoiceData: records.map(r => ({
            documentNumber: r.id,
            amount: r.amount,
            currency: r.currency,
            date: r.timestamp.toISOString(),
            customer: r.userId
          }))
        };
      case 'oracle':
        return {
          transactions: records.map(r => ({
            transactionId: r.id,
            customerId: r.userId,
            amount: r.amount,
            currencyCode: r.currency,
            transactionDate: r.timestamp
          }))
        };
      case 'quickbooks':
        return {
          items: records.map(r => ({
            Id: r.id,
            Name: r.service,
            UnitPrice: r.amount,
            QtyOnHand: 1
          }))
        };
      default:
        return { records };
    }
  }

  private getAuthHeaders(config: EnterpriseConnectorConfig): Record<string, string> {
    const headers: Record<string, string> = {};
    
    if (config.credentials.apiKey) {
      headers['Authorization'] = `Bearer ${config.credentials.apiKey}`;
    }
    
    if (config.credentials.username && config.credentials.password) {
      const auth = btoa(`${config.credentials.username}:${config.credentials.password}`);
      headers['Authorization'] = `Basic ${auth}`;
    }

    return headers;
  }
}