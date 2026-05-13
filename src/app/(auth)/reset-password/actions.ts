'use server';

import { APIError } from 'better-auth/api';
import { z } from 'zod';
import { auth } from '@/lib/auth';

const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Lien invalide'),
    password: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export async function resetPasswordAction(
  input: ResetPasswordInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Données invalides',
    };
  }

  try {
    await auth.api.resetPassword({
      body: {
        newPassword: parsed.data.password,
        token: parsed.data.token,
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: 'Impossible de réinitialiser le mot de passe' };
  }

  return { ok: true };
}
