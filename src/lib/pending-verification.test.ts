import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type CookieValue = { value: string };
const store = new Map<string, CookieValue>();

const cookiesMock = {
  get: vi.fn((name: string) => store.get(name)),
  set: vi.fn((name: string, value: string) => {
    store.set(name, { value });
  }),
  delete: vi.fn((name: string) => {
    store.delete(name);
  }),
};

vi.mock('next/headers', () => ({
  cookies: async () => cookiesMock,
}));

beforeEach(() => {
  store.clear();
  cookiesMock.get.mockClear();
  cookiesMock.set.mockClear();
  cookiesMock.delete.mockClear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('pending verification cookies', () => {
  it('round-trips the pending email via set/get', async () => {
    const {
      setPendingVerificationEmail,
      getPendingVerificationEmail,
    } = await import('./pending-verification');

    await setPendingVerificationEmail('user@example.com');

    expect(cookiesMock.set).toHaveBeenCalledWith(
      'tribune_pending_verification_email',
      'user@example.com',
      expect.objectContaining({ httpOnly: true, sameSite: 'lax', path: '/' }),
    );
    await expect(getPendingVerificationEmail()).resolves.toBe(
      'user@example.com',
    );
  });

  it('returns null when no pending email cookie is set', async () => {
    const { getPendingVerificationEmail } = await import(
      './pending-verification'
    );
    await expect(getPendingVerificationEmail()).resolves.toBeNull();
  });

  it('clears both the email and sent-at cookies', async () => {
    const {
      setPendingVerificationEmail,
      markVerificationEmailSent,
      clearPendingVerificationEmail,
      getPendingVerificationEmail,
    } = await import('./pending-verification');

    await setPendingVerificationEmail('user@example.com');
    await markVerificationEmailSent();
    await clearPendingVerificationEmail();

    expect(cookiesMock.delete).toHaveBeenCalledWith(
      'tribune_pending_verification_email',
    );
    expect(cookiesMock.delete).toHaveBeenCalledWith(
      'tribune_pending_verification_sent_at',
    );
    await expect(getPendingVerificationEmail()).resolves.toBeNull();
  });
});

describe('getResendCooldownRemaining', () => {
  it('returns 0 when the sent-at cookie is missing', async () => {
    const { getResendCooldownRemaining } = await import(
      './pending-verification'
    );
    await expect(getResendCooldownRemaining()).resolves.toBe(0);
  });

  it('returns 0 when the cookie value is not a finite number', async () => {
    store.set('tribune_pending_verification_sent_at', { value: 'not-a-number' });
    const { getResendCooldownRemaining } = await import(
      './pending-verification'
    );
    await expect(getResendCooldownRemaining()).resolves.toBe(0);
  });

  it('returns the remaining seconds within the cooldown window', async () => {
    const now = 1_700_000_000_000;
    vi.useFakeTimers();
    vi.setSystemTime(now);
    store.set('tribune_pending_verification_sent_at', {
      value: String(now - 20_000),
    });

    const {
      getResendCooldownRemaining,
      VERIFICATION_RESEND_COOLDOWN_SECONDS,
    } = await import('./pending-verification');

    await expect(getResendCooldownRemaining()).resolves.toBe(
      VERIFICATION_RESEND_COOLDOWN_SECONDS - 20,
    );
  });

  it('returns 0 once the cooldown has elapsed', async () => {
    const now = 1_700_000_000_000;
    vi.useFakeTimers();
    vi.setSystemTime(now);
    store.set('tribune_pending_verification_sent_at', {
      value: String(now - 120_000),
    });

    const { getResendCooldownRemaining } = await import(
      './pending-verification'
    );
    await expect(getResendCooldownRemaining()).resolves.toBe(0);
  });
});
