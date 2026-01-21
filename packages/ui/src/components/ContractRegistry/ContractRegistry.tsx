import React, { useState } from 'react';

interface ContractRegistryProps {
  sdk: any;
}

export function ContractRegistry({ sdk }: ContractRegistryProps) {
  const [id, setId] = useState('');
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState('cronos-testnet');
  const [abi, setAbi] = useState('[]');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    try {
      const parsedAbi = JSON.parse(abi);
      await sdk.registerContract(id, { address, abi: parsedAbi, network });
      setMessage('Contract registered successfully');
      setId('');
      setAddress('');
      setAbi('[]');
    } catch (err) {
      setMessage(`Error: ${err instanceof Error ? err.message : 'Registration failed'}`);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Contract Registry</h2>

      <div style={{ marginBottom: '10px' }}>
        <label>Contract ID:</label>
        <input value={id} onChange={(e) => setId(e.target.value)} style={{ width: '100%', padding: '8px' }} />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Address:</label>
        <input value={address} onChange={(e) => setAddress(e.target.value)} style={{ width: '100%', padding: '8px' }} />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Network:</label>
        <input value={network} onChange={(e) => setNetwork(e.target.value)} style={{ width: '100%', padding: '8px' }} />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>ABI (JSON):</label>
        <textarea value={abi} onChange={(e) => setAbi(e.target.value)} rows={6} style={{ width: '100%', padding: '8px' }} />
      </div>

      <button onClick={handleRegister} style={{ padding: '10px 20px', cursor: 'pointer' }}>
        Register Contract
      </button>

      {message && <div style={{ marginTop: '10px', color: message.startsWith('Error') ? 'red' : 'green' }}>{message}</div>}
    </div>
  );
}
