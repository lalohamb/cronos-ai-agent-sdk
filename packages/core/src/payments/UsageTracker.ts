import { UsageRecord } from './types';

export class UsageTracker {
  private records: UsageRecord[] = [];
  private callbacks: ((record: UsageRecord) => void)[] = [];

  track(userId: string, service: string, amount: number, currency: string, metadata?: Record<string, any>): UsageRecord {
    const record: UsageRecord = {
      id: this.generateId(),
      userId,
      service,
      amount,
      currency,
      timestamp: new Date(),
      metadata
    };

    this.records.push(record);
    this.callbacks.forEach(callback => callback(record));
    
    return record;
  }

  getUsage(userId: string, startDate?: Date, endDate?: Date): UsageRecord[] {
    return this.records.filter(record => {
      if (record.userId !== userId) return false;
      if (startDate && record.timestamp < startDate) return false;
      if (endDate && record.timestamp > endDate) return false;
      return true;
    });
  }

  getTotalUsage(userId: string, currency: string, startDate?: Date, endDate?: Date): number {
    return this.getUsage(userId, startDate, endDate)
      .filter(record => record.currency === currency)
      .reduce((total, record) => total + record.amount, 0);
  }

  onUsage(callback: (record: UsageRecord) => void): void {
    this.callbacks.push(callback);
  }

  private generateId(): string {
    return `usage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}