
# Build & Run - Step by Step

## 🎯 Goal: Get the SDK working in 5 minutes

---

## Option 1: Quick Test (No Build Required)

### Step 1: Navigate to test folder
```bash
cd v4/packages/examples/standalone-test
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Run test
```bash
npm test
```

### ✅ Expected Output:
```
🚀 Testing Cronos AI Agent SDK

1️⃣ Testing RiskMonitor...
   Result: LIMIT - Balance below threshold - reducing limits
   Confidence: 85%

2️⃣ Testing LiquidityOptimizer...
   Result: REMOVE - Excess liquidity detected
   Confidence: 80%

... (3 more agents)

✅ All agents tested successfully!
```

**Done!** SDK is working.

---

## Option 2: Build Core SDK (For Development)

### Step 1: Navigate to core package
```bash
cd v4/packages/core
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Build TypeScript
```bash
npm run build
```

### ✅ Expected Output:
```
packages/core/dist/
├── index.js
├── index.d.ts
├── SentinelAgentSDK.js
├── agents/
└── ... (all compiled files)
```

### Step 4: Run tests (optional)
```bash
npm test
```

### ✅ Expected Output:
```
PASS  src/__tests__/SentinelAgentSDK.test.ts
PASS  src/agents/__tests__/RiskMonitor.test.ts
... (9 test files)

Tests: 25 passed, 25 total
```

**Done!** SDK is built and tested.

---

## Option 3: Run UI Demo

### Step 1: Build core SDK first
```bash
cd v4/packages/core
npm install
npm run build
```

### Step 2: Build UI package
```bash
cd ../ui
npm install
npm run build
```

### Step 3: Run demo app
```bash
cd ../examples/ui-demo
npm install
npm run dev
```

### ✅ Expected Output:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 4: Open browser
Open http://localhost:5173

**Done!** You'll see the dashboard with all components.

---

## Option 4: Use in Your Own Project

### Step 1: Build core SDK
```bash
cd v4/packages/core
npm install
npm run build
```

### Step 2: Create your project
```bash
mkdir my-agent-app
cd my-agent-app
npm init -y
```

### Step 3: Install SDK locally
```bash
npm install ../v4/packages/core
```

### Step 4: Create your app
```typescript
// index.ts
import { SentinelAgentSDK, RiskMonitor } from '@sentinel/ai-agent-sdk';

async function main() {
  const sdk = new SentinelAgentSDK({
    network: 'cronos-testnet',
    rpcUrl: 'https://evm-t3.cronos.org'
  });

  sdk.registerAgent('risk', new RiskMonitor());

  const result = await sdk.executeAgent('risk', {
    contractId: 'my-vault',
    user: '0x123',
    customData: {
      balance: BigInt(5e18),
      threshold: BigInt(10e18)
    }
  });

  console.log('Decision:', result);
}

main();
```

### Step 5: Run it
```bash
npx ts-node index.ts
```

**Done!** Your app is using the SDK.

---

## Troubleshooting

### Error: "Cannot find module '@sentinel/ai-agent-sdk'"

**Solution:** Build the core package first
```bash
cd v4/packages/core
npm run build
```

### Error: "Module not found: ethers"

**Solution:** Install dependencies
```bash
npm install
```

### Error: "Port 5173 already in use"

**Solution:** Kill the process or use different port
```bash
npm run dev -- --port 3000
```

---

## File Structure Quick Reference

```
v4/
├── packages/
│   ├── core/                  ← Build this first
│   │   ├── src/              ← Source code
│   │   ├── dist/             ← Compiled output (after build)
│   │   └── package.json
│   │
│   ├── ui/                    ← Build this second (optional)
│   │   ├── src/
│   │   ├── dist/
│   │   └── package.json
│   │
│   └── examples/
│       ├── standalone-test/   ← ✅ Run this to test
│       ├── ui-demo/          ← ✅ Run this to see UI
│       ├── vault-automation/
│       └── dex-liquidity/
│
└── docs/
```

---

## Build Order

1. **Core SDK** (`packages/core`) - Build first, everything depends on this
2. **UI Package** (`packages/ui`) - Build second, only if using UI
3. **Examples** - Just run them, they use the built packages

---

## Commands Cheat Sheet

```bash
# Build core SDK
cd packages/core && npm install && npm run build

# Test core SDK
cd packages/core && npm test

# Run standalone test (no build needed)
cd packages/examples/standalone-test && npm install && npm test

# Build UI
cd packages/ui && npm install && npm run build

# Run UI demo
cd packages/examples/ui-demo && npm install && npm run dev

# Build everything from root
cd v4 && npm install && npm run build
```

---

## What Each Command Does

| Command | What It Does |
|---------|--------------|
| `npm install` | Downloads dependencies from package.json |
| `npm run build` | Compiles TypeScript → JavaScript (src/ → dist/) |
| `npm test` | Runs Jest tests |
| `npm run dev` | Starts development server (Vite) |
| `npm start` | Runs the application |

---

## Success Checklist

- [ ] Core SDK builds without errors
- [ ] Tests pass (9 test files)
- [ ] Standalone test runs and shows agent results
- [ ] UI demo opens in browser
- [ ] Can import SDK in your own project

If all checked, you're ready to use the SDK! 🎉
