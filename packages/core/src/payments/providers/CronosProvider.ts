import { PaymentProvider, PaymentRequest, PaymentResult, PaymentVerification } from '../types';
import { PaymentErrorHandler } from '../ErrorHandler';
import { JsonRpcProvider, Wallet, parseEther } from 'ethers';

export class CronosProvider implements PaymentProvider {
  id = 'cronos';
  name = 'Cronos Network';

  constructor(
    private provider: JsonRpcProvider,
    private wallet: Wallet
  ) {}

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    try {
      const tx = await this.wallet.sendTransaction({
        to: request.recipient,
        value: parseEther(request.amount.toString()),
        gasLimit: 21000
      });

      return {
        success: true,
        transactionId: tx.hash
      };
    } catch (error) {
      return {
        success: false,
        error: PaymentErrorHandler.mapError(error),
        requiresRetry: true
      };
    }
  }

  async verifyPayment(transactionId: string): Promise<PaymentVerification> {
    try {
      const receipt = await this.provider.getTransactionReceipt(transactionId);
      
      if (!receipt) {
        return { verified: false, status: 'pending' };
      }

      return {
        verified: receipt.status === 1,
        status: receipt.status === 1 ? 'confirmed' : 'failed',
        confirmations: receipt.blockNumber ? await this.provider.getBlockNumber() - receipt.blockNumber : 0
      };
    } catch {
      return { verified: false, status: 'failed' };
    }
  }

  async getBalance(address: string): Promise<number> {
    const balance = await this.provider.getBalance(address);
    return parseFloat(balance.toString()) / 1e18;
  }
}