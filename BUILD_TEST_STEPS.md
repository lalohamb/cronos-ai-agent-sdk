# Complete Build & Test Steps - Cronos AI Agent SDK

## Prerequisites

- Node.js 18+ installed
- Git installed
- Terminal/Command prompt access

---

## Step 1: Navigate to Project

```bash
cd v4
```

**Expected:** You should be in the root folder containing `package.json` and `packages/` folder.

---

## Step 2: Install Root Dependencies

```bash
npm install
```

**Expected Output:**
```
added X packages in Xs
```

---

## Step 3: Build Core SDK

### 3.1 Navigate to core package
```bash
cd packages/core
```

### 3.2 Install core dependencies
```bash
npm install
```

**Expected Output:**
```
added X packages in Xs
```

### 3.3 Build TypeScript
```bash
npm run build
```

**Expected Output:**
```
> @sentinel/ai-agent-sdk@1.0.0 build
> tsc

(No errors - silent success)
```

**Verify:** Check that `dist/` folder was created:
```bash
ls dist/
```

**Expected:** You should see compiled JavaScript files:
```
index.js  index.d.ts  SentinelAgentSDK.js  agents/  contracts/  events/  policies/  ai/  utils/
```

---

## Step 4: Test Core SDK

### 4.1 Run unit tests
```bash
npm test
```

**Expected Output:**
```
PASS  src/__tests__/SentinelAgentSDK.test.ts
PASS  src/agents/__tests__/RiskMonitor.test.ts
PASS  src/agents/__tests__/LiquidityOptimizer.test.ts
PASS  src/agents/__tests__/ThresholdGuard.test.ts
PASS  src/agents/__tests__/EmergencyBrake.test.ts
PASS  src/agents/__tests__/AnomalyDetector.test.ts
PASS  src/agents/__tests__/AgentRegistry.test.ts
PASS  src/agents/__tests__/BaseAgent.test.ts
PASS  src/policies/__tests__/PolicyEngine.test.ts

Test Suites: 9 passed, 9 total
Tests:       25 passed, 25 total
Snapshots:   0 total
Time:        X.XXXs
```

### 4.2 Run with coverage (optional)
```bash
npm run test:coverage
```

**Expected:** Coverage report showing 80%+ coverage on all metrics.

---

## Step 5: Test Standalone Example (No Contracts)

### 5.1 Navigate to standalone test
```bash
cd ../examples/standalone-test
```

### 5.2 Install dependencies
```bash
npm install
```

### 5.3 Run test
```bash
npm test
```

**Expected Output:**
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

**Status:** ✅ Core SDK is working!

---

## Step 6: Build UI Package

### 6.1 Navigate to UI package
```bash
cd ../../ui
```

### 6.2 Install UI dependencies
```bash
npm install
```

### 6.3 Build UI package
```bash
npm run build
```

**Expected Output:**
```
> @cronos/ai-agent-ui@1.0.0 build
> tsc

(No errors - silent success)
```

**Verify:** Check that `dist/` folder was created:
```bash
ls dist/
```

---

## Step 7: Test UI Demo

### 7.1 Navigate to UI demo
```bash
cd ../examples/ui-demo
```

### 7.2 Install demo dependencies
```bash
npm install
```

### 7.3 Start development server
```bash
npm run dev
```

**Expected Output:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### 7.4 Open browser
Open http://localhost:5173

**Expected:** You should see:
- Dashboard with metrics cards
- Agent Console with input forms
- Event Monitor section
- Contract Registry form

**Status:** ✅ UI is working!

### 7.5 Stop development server
Press `Ctrl+C` to stop the server.

---

## Step 8: Test Other Examples

### 8.1 Test Vault Automation Example
```bash
cd ../vault-automation
npm install
```

**Note:** This example requires a deployed contract to fully work, but dependencies should install successfully.

### 8.2 Test DEX Liquidity Example
```bash
cd ../dex-liquidity
npm install
```

**Note:** This example also requires a deployed contract to fully work.

---

## Step 9: Build Everything from Root (Optional)

### 9.1 Navigate back to root
```bash
cd ../../../
```

### 9.2 Build all packages
```bash
npm run build
```

**Expected:** This runs build in all packages that have a build script.

### 9.3 Test all packages
```bash
npm test
```

**Expected:** This runs tests in all packages that have tests.

---

## Step 10: Verify Installation

### 10.1 Create test project
```bash
mkdir test-sdk
cd test-sdk
npm init -y
```

### 10.2 Install SDK locally
```bash
npm install ../v4/packages/core
```

### 10.3 Create test file
```bash
cat > test.js << 'EOF'
const { SentinelAgentSDK, RiskMonitor } = require('@sentinel/ai-agent-sdk');

async function test() {
  const sdk = new SentinelAgentSDK({
    network: 'cronos-testnet',
    rpcUrl: 'https://evm-t3.cronos.org'
  });

  sdk.registerAgent('risk', new RiskMonitor());

  const result = await sdk.executeAgent('risk', {
    contractId: 'test',
    user: '0x123',
    customData: {
      balance: BigInt(5e18),
      threshold: BigInt(10e18)
    }
  });

  console.log('✅ SDK Test Result:', result.action.type, '-', result.reason);
}

test().catch(console.error);
EOF
```

### 10.4 Run test
```bash
node test.js
```

**Expected Output:**
```
✅ SDK Test Result: LIMIT - Balance below threshold - reducing limits
```

**Status:** ✅ SDK can be installed and used!

---

## Troubleshooting

### Error: "Cannot find module"
**Solution:** Make sure you built the core package first:
```bash
cd v4/packages/core
npm run build
```

### Error: "Port already in use"
**Solution:** Kill the process or use different port:
```bash
npm run dev -- --port 3000
```

### Error: "Permission denied"
**Solution:** Check file permissions or run with appropriate permissions.

### Tests failing
**Solution:** Make sure all dependencies are installed:
```bash
npm install
```

---

## Success Checklist

- [ ] Root dependencies installed
- [ ] Core SDK built successfully (`packages/core/dist/` exists)
- [ ] Core tests pass (9 test suites, 25+ tests)
- [ ] Standalone test runs and shows all 5 agents working
- [ ] UI package built successfully (`packages/ui/dist/` exists)
- [ ] UI demo opens in browser and shows dashboard
- [ ] Can install SDK in external project
- [ ] External test file runs and shows agent decision

---

## What Each Step Proves

| Step | What It Proves |
|------|----------------|
| 1-3 | Project structure is correct |
| 4 | Core SDK compiles and all tests pass |
| 5 | All 5 agents work without any contracts |
| 6-7 | UI components work and render |
| 8 | Example projects are properly configured |
| 9 | Monorepo build system works |
| 10 | SDK can be installed and used externally |

---

## Final Verification Commands

Run these commands to verify everything works:

```bash
# From v4 root directory
cd packages/core && npm run build && npm test
cd ../examples/standalone-test && npm test
cd ../ui-demo && npm install && timeout 10s npm run dev || true
cd ../../../
echo "✅ All tests completed!"
```

If all commands succeed without errors, your SDK is fully functional!

---

## Next Steps After Testing

1. **Publish to NPM** (optional):
   ```bash
   cd packages/core
   npm publish --access public
   ```

2. **Deploy contracts** for event automation examples

3. **Add OpenAI API key** for AI features:
   ```bash
   echo "OPENAI_API_KEY=your_key_here" > .env
   ```

4. **Create your own agents** by extending `BaseAgent`

5. **Integrate with your dApp** using the working SDK