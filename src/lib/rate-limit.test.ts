import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type LimitFn = (id: string) => Promise<{
  success: boolean;
  reset: number;
  limit: number;
  remaining: number;
}>;

const limitMock = vi.fn<LimitFn>();

vi.mock('@upstash/ratelimit', () => {
  class Ratelimit {
    static slidingWindow = vi.fn(() => 'sliding-window');
    limit: LimitFn;
    constructor() {
      this.limit = limitMock;
    }
  }
  return { Ratelimit };
});

const headersGet = vi.fn<(name: string) => string | null>();
vi.mock('next/headers', () => ({
  headers: async () => ({ get: headersGet }),
}));

describe('checkRateLimit (Upstash configured)', () => {
  beforeEach(() => {
    vi.resetModules();
    limitMock.mockReset();
    vi.doMock('@/lib/redis', () => ({ redis: {} }));
  });

  afterEach(() => {
    vi.doUnmock('@/lib/redis');
  });

  it('returns ok when the underlying limiter succeeds', async () => {
    limitMock.mockResolvedValueOnce({
      success: true,
      reset: Date.now() + 60_000,
      limit: 5,
      remaining: 4,
    });
    const { checkRateLimit } = await import('./rate-limit');

    await expect(checkRateLimit('signIn', '1.2.3.4')).resolves.toEqual({
      ok: true,
    });
    expect(limitMock).toHaveBeenCalledWith('1.2.3.4');
  });

  it('returns retryAfterSeconds rounded up when blocked', async () => {
    const now = 1_700_000_000_000;
    vi.useFakeTimers();
    vi.setSystemTime(now);
    limitMock.mockResolvedValueOnce({
      success: false,
      reset: now + 12_300,
      limit: 5,
      remaining: 0,
    });
    const { checkRateLimit } = await import('./rate-limit');

    await expect(checkRateLimit('signIn', '1.2.3.4')).resolves.toEqual({
      ok: false,
      retryAfterSeconds: 13,
    });
    vi.useRealTimers();
  });

  it('clamps retryAfterSeconds to at least 1 when reset is in the past', async () => {
    const now = 1_700_000_000_000;
    vi.useFakeTimers();
    vi.setSystemTime(now);
    limitMock.mockResolvedValueOnce({
      success: false,
      reset: now - 5_000,
      limit: 5,
      remaining: 0,
    });
    const { checkRateLimit } = await import('./rate-limit');

    await expect(checkRateLimit('signIn', '1.2.3.4')).resolves.toEqual({
      ok: false,
      retryAfterSeconds: 1,
    });
    vi.useRealTimers();
  });
});

describe('checkRateLimit (Upstash env vars absent)', () => {
  beforeEach(() => {
    vi.resetModules();
    limitMock.mockReset();
    vi.doMock('@/lib/redis', () => ({ redis: null }));
  });

  afterEach(() => {
    vi.doUnmock('@/lib/redis');
  });

  it('is a no-op that always allows', async () => {
    const { checkRateLimit } = await import('./rate-limit');

    await expect(checkRateLimit('signUp', 'anything')).resolves.toEqual({
      ok: true,
    });
    expect(limitMock).not.toHaveBeenCalled();
  });
});

describe('getClientIp', () => {
  beforeEach(() => {
    vi.resetModules();
    headersGet.mockReset();
    vi.doMock('@/lib/redis', () => ({ redis: null }));
  });

  afterEach(() => {
    vi.doUnmock('@/lib/redis');
  });

  it('returns the first IP from x-forwarded-for', async () => {
    headersGet.mockImplementation((name) =>
      name === 'x-forwarded-for' ? '203.0.113.1, 10.0.0.1, 10.0.0.2' : null,
    );
    const { getClientIp } = await import('./rate-limit');

    await expect(getClientIp()).resolves.toBe('203.0.113.1');
  });

  it('falls back to x-real-ip when x-forwarded-for is absent', async () => {
    headersGet.mockImplementation((name) =>
      name === 'x-real-ip' ? '198.51.100.7' : null,
    );
    const { getClientIp } = await import('./rate-limit');

    await expect(getClientIp()).resolves.toBe('198.51.100.7');
  });

  it("returns 'unknown' when no IP header is present", async () => {
    headersGet.mockReturnValue(null);
    const { getClientIp } = await import('./rate-limit');

    await expect(getClientIp()).resolves.toBe('unknown');
  });

  it('ignores an empty x-forwarded-for first segment', async () => {
    headersGet.mockImplementation((name) => {
      if (name === 'x-forwarded-for') return '   , 10.0.0.1';
      if (name === 'x-real-ip') return '198.51.100.7';
      return null;
    });
    const { getClientIp } = await import('./rate-limit');

    await expect(getClientIp()).resolves.toBe('198.51.100.7');
  });
});
