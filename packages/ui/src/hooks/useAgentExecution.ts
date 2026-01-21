import { useState } from 'react';

export function useAgentExecution(sdk: any) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const execute = async (agentId: string, context: any) => {
    if (!sdk) return;
    if (!context.contractId || !context.user) {
      setError('contractId and user are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const decision = await sdk.executeAgent(agentId, context);
      setResult(decision);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Execution failed');
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, result, error };
}
