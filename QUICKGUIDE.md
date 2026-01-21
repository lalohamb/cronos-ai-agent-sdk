# Quick Guide: Build Your First Custom Agent

A complete step-by-step guide to create, test, and deploy custom agents with the Cronos AI Agent SDK.

## 🎯 What You'll Build

By the end of this guide, you'll have:
- ✅ A working custom agent
- ✅ Integrated with the SDK
- ✅ Tested and ready for production
- ✅ Understanding of agent architecture

**Time Required**: 15-30 minutes

---

## 📋 Prerequisites

### Required Tools
```bash
# 1. Node.js (v16 or higher)
node --version  # Should show v16+

# 2. NPM or Yarn
npm --version   # Should show 8+

# 3. TypeScript (optional but recommended)
npm install -g typescript
```

### Required Knowledge
- Basic JavaScript/TypeScript
- Understanding of async/await
- Basic blockchain concepts (optional)

---

## 🚀 Step 1: Project Setup (5 minutes)

### 1.1 Create New Project
```bash
# Create project directory
mkdir my-cronos-agent
cd my-cronos-agent

# Initialize package.json
npm init -y
```

### 1.2 Install Dependencies
```bash
# Install Cronos AI Agent SDK
npm install @sentinel/ai-agent-sdk

# Install TypeScript dependencies (recommended)
npm install -D typescript @types/node ts-node

# Create TypeScript config
npx tsc --init
```

### 1.3 Project Structure
```
my-cronos-agent/
├── package.json
├── tsconfig.json
├── src/
│   ├── agents/
│   │   └── MyCustomAgent.ts    ← Your agent goes here
│   └── app.ts                  ← Main application
└── README.md
```

---

## 🔧 Step 2: Create Your First Agent (10 minutes)

### 2.1 Create Agent File
Create `src/agents/MyCustomAgent.ts`:

```typescript
import { BaseAgent, AgentContext, AgentDecision } from '@sentinel/ai-agent-sdk';

export class MyCustomAgent extends BaseAgent {
  // Agent configuration - required
  config = {
    id: 'my-custom-agent',           // Unique identifier
    name: 'My Custom Agent',         // Human-readable name
    description: 'My first custom agent that validates transaction amounts',
    version: '1.0.0'                // Version for tracking
  };

  // Main decision logic - required
  async decide(context: AgentContext): Promise<AgentDecision> {
    // Extract data from context
    const { contractId, user, customData } = context;
    const amount = customData?.amount || 0;
    const userTier = customData?.userTier || 'basic';

    // Your business logic here
    const maxAmount = this.getMaxAmountForTier(userTier);

    if (amount > maxAmount) {
      return {
        action: { 
          type: 'BLOCK',           // Block the transaction
          value: 0                 // No amount allowed
        },
        reason: `Amount ${amount} exceeds limit ${maxAmount} for ${userTier} tier`,
        confidence: 0.95,          // How confident we are (0.0-1.0)
        metadata: {                // Additional data for debugging
          userTier,
          requestedAmount: amount,
          maxAllowed: maxAmount,
          timestamp: new Date().toISOString()
        }
      };
    }

    if (amount > maxAmount * 0.8) {
      return {
        action: { 
          type: 'LIMIT',           // Allow but cap the amount
          value: maxAmount * 0.8   // Reduced amount
        },
        reason: `Amount reduced to safe limit for ${userTier} tier`,
        confidence: 0.85,
        metadata: {
          userTier,
          originalAmount: amount,
          adjustedAmount: maxAmount * 0.8
        }
      };
    }

    return {
      action: { 
        type: 'ALLOW',             // Allow the transaction
        value: amount              // Original amount
      },
      reason: `Amount ${amount} is within safe limits for ${userTier} tier`,
      confidence: 0.9,
      metadata: {
        userTier,
        amount,
        status: 'approved'
      }
    };
  }

  // Helper method - optional but recommended
  private getMaxAmountForTier(tier: string): number {
    const limits = {
      'basic': 1000,
      'premium': 5000,
      'enterprise': 50000
    };
    return limits[tier] || limits['basic'];
  }
}
```

### 2.2 Understanding the Agent Structure

**Required Properties:**
- `config` - Agent metadata and identification
- `decide()` - Main logic method that returns decisions

**Decision Object:**
- `action.type` - What to do: `'ALLOW'`, `'BLOCK'`, `'LIMIT'`, `'REVIEW'`
- `action.value` - Amount or value to use
- `reason` - Human-readable explanation
- `confidence` - How sure you are (0.0 to 1.0)
- `metadata` - Extra data for logging/debugging

---

## 🔌 Step 3: Integrate with SDK (5 minutes)

### 3.1 Create Main Application
Create `src/app.ts`:

```typescript
import { SentinelAgentSDK } from '@sentinel/ai-agent-sdk';
import { MyCustomAgent } from './agents/MyCustomAgent';

async function main() {
  // 1. Initialize SDK
  const sdk = new SentinelAgentSDK({
    network: 'cronos-testnet',              // Use testnet for development
    rpcUrl: 'https://evm-t3.cronos.org',   // Cronos testnet RPC
    // privateKey: 'your-key-here'          // Optional: for blockchain interactions
  });

  // 2. Register your custom agent
  const myAgent = new MyCustomAgent();
  sdk.registerAgent('my-agent', myAgent);

  // 3. Test the agent
  console.log('🚀 Testing custom agent...');
  
  const testCases = [
    {
      name: 'Basic user, small amount',
      context: {
        contractId: 'vault-001',
        user: '0x1234567890123456789012345678901234567890',
        customData: { amount: 500, userTier: 'basic' }
      }
    },
    {
      name: 'Basic user, large amount',
      context: {
        contractId: 'vault-001', 
        user: '0x1234567890123456789012345678901234567890',
        customData: { amount: 2000, userTier: 'basic' }
      }
    },
    {
      name: 'Premium user, large amount',
      context: {
        contractId: 'vault-001',
        user: '0x1234567890123456789012345678901234567890', 
        customData: { amount: 3000, userTier: 'premium' }
      }
    }
  ];

  // Run test cases
  for (const testCase of testCases) {
    console.log(`\n📋 Test: ${testCase.name}`);
    try {
      const result = await sdk.executeAgent('my-agent', testCase.context);
      console.log('✅ Result:', {
        action: result.action,
        reason: result.reason,
        confidence: result.confidence
      });
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
  }

  console.log('\n🎉 Agent testing complete!');
}

// Run the application
main().catch(console.error);
```

### 3.2 Add NPM Scripts
Update `package.json`:

```json
{
  "scripts": {
    "start": "ts-node src/app.ts",
    "build": "tsc",
    "test": "npm run start"
  }
}
```

---

## 🧪 Step 4: Test Your Agent (5 minutes)

### 4.1 Run the Tests
```bash
# Run your agent
npm start
```

**Expected Output:**
```
🚀 Testing custom agent...

📋 Test: Basic user, small amount
✅ Result: {
  action: { type: 'ALLOW', value: 500 },
  reason: 'Amount 500 is within safe limits for basic tier',
  confidence: 0.9
}

📋 Test: Basic user, large amount  
✅ Result: {
  action: { type: 'BLOCK', value: 0 },
  reason: 'Amount 2000 exceeds limit 1000 for basic tier',
  confidence: 0.95
}

📋 Test: Premium user, large amount
✅ Result: {
  action: { type: 'ALLOW', value: 3000 },
  reason: 'Amount 3000 is within safe limits for premium tier', 
  confidence: 0.9
}

🎉 Agent testing complete!
```

### 4.2 Troubleshooting Common Issues

**Issue: "Cannot find module '@sentinel/ai-agent-sdk'"**
```bash
# Solution: Install the SDK
npm install @sentinel/ai-agent-sdk
```

**Issue: TypeScript compilation errors**
```bash
# Solution: Install TypeScript dependencies
npm install -D typescript @types/node ts-node
```

**Issue: Agent not found**
```typescript
// Solution: Check agent registration
sdk.registerAgent('my-agent', new MyCustomAgent()); // ID must match
const result = await sdk.executeAgent('my-agent', context); // Same ID
```

---

## 🚀 Step 5: Advanced Features (Optional)

### 5.1 Add Error Handling
```typescript
async decide(context: AgentContext): Promise<AgentDecision> {
  try {
    // Validate input
    if (!context.customData?.amount) {
      throw new Error('Amount is required');
    }

    // Your logic here...
    
  } catch (error) {
    return {
      action: { type: 'BLOCK' },
      reason: `Validation failed: ${error.message}`,
      confidence: 0.1,
      metadata: { error: error.message }
    };
  }
}
```

### 5.2 Add Logging
```typescript
import { logger } from '@sentinel/ai-agent-sdk';

async decide(context: AgentContext): Promise<AgentDecision> {
  logger.info('Processing decision', { 
    user: context.user, 
    amount: context.customData?.amount 
  });

  const decision = {
    action: { type: 'ALLOW', value: amount },
    reason: 'Approved',
    confidence: 0.9
  };

  logger.info('Decision made', { decision });
  return decision;
}
```

### 5.3 Add Configuration
```typescript
export class MyCustomAgent extends BaseAgent {
  constructor(private options: { maxAmount?: number } = {}) {
    super();
  }

  private getMaxAmount(): number {
    return this.options.maxAmount || 1000;
  }
}

// Usage
const agent = new MyCustomAgent({ maxAmount: 5000 });
sdk.registerAgent('my-agent', agent);
```

---

## 📦 Step 6: Production Deployment

### 6.1 Environment Configuration
Create `.env` file:
```bash
# .env
NODE_ENV=production
CRONOS_NETWORK=cronos-mainnet
CRONOS_RPC_URL=https://evm.cronos.org
AGENT_PRIVATE_KEY=your-production-key
```

### 6.2 Production Code
```typescript
import dotenv from 'dotenv';
dotenv.config();

const sdk = new SentinelAgentSDK({
  network: process.env.CRONOS_NETWORK as 'cronos-mainnet',
  rpcUrl: process.env.CRONOS_RPC_URL!,
  privateKey: process.env.AGENT_PRIVATE_KEY
});
```

### 6.3 Docker Deployment (Optional)
Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["node", "dist/app.js"]
```

---

## 🎯 Next Steps

### Immediate Actions
1. **Customize the logic** - Modify the `decide()` method for your use case
2. **Add more test cases** - Test edge cases and error conditions  
3. **Add validation** - Validate all inputs thoroughly
4. **Add logging** - Log decisions for debugging and analytics

### Advanced Features
1. **Multiple agents** - Create different agents for different purposes
2. **Agent composition** - Combine multiple agents for complex decisions
3. **External APIs** - Integrate with external services for data
4. **Machine learning** - Add AI/ML models for intelligent decisions
5. **Event handling** - React to blockchain events automatically

### Production Considerations
1. **Error handling** - Handle all possible error scenarios
2. **Performance** - Optimize for high-throughput scenarios
3. **Security** - Validate all inputs and sanitize outputs
4. **Monitoring** - Add metrics and alerting
5. **Testing** - Add comprehensive unit and integration tests

---

## 📚 Additional Resources

- **[SDK Documentation](./README.md)** - Complete SDK reference
- **[Agent Examples](./packages/examples/)** - More complex agent examples
- **[API Reference](./docs/api-reference.md)** - Full API documentation
- **[Custom Agent Types](./CUSTOM_AGENT_TYPES.md)** - Advanced agent patterns
- **[Architecture Guide](./ARCHITECTURE_GUIDE.md)** - System architecture overview

## 🆘 Getting Help

- **GitHub Issues** - Report bugs or request features
- **Documentation** - Check the docs folder for detailed guides
- **Examples** - Look at working examples in the packages/examples directory
- **Community** - Join our developer community for support

---

**Congratulations! 🎉** You've successfully built your first custom agent. You now have the foundation to create sophisticated AI-powered automation for blockchain applications.