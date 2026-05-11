import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.url(),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.email(),
  VERCEL_ENV: z
    .enum(['development', 'preview', 'production'])
    .optional(),
  VERCEL_URL: z.string().optional(),
  // Upstash Redis — required outside of development. In dev, missing values
  // fall back to a no-op rate limiter so contributors don't need a Redis to run.
  UPSTASH_REDIS_REST_URL: z.url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
}).superRefine((data, ctx) => {
  // Required on Vercel production (Marketplace auto-injects them).
  // Local builds, dev, and preview tolerate their absence — the rate limiter
  // and secondary storage fall back to no-op / memory.
  if (data.VERCEL_ENV === 'production') {
    if (!data.UPSTASH_REDIS_REST_URL) {
      ctx.addIssue({
        code: 'custom',
        path: ['UPSTASH_REDIS_REST_URL'],
        message: 'UPSTASH_REDIS_REST_URL is required in production',
      });
    }
    if (!data.UPSTASH_REDIS_REST_TOKEN) {
      ctx.addIssue({
        code: 'custom',
        path: ['UPSTASH_REDIS_REST_TOKEN'],
        message: 'UPSTASH_REDIS_REST_TOKEN is required in production',
      });
    }
  }
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', z.treeifyError(parsed.error));
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;
