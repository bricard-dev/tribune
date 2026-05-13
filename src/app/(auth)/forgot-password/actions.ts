'use server';

import { z } from 'zod';
import { auth } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const forgotPasswordSchema = z.object({
  email: z.email('Adresse email invalide'),
});

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export async function forgotPasswordAction(
  input: ForgotPasswordInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Email invalide',
    };
  }

  const ip = await getClientIp();
  const limit = await checkRateLimit('forgotPassword', ip);
  if (!limit.ok) {
    // Still return ok:true to keep the enumeration-free contract.
    return { ok: true };
  }

  // Always succeed regardless of whether the account exists, to prevent
  // email enumeration. Errors are swallowed for the same reason.
  try {
    await auth.api.requestPasswordReset({
      body: {
        email: parsed.data.email,
        redirectTo: '/reset-password',
      },
    });
  } catch {
    // intentionally ignored
  }

  return { ok: true };
}
