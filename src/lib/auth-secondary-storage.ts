import type { SecondaryStorage } from 'better-auth';
import { redis } from '@/lib/redis';

/**
 * Better Auth secondary storage backed by Upstash Redis.
 * Returns `null` (no-op) in dev when Upstash isn't configured —
 * Better Auth falls back to the primary database transparently.
 */
function build(client: NonNullable<typeof redis>): SecondaryStorage {
  return {
    async get(key) {
      const value = await client.get(key);
      if (value === null || value === undefined) return null;
      return typeof value === 'string' ? value : JSON.stringify(value);
    },
    async set(key, value, ttl) {
      const stringValue =
        typeof value === 'string' ? value : JSON.stringify(value);
      if (ttl) {
        await client.set(key, stringValue, { ex: ttl });
      } else {
        await client.set(key, stringValue);
      }
    },
    async delete(key) {
      await client.del(key);
    },
  };
}

export const redisSecondaryStorage: SecondaryStorage | null = redis
  ? build(redis)
  : null;
