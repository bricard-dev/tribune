'use server';

import { APIError } from 'better-auth/api';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import {
  markVerificationEmailSent,
  setPendingVerificationEmail,
} from '@/lib/pending-verification';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { usernameSchema } from '@/lib/username';

const signUpSchema = z.object({
  username: usernameSchema,
  email: z.email('Adresse email invalide'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

type SignUpInput = z.infer<typeof signUpSchema>;

export type FieldAvailability =
  | { status: 'available' }
  | { status: 'taken' }
  | { status: 'invalid'; message: string };

export async function checkUsernameAvailability(
  input: string,
): Promise<FieldAvailability> {
  const ip = await getClientIp();
  const limit = await checkRateLimit('availabilityCheck', `username:${ip}`);
  if (!limit.ok) {
    return {
      status: 'invalid',
      message: `Trop de tentatives. Réessaie dans ${limit.retryAfterSeconds}s.`,
    };
  }

  const parsed = usernameSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: 'invalid',
      message: parsed.error.issues[0]?.message ?? 'Pseudo invalide',
    };
  }
  const existing = await prisma.user.findUnique({
    where: { username: parsed.data },
    select: { id: true },
  });
  return existing ? { status: 'taken' } : { status: 'available' };
}

const emailSchema = z.email('Adresse email invalide');

export async function checkEmailAvailability(
  input: string,
): Promise<FieldAvailability> {
  const ip = await getClientIp();
  const limit = await checkRateLimit('availabilityCheck', `email:${ip}`);
  if (!limit.ok) {
    return {
      status: 'invalid',
      message: `Trop de tentatives. Réessaie dans ${limit.retryAfterSeconds}s.`,
    };
  }

  const parsed = emailSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: 'invalid',
      message: parsed.error.issues[0]?.message ?? 'Adresse email invalide',
    };
  }
  const existing = await prisma.user.findUnique({
    where: { email: parsed.data },
    select: { id: true },
  });
  return existing ? { status: 'taken' } : { status: 'available' };
}

type SignUpFieldErrors = Partial<Record<keyof SignUpInput, string>>;

export type SignUpResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: SignUpFieldErrors };

export async function signUpAction(input: SignUpInput): Promise<SignUpResult> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Données invalides',
    };
  }

  const ip = await getClientIp();
  const limit = await checkRateLimit('signUp', ip);
  if (!limit.ok) {
    return {
      ok: false,
      error: `Trop de tentatives. Réessaie dans ${limit.retryAfterSeconds}s.`,
    };
  }

  const [existingUsername, existingEmail] = await Promise.all([
    prisma.user.findUnique({
      where: { username: parsed.data.username },
      select: { id: true },
    }),
    prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true },
    }),
  ]);

  const fieldErrors: SignUpFieldErrors = {};
  if (existingUsername) fieldErrors.username = 'Ce pseudo est déjà pris';
  if (existingEmail) fieldErrors.email = 'Cette adresse email est déjà utilisée';

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      error: fieldErrors.username ?? fieldErrors.email ?? 'Données invalides',
      fieldErrors,
    };
  }

  try {
    await auth.api.signUpEmail({
      body: {
        email: parsed.data.email,
        password: parsed.data.password,
        name: parsed.data.username,
        username: parsed.data.username,
        callbackURL: '/profile?verified=1',
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: 'Impossible de créer le compte' };
  }

  await setPendingVerificationEmail(parsed.data.email);
  await markVerificationEmailSent();
  return { ok: true };
}
