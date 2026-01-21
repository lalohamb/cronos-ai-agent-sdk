# Testing Guide

## Quick Start

```bash
# Run all tests
npm test

# Run x402 payment tests
npm run test:x402

# Run payment system tests only
npm run test:payments

# Run with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

## Test Categories

### Payment Tests (`npm run test:payments`)
- PaymentManager retry logic
- Error handling and 402 responses
- Usage tracking and billing
- Provider fallback mechanisms

### x402 Integration Tests (`npm run test:x402`)
- HTTP 402 Payment Required flows
- API server payment endpoints
- End-to-end payment scenarios
- Multi-provider testing

## Test Files

```
src/
├── payments/__tests__/
│   ├── PaymentManager.test.ts    ✅
│   ├── ErrorHandler.test.ts      ✅
│   └── UsageTracker.test.ts      ✅
├── api/__tests__/
│   └── APIServer.test.ts         ✅
└── __tests__/integration/
    └── e2e-payment.test.ts       ✅
```

## Coverage

Run `npm run test:coverage` to generate coverage reports in `coverage/` directory.

For detailed x402 testing documentation, see [X402_TESTING_README.md](../../../X402_TESTING_README.md).