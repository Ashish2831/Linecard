import type { NextFunction, Request, Response } from 'express';
import { RateLimitError } from '../domain/errors.js';
import { redisGet, redisSet } from '../lib/redis.js';
import { fail } from '../lib/responses.js';

export interface TokenBucketState {
  tokens: number;
  updatedAt: number;
}

export interface TokenBucketOptions {
  /** Bucket capacity (burst size). */
  capacity: number;
  /** Tokens added per millisecond. */
  refillPerMs: number;
}

/**
 * Pure token-bucket take: refill from elapsed time, then consume one token.
 * Returns null when the bucket is empty.
 */
export function takeToken(
  state: TokenBucketState | null,
  now: number,
  options: TokenBucketOptions,
): TokenBucketState | null {
  const previous = state ?? { tokens: options.capacity, updatedAt: now };
  const elapsed = Math.max(0, now - previous.updatedAt);
  const refilled = Math.min(
    options.capacity,
    previous.tokens + elapsed * options.refillPerMs,
  );

  if (refilled < 1) {
    return null;
  }

  return {
    tokens: refilled - 1,
    updatedAt: now,
  };
}

/**
 * Redis-backed token bucket.
 * `limit` = capacity (burst); tokens refill fully over `windowMs`.
 */
export function rateLimit(options: {
  name: string;
  limit: number;
  windowMs: number;
}) {
  const capacity = options.limit;
  const refillPerMs = options.limit / options.windowMs;
  const ttlSeconds = Math.max(1, Math.ceil((options.windowMs * 2) / 1000));

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.session?.user?.id ?? req.ip ?? 'anon';
      const key = `ratelimit:${options.name}:${id}`;
      const raw = await redisGet(key);
      const now = Date.now();
      const current: TokenBucketState | null = raw
        ? (JSON.parse(raw) as TokenBucketState)
        : null;

      const nextState = takeToken(current, now, { capacity, refillPerMs });
      if (!nextState) {
        throw new RateLimitError();
      }

      await redisSet(key, JSON.stringify(nextState), ttlSeconds);
      next();
    } catch (error) {
      fail(res, error);
    }
  };
}
