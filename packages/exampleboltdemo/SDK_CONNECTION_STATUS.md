# SDK Connection Status Determination

This document explains how the Cronos AI Agent SDK determines its connection status through a comprehensive 4-stage health check system.

## Overview

The SDK connection status is **not just a simple "connected/disconnected" flag**. Instead, it's determined by validating 4 critical components that must all pass for the SDK to be considered fully operational.

## The 4 Critical Components

### 1. 🚀 Actual SDK Initialization
**What it tests**: Core SDK configuration and setup

**Detailed Steps**:
1. **Configuration Validation**
   - Checks if RPC URL is provided and valid format
   - Validates network configuration (testnet/mainnet)
   - Verifies private key format (if provided)
   - Confirms required environment variables exist

2. **Dependency Check**
   - Ensures ethers.js library is available
   - Validates SDK core modules can be imported
   - Checks for required Node.js version compatibility
   - Verifies memory allocation for SDK operations

3. **Initialization Process**
   - Creates SDK instance with provided configuration
   - Sets up internal state management
   - Initializes logging and error handling
   - Measures total initialization time

4. **Validation Tests**
   - Confirms SDK instance is created successfully
   - Tests basic SDK method availability
   - Verifies configuration is properly loaded
   - Ensures no critical errors during setup

**Success criteria**: SDK initializes within timeout period without throwing errors

**Failure scenarios**:
- Missing or invalid RPC URL
- Configuration errors
- Initialization timeout
- Missing dependencies

### 2. 🌐 RPC Endpoint Health
**What it tests**: Blockchain network connectivity

**Detailed Steps**:
1. **Connection Establishment**
   - Creates ethers JsonRpcProvider instance
   - Attempts initial connection to Cronos testnet
   - Tests connection timeout handling (10s limit)
   - Validates SSL/TLS certificate if HTTPS

2. **Network Information Retrieval**
   - Fetches network details via `getNetwork()` call
   - Retrieves chain ID (should be 338 for Cronos testnet)
   - Gets network name and validates it matches expected
   - Confirms network is responsive and not in maintenance

3. **Live Data Validation**
   - Calls `getBlockNumber()` to get current block height
   - Verifies block number is reasonable (not zero/negative)
   - Checks if blocks are being produced (not stale)
   - Measures response time for performance assessment

4. **Connection Stability Test**
   - Performs multiple rapid requests to test stability
   - Validates consistent responses across calls
   - Tests error handling for malformed requests
   - Confirms connection can be reused reliably

**Success criteria**: Successfully connects and retrieves live blockchain data

**Failure scenarios**:
- Network unreachable
- RPC endpoint down
- Connection timeout
- Invalid network response

### 3. 🤖 Agent Registration
**What it tests**: Built-in AI agents loading correctly

**Detailed Steps**:
1. **Agent Class Loading**
   - Imports RiskMonitor class from core package
   - Imports LiquidityOptimizer class and dependencies
   - Imports EmergencyBrake with interface definitions
   - Imports ThresholdGuard and validation logic
   - Imports AnomalyDetector with statistical functions

2. **Agent Instantiation**
   - Creates new instance of each agent class
   - Validates agent configuration objects
   - Tests agent constructor parameters
   - Confirms agent ID uniqueness across all agents
   - Verifies agent version compatibility

3. **Agent Configuration Validation**
   - Checks each agent's config object structure
   - Validates required fields (id, name, description, version)
   - Tests agent-specific configuration parameters
   - Confirms agent type classification (Deterministic/Statistical)
   - Verifies agent decision method availability

4. **Registration Process**
   - Registers each agent with SDK registry
   - Tests agent lookup by ID functionality
   - Validates agent metadata storage
   - Confirms agent can be retrieved and executed
   - Tests agent unregistration capability

5. **Agent Functionality Test**
   - Calls basic agent methods to ensure they work
   - Tests agent decision-making with mock data
   - Validates agent response format compliance
   - Confirms agent error handling works properly

**Success criteria**: All agents register without errors

**Failure scenarios**:
- Agent class import failures
- Configuration errors
- Memory/resource issues
- Dependency conflicts

### 4. 📋 Contract Validation
**What it tests**: Smart contract interaction capabilities

**Detailed Steps**:
1. **Contract Access Testing**
   - Attempts to read contract bytecode using `getCode()`
   - Tests with null address (0x000...000) as baseline
   - Validates contract existence detection works
   - Confirms contract data can be retrieved
   - Tests contract address format validation

2. **Gas Price Information**
   - Calls `getFeeData()` to retrieve current gas pricing
   - Validates gas price is within reasonable bounds
   - Checks for EIP-1559 fee structure support
   - Confirms priority fee recommendations available
   - Tests gas price history if supported

3. **Transaction Simulation Capability**
   - Tests ability to estimate gas for transactions
   - Validates transaction parameter formatting
   - Confirms transaction simulation without execution
   - Tests error handling for invalid transactions
   - Validates transaction cost calculation accuracy

4. **Network State Validation**
   - Checks current network congestion levels
   - Validates block gas limit information
   - Tests pending transaction pool access
   - Confirms network is accepting transactions
   - Validates mempool interaction capability

5. **Contract Interaction Readiness**
   - Tests ABI encoding/decoding functionality
   - Validates function call parameter formatting
   - Confirms event log parsing capability
   - Tests contract state reading functionality
   - Validates contract write operation preparation

**Success criteria**: Can access contract data and fetch gas information

**Failure scenarios**:
- Contract access denied
- Gas price fetch failure
- Network congestion
- Invalid contract addresses

## Connection Status Logic

```javascript
// SDK is considered "Connected" ONLY when ALL 4 tests pass
const isConnected = 
  sdkInit.status === 'success' &&
  rpcHealth.status === 'success' &&
  agentRegistration.status === 'success' &&
  contractValidation.status === 'success';
```

## Visual Indicators

### Dashboard Status Display
- 🟢 **Green Dot**: All 4 components healthy - "SDK Connected"
- 🔴 **Red Dot**: One or more components failed - "SDK Disconnected"
- **View Details**: Click to see individual component status

### Test Results Format
```
✅ SDK Initialization: SUCCESS
   SDK initialized successfully (342ms)
   Time: 2:34:56 PM

✅ RPC Endpoint Health: SUCCESS  
   Network: cronos-testnet (338), Block: 12345678
   Time: 2:34:57 PM

✅ Agent Registration: SUCCESS
   5 built-in agents registered successfully
   Time: 2:34:58 PM

✅ Contract Validation: SUCCESS
   Gas price: 5000.0 gwei
   Time: 2:34:59 PM

🎯 Overall Status: ✅ ALL SYSTEMS GO
```

## Running Health Checks

### Automatic (Web Interface)
Health checks run automatically when the app loads:
```typescript
useEffect(() => {
  const healthChecker = new SDKHealthChecker();
  const results = await healthChecker.runHealthCheck();
  setIsReady(healthChecker.isAllHealthy());
}, []);
```

### Manual (CLI)
```bash
# Run comprehensive health check
npm run test:sdk-health

# Direct execution
node sdk-health-test.js
```

## Configuration

### Test Settings
```javascript
const CONFIG = {
  rpcUrl: 'https://evm-t3.cronos.org',
  testContractAddress: '0x0000000000000000000000000000000000000000',
  timeout: 10000 // 10 seconds
};
```

### Customization
- **RPC URL**: Change to different Cronos networks
- **Timeout**: Adjust for slower connections
- **Test Contract**: Use specific contract for validation

## Troubleshooting

### Common Issues & Solutions

| Component | Issue | Solution |
|-----------|-------|----------|
| SDK Init | Configuration missing | Check environment variables |
| RPC Health | Connection timeout | Verify internet connection |
| Agent Registration | Import errors | Check dependencies |
| Contract Validation | Gas fetch failed | Check network status |

### Debug Mode
Enable verbose logging:
```bash
DEBUG=true npm run test:sdk-health
```

## Integration Examples

### React Component
```typescript
const [healthStatus, setHealthStatus] = useState<SDKHealthResults | null>(null);

const checkHealth = async () => {
  const checker = new SDKHealthChecker();
  const results = await checker.runHealthCheck();
  setHealthStatus(results);
  setIsConnected(checker.isAllHealthy());
};
```

### Status Monitoring
```typescript
// Monitor individual components
const isRPCHealthy = healthStatus?.rpcHealth.status === 'success';
const areAgentsLoaded = healthStatus?.agentRegistration.status === 'success';
```

## Why This Approach?

This comprehensive health check system ensures:
- **Reliability**: No false positives from partial connections
- **Transparency**: Users see exactly what's working/failing
- **Debugging**: Detailed error messages for troubleshooting
- **Production Ready**: Validates all critical components before use