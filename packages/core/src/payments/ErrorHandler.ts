import { PaymentError } from './types';

export class PaymentErrorHandler {
  static handle402Error(error: any): PaymentError {
    if (error.status === 402 || error.statusCode === 402) {
      return {
        code: 'PAYMENT_REQUIRED',
        message: 'Payment required to continue',
        statusCode: 402,
        retryable: true
      };
    }
    
    return this.mapError(error);
  }

  static mapError(error: any): PaymentError {
    const statusCode = error.status || error.statusCode || 500;
    
    switch (statusCode) {
      case 400:
        return {
          code: 'INVALID_REQUEST',
          message: 'Invalid payment request',
          statusCode: 400,
          retryable: false
        };
      case 401:
        return {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
          statusCode: 401,
          retryable: false
        };
      case 402:
        return {
          code: 'PAYMENT_REQUIRED',
          message: 'Payment required',
          statusCode: 402,
          retryable: true
        };
      case 403:
        return {
          code: 'FORBIDDEN',
          message: 'Payment forbidden',
          statusCode: 403,
          retryable: false
        };
      case 429:
        return {
          code: 'RATE_LIMITED',
          message: 'Rate limit exceeded',
          statusCode: 429,
          retryable: true
        };
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          code: 'SERVER_ERROR',
          message: 'Server error occurred',
          statusCode,
          retryable: true
        };
      default:
        return {
          code: 'UNKNOWN_ERROR',
          message: error.message || 'Unknown payment error',
          statusCode,
          retryable: statusCode >= 500
        };
    }
  }

  static isRetryable(error: PaymentError): boolean {
    return error.retryable && [402, 429, 500, 502, 503, 504].includes(error.statusCode);
  }
}