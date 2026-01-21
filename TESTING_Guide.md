# Cronos AI Agent SDK - Testing Guide

## Overview

This guide provides comprehensive instructions for testing the entire Cronos AI Agent SDK using the various testing scripts and setups available in the project.

## Testing Architecture

The SDK includes multiple testing layers:
- **Unit Tests**: Individual component testing with Jest
- **Integration Tests**: Cross-component functionality testing
- **System Tests**: End-to-end SDK functionality
- **UI Tests**: React component and demo testing
- **Standalone Tests**: Isolated agent testing

## Quick Start - Run All Tests

```bash
# Run comprehensive test suite
node test-all.js
```

This executes all testing layers and provides a complete validation report.

## Testing Scripts Overview

### 1. `test-all.js` - Comprehensive Test Suite

**Purpose**: Runs all tests across the entire SDK

**What it tests**:
- Core SDK unit tests (60+ tests)
- Policy Pack system tests
- TypeScript compilation
- UI component builds
- Integration tests
- Standalone examples

**Usage**:
```bash
node test-all.js
```

**Expected Output**:
```
🧪 COMPREHENSIVE TEST SUITE - Cronos AI Agent SDK v5.2.0
📋 Core SDK Tests (60 tests including Policy Pack)... ✅ PASSED
📋 Core SDK TypeScript Build... ✅ PASSED
📋 UI Package TypeScript Build... ✅ PASSED
📋 UI Demo Type Checking... ✅ PASSED
📋 Standalone Integration Test... ✅ PASSED
📋 Policy Pack System Tests... ✅ PASSED
📋 UI Demo Dependencies Installation... ✅ PASSED

🎉 ALL TESTS PASSED! 🎉
```

### 2. `system-test.js` - End-to-End System Testing

**Purpose**: Comprehensive system-level testing of SDK functionality

**What it tests**:
- SDK initialization and configuration
- Agent registration and execution
- Contract integration
- All 5 built-in agents with multiple scenarios
- Policy engine functionality
- Lifecycle management
- Error handling

**Usage**:
```bash
node system-test.js
```

**Test Scenarios** (17 total):
1. SDK Initialization
2. Agent Registration
3. Contract Registration
4. Risk Monitor - Low Risk
5. Risk Monitor - High Risk
6. Risk Monitor - Critical Risk
7. Liquidity Optimizer - Hold
8. Liquidity Optimizer - Remove
9. Emergency Brake - Normal
10. Emergency Brake - Critical
11. Threshold Guard - Approve
12. Threshold Guard - Reject
13. Anomaly Detector - Normal
14. Anomaly Detector - High Anomaly
15. Policy Engine - Confidence Policy
16. Policy Engine - Blocking Policy
17. SDK Lifecycle

### 3. Core Package Unit Tests

**Location**: `packages/core/`

**Purpose**: Detailed unit testing of individual components

**Usage**:
```bash
cd packages/core
npm test
```

**Test Structure**:
```
src/__tests__/
├── SentinelAgentSDK.test.ts          # Main SDK tests
├── setup.ts                        # Test configuration
├── agents/__tests__/               # Agent-specific tests
│   ├── AgentRegistry.test.ts
│   ├── AnomalyDetector.test.ts
│   ├── BaseAgent.test.ts
│   ├── EmergencyBrake.test.ts
│   ├── LiquidityOptimizer.test.ts
│   ├── RiskMonitor.test.ts
│   └── ThresholdGuard.test.ts
├── policies/__tests__/             # Policy system tests
│   └── PolicyEngine.test.ts
├── policy-pack/__tests__/          # Policy Pack tests
│   └── policyPackEnforcement.test.ts
├── control-plane/__tests__/        # Control plane tests
├── payments/__tests__/             # Payment system tests
└── utils/__tests__/                # Utility tests
```

**Coverage Requirements**:
- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

### 4. Standalone Integration Tests

**Location**: `packages/examples/standalone-test/`

**Purpose**: Isolated testing of agent functionality

**Usage**:
```bash
cd packages/examples/standalone-test
npm install  # Install dependencies first
npm test
```

**What it tests**:
- Individual agent execution
- Agent decision-making logic
- Input validation
- Output formatting

**Note**: Dependencies (including `ts-node`) must be installed before running tests.

### 5. UI Component Tests

**Location**: `packages/examples/ui-demo/`

**Purpose**: React component and UI functionality testing

**Usage**:
```bash
cd packages/examples/ui-demo
npm run test
```

**Components tested**:
- AgentDashboard
- PolicyManager
- EventMonitor
- ContractRegistry

## Step-by-Step Testing Instructions

### Step 1: Environment Setup

```bash
# Clone and navigate to project
cd cronos-ai-agent-sdk-v5

# Install root dependencies
npm install

# Install core package dependencies
cd packages/core
npm install
cd ../..

# Install UI package dependencies
cd packages/ui
npm install
cd ../..

# Install example dependencies
cd packages/examples/standalone-test
npm install
cd ../../..
```

### Step 2: Run Individual Test Suites

#### Core SDK Tests
```bash
cd packages/core
npm test
```

**Expected Results**: 60+ tests passing including:
- Agent functionality tests
- Policy engine tests
- Policy pack enforcement tests
- SDK integration tests

#### Build Verification
```bash
cd packages/core
npm run build
```

**Expected**: Clean TypeScript compilation with no errors

#### Standalone Agent Tests
```bash
cd packages/examples/standalone-test
npm test
```

**Expected**: All 5 agents tested successfully

### Step 3: System Integration Testing

```bash
# From project root
node system-test.js
```

**Expected**: 17/17 tests passing with 100% success rate

### Step 4: Comprehensive Test Suite

```bash
# From project root
node test-all.js
```

**Expected**: All 7 test categories passing

### Step 5: UI Demo Testing

```bash
cd packages/examples/ui-demo
npm install
npm run dev
```

**Manual Testing**:
1. Open http://localhost:5173
2. Test agent dashboard functionality
3. Verify policy manager interface
4. Check event monitoring
5. Validate contract registry

## Test Configuration Files

### Jest Configuration (`packages/core/jest.config.js`)

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts']
};
```

### TypeScript Configuration

Each package includes `tsconfig.json` for proper TypeScript compilation and testing.

## Debugging Failed Tests

### Common Issues and Solutions

#### 1. Network Connection Issues
```bash
# Check Cronos testnet connectivity
curl -X POST https://evm-t3.cronos.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

#### 2. Dependency Issues
```bash
# Clean install all dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild packages
cd packages/core && npm run build
cd ../ui && npm run build
```

#### 3. TypeScript Compilation Errors
```bash
# Check TypeScript version compatibility
npx tsc --version

# Clean build
rm -rf dist
npm run build
```

### Verbose Testing

```bash
# Run tests with detailed output
cd packages/core
npm test -- --verbose

# Run specific test file
npm test -- --testNamePattern="RiskMonitor"

# Run with coverage report
npm run test:coverage
```

## Performance Testing

### Agent Execution Benchmarks

```bash
# Run performance tests
node system-test.js | grep "ms"
```

**Expected Performance**:
- Agent execution: < 5ms per agent
- SDK initialization: < 100ms
- Contract registration: < 200ms

## Test Data and Fixtures

### Mock Contract Addresses
- **WCRO Token**: `0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23`
- **Test Vault**: Used in integration tests
- **User Address**: `0x1234567890123456789012345678901234567890`

### Test Scenarios

#### Risk Levels
- **Low Risk**: Balance > Threshold
- **High Risk**: Balance < Threshold but > 25% of threshold
- **Critical Risk**: Balance < 25% of threshold

#### Liquidity Scenarios
- **Hold**: Current liquidity within 20% of target
- **Add**: Insufficient liquidity
- **Remove**: Excess liquidity

## Troubleshooting Guide

### Test Failures

1. **Check Prerequisites**:
   - Node.js version 16+
   - NPM version 8+
   - Internet connection for Cronos testnet

2. **Verify Installation**:
   ```bash
   npm list --depth=0
   ```

3. **Clean Environment**:
   ```bash
   npm run clean      # Removes dist folders only
   npm run clean:all  # Removes dist + all node_modules
   npm install
   ```

4. **Check Network**:
   ```bash
   ping evm-t3.cronos.org
   ```

### Getting Help

- Check `TEST_RESULTS.md` for detailed test output
- Review individual test files for specific requirements
- Ensure all environment variables are set correctly
- Verify Cronos testnet is accessible

## Success Criteria

### All Tests Passing
- ✅ 60+ unit tests in core package
- ✅ 17 system integration tests
- ✅ TypeScript compilation with no errors
- ✅ All 5 built-in agents functional
- ✅ Policy engine working correctly
- ✅ UI components rendering properly
- ✅ Network integration successful

### Performance Benchmarks
- ✅ Agent execution < 5ms
- ✅ SDK initialization < 100ms
- ✅ Memory usage < 50MB
- ✅ 100% test coverage on critical paths

This comprehensive testing approach ensures the Cronos AI Agent SDK is production-ready and reliable for enterprise deployment.