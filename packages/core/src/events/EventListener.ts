import { ContractRegistry } from '../contracts/ContractRegistry';
import { EventHandler, EventSubscription } from './types';

export class EventListener {
  private contractRegistry: ContractRegistry;
  private subscriptions: Map<string, EventSubscription> = new Map();

  constructor(contractRegistry: ContractRegistry) {
    this.contractRegistry = contractRegistry;
  }

  subscribe(contractId: string, eventName: string, handler: EventHandler): EventSubscription {
    const contract = this.contractRegistry.get(contractId);
    if (!contract) {
      throw new Error(`Contract '${contractId}' not found`);
    }

    const subscriptionId = `${contractId}:${eventName}:${Date.now()}`;
    
    const listener = async (...args: any[]) => {
      const event = args[args.length - 1]; // Last argument is the event log
      await handler(event, ...args.slice(0, -1));
    };

    contract.contract.on(eventName, listener);

    const subscription: EventSubscription = {
      contractId,
      eventName,
      handler,
      unsubscribe: () => {
        contract.contract.off(eventName, listener);
        this.subscriptions.delete(subscriptionId);
      }
    };

    this.subscriptions.set(subscriptionId, subscription);
    return subscription;
  }

  unsubscribeAll(): void {
    for (const subscription of this.subscriptions.values()) {
      subscription.unsubscribe();
    }
    this.subscriptions.clear();
  }
}