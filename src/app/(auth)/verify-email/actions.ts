'use server';

import { APIError } from 'better-auth/api';
import { auth } from '@/lib/auth';
import {
  getPendingVerificationEmail,
  markVerificationEmailSent,
} from '@/lib/pending-verification';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function resendVerificationAction(): Promise<
  { ok: true } | { ok: false; error: string }
> {
  const email = await getPendingVerificationEmail();
  if (!email) {
    return {
      ok: false,
      error: 'Session expirée. Reconnecte-toi pour recevoir un nouveau lien.',
    };
  }

  const ip = await getClientIp();
  const limit = await checkRateLimit(
    'resendVerification',
    `${ip}:${email.toLowerCase()}`,
  );
  if (!limit.ok) {
    return {
      ok: false,
      error: `Patiente ${limit.retryAfterSeconds}s avant un nouvel envoi.`,
    };
  }

  try {
    await auth.api.sendVerificationEmail({
      body: { email, callbackURL: '/profile?verified=1' },
    });
  } catch (error) {
    if (error instanceof APIError) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: "Impossible d'envoyer l'email pour le moment." };
  }

  await markVerificationEmailSent();
  return { ok: true };
}
