'use server';

import { headers } from 'next/headers';
import { APIError } from 'better-auth/api';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import {
  clearPendingVerificationEmail,
  markVerificationEmailSent,
  setPendingVerificationEmail,
} from '@/lib/pending-verification';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const signInSchema = z.object({
  email: z.email('Adresse email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
  rememberMe: z.boolean(),
});

type SignInInput = z.infer<typeof signInSchema>;

type SignInResult =
  | { ok: true }
  | { ok: false; needsVerification: true }
  | { ok: false; needsVerification?: false; error: string };

export async function signInAction(input: SignInInput): Promise<SignInResult> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Données invalides',
    };
  }

  const ip = await getClientIp();
  const limit = await checkRateLimit(
    'signIn',
    `${ip}:${parsed.data.email.toLowerCase()}`,
  );
  if (!limit.ok) {
    return {
      ok: false,
      error: `Trop de tentatives. Réessaie dans ${limit.retryAfterSeconds}s.`,
    };
  }

  try {
    await auth.api.signInEmail({
      body: {
        email: parsed.data.email,
        password: parsed.data.password,
        rememberMe: parsed.data.rememberMe,
      },
      headers: await headers(),
    });
  } catch (error) {
    if (error instanceof APIError) {
      const code = (error as APIError & { body?: { code?: string } }).body?.code;
      const statusCode = (error as APIError & { statusCode?: number }).statusCode;
      const isUnverified =
        code === 'EMAIL_NOT_VERIFIED' ||
        error.status === 'FORBIDDEN' ||
        statusCode === 403;
      if (isUnverified) {
        await setPendingVerificationEmail(parsed.data.email);
        try {
          await auth.api.sendVerificationEmail({
            body: { email: parsed.data.email, callbackURL: '/profile?verified=1' },
          });
          await markVerificationEmailSent();
        } catch {
          // Rate-limited or transient — user can use the resend button.
        }
        return { ok: false, needsVerification: true };
      }
      return { ok: false, error: error.message };
    }
    return { ok: false, error: 'Identifiants invalides' };
  }

  await clearPendingVerificationEmail();
  return { ok: true };
}
