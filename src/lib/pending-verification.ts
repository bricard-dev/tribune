import { cookies } from 'next/headers';

const COOKIE_NAME = 'tribune_pending_verification_email';
const SENT_AT_COOKIE_NAME = 'tribune_pending_verification_sent_at';
const MAX_AGE_SECONDS = 60 * 30;
export const VERIFICATION_RESEND_COOLDOWN_SECONDS = 60;

export async function setPendingVerificationEmail(email: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, email, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function getPendingVerificationEmail() {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

export async function clearPendingVerificationEmail() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
  store.delete(SENT_AT_COOKIE_NAME);
}

export async function markVerificationEmailSent() {
  const store = await cookies();
  store.set(SENT_AT_COOKIE_NAME, String(Date.now()), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function getResendCooldownRemaining(): Promise<number> {
  const store = await cookies();
  const raw = store.get(SENT_AT_COOKIE_NAME)?.value;
  if (!raw) return 0;
  const sentAt = Number(raw);
  if (!Number.isFinite(sentAt)) return 0;
  const elapsed = Math.floor((Date.now() - sentAt) / 1000);
  const remaining = VERIFICATION_RESEND_COOLDOWN_SECONDS - elapsed;
  return remaining > 0 ? remaining : 0;
}
