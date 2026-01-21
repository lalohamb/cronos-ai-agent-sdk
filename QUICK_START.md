# Quick Start - Test SDK in 2 Minutes

## Option 1: Test Without Any Setup (Recommended)

```bash
# 1. Install dependencies
cd packages/core
npm install

# 2. Build SDK
npm run build

# 3. Run standalone test
cd ../examples/standalone-test
npm install
npm test
```

**Output:**
```
🚀 Testing Cronos AI Agent SDK

1️⃣ Testing RiskMonitor...
   Result: LIMIT - Balance below threshold - reducing limits
   Confidence: 85%

2️⃣ Testing LiquidityOptimizer...
   Result: REMOVE - Excess liquidity detected - optimizing allocation
   Confidence: 80%

3️⃣ Testing EmergencyBrake...
   Result: PAUSE - Metric 95 exceeded critical threshold 90
   Confidence: 100%

4️⃣ Testing ThresholdGuard...
   Result: APPROVE - Value capped at maximum threshold 100000000000000000000
   Confidence: 90%

5️⃣ Testing AnomalyDetector...
   Result: ANOMALY_DETECTED - Severe anomaly detected: 5.00 standard deviations
   Severity: HIGH
   Confidence: 95%

✅ All agents tested successfully!
```

## Option 2: Test with UI (No Contracts Needed)

```bash
# 1. Build core SDK
cd packages/core
npm install
npm run build

# 2. Build UI package
cd ../ui
npm install
npm run build

# 3. Run UI demo
cd ../examples/ui-demo
npm install
npm run dev
```

Open http://localhost:5173 - Dashboard works immediately!

## Option 3: Test with Real Contracts

### Step 1: Deploy Simple Vault

```solidity
// SimpleVault.sol
contract SimpleVault {
    mapping(address => uint256) public balances;
    event Deposited(address indexed user, uint256 amount, uint256 newBalance);
    
    function deposit() external payable {
        balances[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value, balances[msg.sender]);
    }
}
```

### Step 2: Create .env

```bash
AGENT_PRIVATE_KEY=your_private_key
VAULT_ADDRESS=deployed_contract_address
```

### Step 3: Run Example

```bash
cd packages/examples/vault-automation
npm install
npm start
```

## What Works Right Now

✅ **All 5 built-in agents** - Test with standalone-test  
✅ **Custom agents** - Extend BaseAgent class  
✅ **Policy engine** - Add validation rules  
✅ **UI components** - Run ui-demo  
✅ **Full test suite** - Run `npm test` in core  

⚠️ **Event listening** - Requires deployed contract  
⚠️ **AI features** - Requires OpenAI API key  

## Verify Installation

```typescript
// test.ts
import { SentinelAgentSDK, RiskMonitor } from '@sentinel/ai-agent-sdk';

const sdk = new SentinelAgentSDK({
  network: 'cronos-testnet',
  rpcUrl: 'https://evm-t3.cronos.org'
});

sdk.registerAgent('risk', new RiskMonitor());

const result = await sdk.executeAgent('risk', {
  contractId: 'test',
  user: '0x123',
  customData: { balance: BigInt(5e18), threshold: BigInt(10e18) }
});

console.log(result); // Works!
```

## Next Steps

1. ✅ Test standalone agents (2 min)
2. ✅ Explore UI demo (5 min)
3. 📝 Read USER_STORIES.md for real-world examples
4. 🔧 Deploy contracts for event automation
5. 🎨 Create custom agents for your protocol
