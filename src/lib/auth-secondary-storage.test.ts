import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const redisMock = {
  get: vi.fn(),
  set: vi.fn(),
  del: vi.fn(),
};

beforeEach(() => {
  vi.resetModules();
  redisMock.get.mockReset();
  redisMock.set.mockReset();
  redisMock.del.mockReset();
});

afterEach(() => {
  vi.doUnmock('@/lib/redis');
});

describe('redisSecondaryStorage (Upstash configured)', () => {
  async function loadStorage() {
    vi.doMock('@/lib/redis', () => ({ redis: redisMock }));
    const mod = await import('./auth-secondary-storage');
    if (!mod.redisSecondaryStorage) {
      throw new Error('expected secondary storage to be configured');
    }
    return mod.redisSecondaryStorage;
  }

  it('returns null when Redis has no value', async () => {
    redisMock.get.mockResolvedValueOnce(null);
    const storage = await loadStorage();
    await expect(storage.get('session:abc')).resolves.toBeNull();
  });

  it('returns null when Redis returns undefined', async () => {
    redisMock.get.mockResolvedValueOnce(undefined);
    const storage = await loadStorage();
    await expect(storage.get('session:abc')).resolves.toBeNull();
  });

  it('returns the raw string when Redis returns a string', async () => {
    redisMock.get.mockResolvedValueOnce('{"foo":"bar"}');
    const storage = await loadStorage();
    await expect(storage.get('session:abc')).resolves.toBe('{"foo":"bar"}');
  });

  it('re-serializes non-string Redis payloads to JSON', async () => {
    redisMock.get.mockResolvedValueOnce({ foo: 'bar' });
    const storage = await loadStorage();
    await expect(storage.get('session:abc')).resolves.toBe('{"foo":"bar"}');
  });

  it('stores a string value as-is without TTL', async () => {
    const storage = await loadStorage();
    await storage.set('session:abc', 'plain-string');
    expect(redisMock.set).toHaveBeenCalledWith('session:abc', 'plain-string');
  });

  it('stores a string value with TTL via ex option', async () => {
    const storage = await loadStorage();
    await storage.set('session:abc', 'plain-string', 600);
    expect(redisMock.set).toHaveBeenCalledWith('session:abc', 'plain-string', {
      ex: 600,
    });
  });

  it('JSON-stringifies non-string values before storing', async () => {
    const storage = await loadStorage();
    await storage.set(
      'session:abc',
      { foo: 'bar' } as unknown as string,
      120,
    );
    expect(redisMock.set).toHaveBeenCalledWith(
      'session:abc',
      '{"foo":"bar"}',
      { ex: 120 },
    );
  });

  it('delegates delete to redis.del', async () => {
    const storage = await loadStorage();
    await storage.delete('session:abc');
    expect(redisMock.del).toHaveBeenCalledWith('session:abc');
  });
});

describe('redisSecondaryStorage (Upstash absent)', () => {
  it('is null when redis is null', async () => {
    vi.doMock('@/lib/redis', () => ({ redis: null }));
    const { redisSecondaryStorage } = await import('./auth-secondary-storage');
    expect(redisSecondaryStorage).toBeNull();
  });
});
