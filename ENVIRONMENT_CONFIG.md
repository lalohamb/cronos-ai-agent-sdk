# Environment Configuration Guide

This guide explains how to configure API keys, private keys, and other sensitive configuration for the Cronos AI Agent SDK.

## Quick Setup

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your actual values:**
   ```bash
   nano .env  # or your preferred editor
   ```

3. **Never commit `.env` files** - they're already in `.gitignore`

## Required Configuration

### Private Key (Required for transactions)
```env
AGENT_PRIVATE_KEY=0x1234567890abcdef...
```
- **Where to get:** Export from MetaMask or generate with `ethers.Wallet.createRandom()`
- **Security:** Never share or commit this key
- **Format:** 64-character hex string with `0x` prefix

### OpenAI API Key (Optional - for AI agents)
```env
OPENAI_API_KEY=sk-proj-1234567890abcdef...
```
- **Where to get:** [OpenAI API Keys](https://platform.openai.com/api-keys)
- **Required for:** AI-powered decision making in agents
- **Cost:** Pay-per-use based on OpenAI pricing

## Optional Configuration

### Custom RPC URLs
```env
CRONOS_MAINNET_RPC=https://evm.cronos.org
CRONOS_TESTNET_RPC=https://evm-t3.cronos.org
```

### Contract Addresses
```env
VAULT_CONTRACT_ADDRESS=0x123...
DEX_CONTRACT_ADDRESS=0x456...
```

### x402 Payment System
```env
X402_PAYMENT_ENDPOINT=https://your-payment-server.com
X402_API_KEY=your_x402_api_key
```

## Per-Package Configuration

Each package/example can have its own `.env` file:

- **Root:** `/cronos-ai-agent-sdk/.env` - Global defaults
- **Core:** `/packages/core/.env` - SDK testing
- **Examples:** `/packages/examples/*//.env` - Example-specific config

## Environment Loading

The SDK automatically loads environment variables using:

```typescript
import { config } from 'dotenv';
config(); // Loads .env file

const sdk = new SentinelAgentSDK({
  privateKey: process.env.AGENT_PRIVATE_KEY,
  aiApiKey: process.env.OPENAI_API_KEY
});
```

## Security Best Practices

1. **Never commit `.env` files** - use `.env.example` templates
2. **Use different keys for different environments** (dev/staging/prod)
3. **Rotate keys regularly**
4. **Use environment-specific key restrictions** when possible
5. **Monitor key usage** for unauthorized access

## Troubleshooting

### "Private key required" error
- Ensure `AGENT_PRIVATE_KEY` is set in your `.env` file
- Check the key format (64 hex chars with `0x` prefix)

### "OpenAI API key invalid" error  
- Verify your `OPENAI_API_KEY` is correct
- Check your OpenAI account has sufficient credits

### "Contract not found" error
- Ensure contract addresses are correct for your network
- Verify the contract is deployed on the target network

## Example .env File

```env
# Required
AGENT_PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef

# Optional
OPENAI_API_KEY=sk-proj-1234567890abcdef1234567890abcdef1234567890abcdef
VAULT_CONTRACT_ADDRESS=0x123456789012345678901234567890123456789
CRONOS_TESTNET_RPC=https://evm-t3.cronos.org
```