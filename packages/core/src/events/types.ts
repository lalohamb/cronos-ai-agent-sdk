import { Log } from 'ethers';

export type EventHandler = (event: Log, ...args: any[]) => Promise<void> | void;

export interface EventSubscription {
  contractId: string;
  eventName: string;
  handler: EventHandler;
  unsubscribe(): void;
}