import { useState, useEffect } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  amount: number;
  currency: string;
  onClose: () => void;
  onPaymentComplete: (transactionId: string, provider: string) => void;
  onPaymentFailed: (error: string) => void;
}

export default function PaymentModal({
  isOpen,
  amount,
  currency,
  onClose,
  onPaymentComplete,
  onPaymentFailed
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<'wallet' | 'square' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ 
          method: 'eth_accounts' 
        });
        if (accounts.length > 0) {
          setWalletConnected(true);
          setWalletAddress(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking wallet:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      onPaymentFailed('No wallet detected. Please install MetaMask or another Web3 wallet.');
      return;
    }

    try {
      setIsProcessing(true);
      const accounts = await (window as any).ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      setWalletConnected(true);
      setWalletAddress(accounts[0]);
      setIsProcessing(false);
    } catch (error) {
      setIsProcessing(false);
      onPaymentFailed('Failed to connect wallet');
    }
  };

  const processWalletPayment = async () => {
    if (!walletConnected) {
      await connectWallet();
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate payment processing (in production, use SDK's PaymentManager)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const txId = `wallet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      onPaymentComplete(txId, 'wallet');
    } catch (error) {
      onPaymentFailed('Wallet payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const processSquarePayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate Square payment (in production, use SquareProvider)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const txId = `sqr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      onPaymentComplete(txId, 'square');
    } catch (error) {
      onPaymentFailed('Square payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Complete Payment</h3>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Amount Display */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-center">
            <p className="text-sm text-gray-600 mb-1">Payment Amount</p>
            <p className="text-3xl font-bold text-gray-900">
              ${amount.toFixed(2)} <span className="text-lg text-gray-600">{currency}</span>
            </p>
          </div>

          {/* Payment Method Selection */}
          {!selectedMethod ? (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700 mb-3">Select Payment Method:</p>
              
              {/* Wallet Option */}
              <button
                onClick={() => setSelectedMethod('wallet')}
                className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Crypto Wallet</p>
                      <p className="text-sm text-gray-500">MetaMask, WalletConnect</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              {/* Square Option */}
              <button
                onClick={() => setSelectedMethod('square')}
                className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Credit/Debit Card</p>
                      <p className="text-sm text-gray-500">Powered by Square</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          ) : (
            <div>
              {/* Back Button */}
              <button
                onClick={() => setSelectedMethod(null)}
                disabled={isProcessing}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to payment methods
              </button>

              {/* Wallet Payment */}
              {selectedMethod === 'wallet' && (
                <div className="space-y-4">
                  {walletConnected ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <p className="text-sm font-medium text-green-800">Wallet Connected</p>
                      </div>
                      <p className="text-xs text-green-700 font-mono">
                        {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">Please connect your wallet to continue</p>
                    </div>
                  )}

                  <button
                    onClick={processWalletPayment}
                    disabled={isProcessing}
                    className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : walletConnected ? (
                      `Pay $${amount.toFixed(2)} with Wallet`
                    ) : (
                      'Connect Wallet'
                    )}
                  </button>
                </div>
              )}

              {/* Square Payment */}
              {selectedMethod === 'square' && (
                <div className="space-y-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-3">Enter card details:</p>
                    <div id="card-container" className="min-h-[100px] bg-white rounded border border-gray-300 p-3">
                      {/* Square card form will be injected here */}
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Card Number"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isProcessing}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isProcessing}
                          />
                          <input
                            type="text"
                            placeholder="CVV"
                            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isProcessing}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={processSquarePayment}
                    disabled={isProcessing}
                    className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      `Pay $${amount.toFixed(2)} with Card`
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    Secured by Square • PCI DSS Compliant
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            🔒 Your payment information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
}
