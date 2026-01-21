import '@testing-library/jest-dom';

// Global test configuration
global.console = {
  ...console,
  // Suppress console.warn in tests
  warn: jest.fn(),
};