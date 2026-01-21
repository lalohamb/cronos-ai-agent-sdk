import { Provider } from 'ethers';
import { ContractAdapter } from './ContractAdapter';
import { ContractConfig } from './types';

export class ContractRegistry {
  private contracts: Map<string, ContractAdapter> = new Map();
  private provider: Provider;

  constructor(provider: Provider) {
    this.provider = provider;
  }

  register(id: string, config: ContractConfig): ContractAdapter {
    if (this.contracts.has(id)) {
      throw new Error(`Contract with id '${id}' already registered`);
    }

    const adapter = new ContractAdapter(config, this.provider);
    this.contracts.set(id, adapter);
    return adapter;
  }

  unregister(id: string): boolean {
    return this.contracts.delete(id);
  }

  get(id: string): ContractAdapter | undefined {
    return this.contracts.get(id);
  }

  has(id: string): boolean {
    return this.contracts.has(id);
  }

  list(): string[] {
    return Array.from(this.contracts.keys());
  }

  clear(): void {
    this.contracts.clear();
  }
}