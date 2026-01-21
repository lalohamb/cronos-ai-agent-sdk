import { useState, useEffect } from 'react';
import { SentinelAgentSDK, SDKConfig } from '@sentinel/ai-agent-sdk';

export function useAgentSDK(config: SDKConfig) {
  const [sdk, setSdk] = useState<SentinelAgentSDK | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeSDK = async () => {
      try {
        const agentSDK = new SentinelAgentSDK(config);
        
        if (mounted) {
          setSdk(agentSDK);
          setIsReady(true);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to initialize SDK');
          setIsReady(false);
        }
      }
    };

    initializeSDK();

    return () => {
      mounted = false;
    };
  }, [config]);

  return { sdk, isReady, error };
}
