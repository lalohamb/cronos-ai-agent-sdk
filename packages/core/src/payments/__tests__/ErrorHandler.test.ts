import { PaymentErrorHandler } from '../ErrorHandler';

describe('PaymentErrorHandler x402 Tests', () => {
  test('should handle 402 error correctly', () => {
    const error = { status: 402, message: 'Payment Required' };
    const result = PaymentErrorHandler.handle402Error(error);

    expect(result.code).toBe('PAYMENT_REQUIRED');
    expect(result.statusCode).toBe(402);
    expect(result.retryable).toBe(true);
  });

  test('should map various error codes', () => {
    const testCases = [
      { input: { status: 400 }, expected: { code: 'INVALID_REQUEST', statusCode: 400 } },
      { input: { status: 401 }, expected: { code: 'UNAUTHORIZED', statusCode: 401 } },
      { input: { status: 402 }, expected: { code: 'PAYMENT_REQUIRED', statusCode: 402 } },
      { input: { status: 429 }, expected: { code: 'RATE_LIMITED', statusCode: 429 } }
    ];

    testCases.forEach(({ input, expected }) => {
      const result = PaymentErrorHandler.mapError(input);
      expect(result.code).toBe(expected.code);
      expect(result.statusCode).toBe(expected.statusCode);
    });
  });
});