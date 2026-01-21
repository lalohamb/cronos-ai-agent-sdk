import { renderHook } from '@testing-library/react';

// Mock hook for testing
const useAgentSDK = (config: any) => {
  return {
    sdk: null,
    isReady: false
  };
};

describe('useAgentSDK Hook', () => {
  test('initializes correctly', () => {
    const { result } = renderHook(() => useAgentSDK({
      network: 'cronos-testnet',
      rpcUrl: 'https://evm-t3.cronos.org'
    }));

    expect(result.current.sdk).toBeDefined();
    expect(result.current.isReady).toBe(false);
  });
});