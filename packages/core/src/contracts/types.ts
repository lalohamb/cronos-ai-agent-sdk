import { Contract, Interface } from 'ethers';

export interface ContractConfig {
  address: string;
  abi: any[];
  network: string;
  name?: string;
}

export interface ContractAdapter {
  contract: Contract;
  config: ContractConfig;
  getContract(): Contract;
  getAddress(): string;
  getNetwork(): string;
  call(method: string, ...args: any[]): Promise<any>;
}