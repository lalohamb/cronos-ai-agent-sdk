import { Contract, Provider } from 'ethers';
import { ContractConfig } from './types';

export class ContractAdapter {
  public contract: Contract;
  public config: ContractConfig;

  constructor(config: ContractConfig, provider: Provider) {
    this.config = config;
    this.contract = new Contract(config.address, config.abi, provider);
  }

  getContract(): Contract {
    return this.contract;
  }

  getAddress(): string {
    return this.config.address;
  }

  getNetwork(): string {
    return this.config.network;
  }

  async call(method: string, ...args: any[]): Promise<any> {
    if (typeof this.contract[method] !== 'function') {
      throw new Error(`Method '${method}' not found on contract`);
    }
    return await this.contract[method](...args);
  }
}