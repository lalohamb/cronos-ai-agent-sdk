import { UsageTracker } from '../UsageTracker';

describe('UsageTracker x402 Tests', () => {
  let tracker: UsageTracker;

  beforeEach(() => {
    tracker = new UsageTracker();
  });

  test('should track usage correctly', () => {
    const record = tracker.track('user123', 'ai-inference', 0.05, 'USD');

    expect(record.userId).toBe('user123');
    expect(record.service).toBe('ai-inference');
    expect(record.amount).toBe(0.05);
    expect(record.currency).toBe('USD');
  });

  test('should calculate total usage', () => {
    tracker.track('user123', 'service1', 10, 'USD');
    tracker.track('user123', 'service2', 15, 'USD');
    tracker.track('user456', 'service1', 5, 'USD');

    const total = tracker.getTotalUsage('user123', 'USD');
    expect(total).toBe(25);
  });

  test('should filter usage by date range', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);

    tracker.track('user123', 'service1', 10, 'USD');

    const usage = tracker.getUsage('user123', yesterday, tomorrow);
    expect(usage).toHaveLength(1);
  });
});