import { headers } from 'next/headers';
import { Ratelimit } from '@upstash/ratelimit';
import { redis } from '@/lib/redis';

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSeconds: number };

type LimiterSpec = {
  /** Number of allowed requests per window. */
  limit: number;
  /** Window size, e.g. "60 s", "1 m", "1 h". */
  window: Parameters<typeof Ratelimit.slidingWindow>[1];
  /** Prefix used in Redis keys to namespace this limiter. */
  prefix: string;
};

/**
 * In dev (no Upstash configured), this is a no-op limiter that always allows.
 * Outside dev, env validation guarantees Upstash is configured.
 */
function buildLimiter(spec: LimiterSpec): Ratelimit | null {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(spec.limit, spec.window),
    prefix: `tribune:rl:${spec.prefix}`,
    analytics: false,
  });
}

const limiters = {
  signIn: buildLimiter({ limit: 5, window: '1 m', prefix: 'sign-in' }),
  signUp: buildLimiter({ limit: 3, window: '1 m', prefix: 'sign-up' }),
  forgotPassword: buildLimiter({
    limit: 3,
    window: '15 m',
    prefix: 'forgot-password',
  }),
  resendVerification: buildLimiter({
    limit: 3,
    window: '5 m',
    prefix: 'resend-verification',
  }),
  availabilityCheck: buildLimiter({
    limit: 20,
    window: '1 m',
    prefix: 'availability-check',
  }),
} as const;

export type LimiterName = keyof typeof limiters;

export async function checkRateLimit(
  name: LimiterName,
  identifier: string,
): Promise<RateLimitResult> {
  const limiter = limiters[name];
  if (!limiter) return { ok: true };

  const result = await limiter.limit(identifier);
  if (result.success) return { ok: true };

  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((result.reset - Date.now()) / 1000),
  );
  return { ok: false, retryAfterSeconds };
}

export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwardedFor = h.get('x-forwarded-for');
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0]?.trim();
    if (first) return first;
  }
  return h.get('x-real-ip') ?? 'unknown';
}
