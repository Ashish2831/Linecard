import { describe, expect, it } from 'vitest';
import { takeToken } from './rateLimit.js';

describe('takeToken (token bucket)', () => {
  const options = {
    capacity: 3,
    refillPerMs: 3 / 60_000, // 3 tokens per minute
  };

  it('starts full and consumes one token', () => {
    const next = takeToken(null, 1_000, options);
    expect(next).toEqual({ tokens: 2, updatedAt: 1_000 });
  });

  it('rejects when empty and no refill yet', () => {
    const empty = { tokens: 0.4, updatedAt: 1_000 };
    expect(takeToken(empty, 1_000, options)).toBeNull();
  });

  it('refills over time up to capacity', () => {
    const drained = { tokens: 0, updatedAt: 0 };
    // After a full window, bucket is full again → consume leaves capacity - 1
    const next = takeToken(drained, 60_000, options);
    expect(next?.tokens).toBeCloseTo(2, 5);
    expect(next?.updatedAt).toBe(60_000);
  });

  it('allows a burst up to capacity', () => {
    let state = takeToken(null, 0, options);
    state = takeToken(state, 0, options);
    state = takeToken(state, 0, options);
    expect(state?.tokens).toBeCloseTo(0, 5);
    expect(takeToken(state, 0, options)).toBeNull();
  });
});
