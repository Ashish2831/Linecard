import { createClient, type RedisClientType } from 'redis';
import { config } from '../config.js';
import { logger } from './logger.js';

let client: RedisClientType | null = null;
let memoryFallback = false;

const memoryStore = new Map<string, { value: string; expiresAt?: number }>();

export function usingMemoryRedis(): boolean {
  return memoryFallback;
}

export async function getRedis(): Promise<RedisClientType | null> {
  if (memoryFallback) return null;
  if (client?.isOpen) return client;

  if (!config.redisUrl) {
    memoryFallback = true;
    logger.warn('REDIS_URL not set; using in-memory fallback');
    return null;
  }

  try {
    client = createClient({ url: config.redisUrl });
    client.on('error', (err) => {
      logger.warn('Redis client error', { message: err.message });
    });
    await client.connect();
    await client.ping();
    logger.info('Connected to Redis');
    return client;
  } catch (error) {
    logger.warn('Redis unavailable; using in-memory fallback', {
      message: error instanceof Error ? error.message : 'unknown',
    });
    if (client) {
      try {
        await client.quit();
      } catch {
        /* ignore */
      }
    }
    client = null;
    memoryFallback = true;
    return null;
  }
}

export async function redisGet(key: string): Promise<string | null> {
  const redis = await getRedis();
  if (!redis) {
    const entry = memoryStore.get(key);
    if (!entry) return null;
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      memoryStore.delete(key);
      return null;
    }
    return entry.value;
  }
  return redis.get(key);
}

export async function redisSet(
  key: string,
  value: string,
  ttlSeconds?: number,
): Promise<void> {
  const redis = await getRedis();
  if (!redis) {
    memoryStore.set(key, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined,
    });
    return;
  }
  if (ttlSeconds) {
    await redis.set(key, value, { EX: ttlSeconds });
  } else {
    await redis.set(key, value);
  }
}

export async function redisDel(key: string): Promise<void> {
  const redis = await getRedis();
  if (!redis) {
    memoryStore.delete(key);
    return;
  }
  await redis.del(key);
}

export async function redisPing(): Promise<boolean> {
  const redis = await getRedis();
  if (!redis) return memoryFallback;
  const result = await redis.ping();
  return result === 'PONG';
}
