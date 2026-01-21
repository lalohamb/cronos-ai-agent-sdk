# SDK Health Testing System

This system provides comprehensive health checks for the Cronos AI Agent SDK to ensure all critical components are functioning properly.

## Health Check Components

### 1. SDK Initialization ✅
- **Purpose**: Validates SDK configuration and initialization
- **Tests**: RPC URL validation, configuration loading
- **Success Criteria**: SDK initializes without errors

### 2. RPC Endpoint Health 🌐
- **Purpose**: Verifies blockchain connectivity
- **Tests**: Network connection, block number fetch, timeout handling
- **Success Criteria**: Successfully connects to Cronos testnet

### 3. Agent Registration 🤖
- **Purpose**: Ensures all built-in agents load correctly
- **Tests**: Loads RiskMonitor, LiquidityOptimizer, EmergencyBrake, ThresholdGuard, AnomalyDetector
- **Success Criteria**: All 5 agents register successfully

### 4. Contract Validation 📋
- **Purpose**: Validates contract interaction capabilities
- **Tests**: Contract code access, gas price fetching, transaction simulation
- **Success Criteria**: Can interact with blockchain contracts

## Running Tests

### Manual CLI Test
```bash
# Run comprehensive health check
npm run test:sdk-health

# Or run directly
node sdk-health-test.js
```

### Web Interface
The health status is automatically checked when the web app loads:
- Green dot = All systems healthy
- Red dot = Issues detected
- Click "View Details" to see specific test results

## Test Results

Each test provides:
- ✅ **Status**: success/error/pending
- 📝 **Message**: Detailed result information
- ⏰ **Timestamp**: When the test completed

## Configuration

Edit `CONFIG` in `sdk-health-test.js` or `sdkHealthChecker.ts`:
```javascript
const CONFIG = {
  rpcUrl: 'https://evm-t3.cronos.org',
  testContractAddress: '0x0000000000000000000000000000000000000000',
  timeout: 10000 // 10 seconds
};
```

## Troubleshooting

### Common Issues
1. **RPC Timeout**: Check internet connection and RPC endpoint
2. **Agent Registration Failed**: Verify agent imports and dependencies
3. **Contract Validation Failed**: Check network connectivity and gas prices

### Debug Mode
Set `DEBUG=true` environment variable for verbose logging:
```bash
DEBUG=true npm run test:sdk-health
```