import { z } from 'zod';

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 20;
export const USERNAME_PATTERN = '[a-zA-Z0-9][a-zA-Z0-9_-]*';

export const usernameSchema = z
  .string()
  .trim()
  .min(USERNAME_MIN, `Au moins ${USERNAME_MIN} caractères`)
  .max(USERNAME_MAX, `${USERNAME_MAX} caractères maximum`)
  .regex(
    new RegExp(`^${USERNAME_PATTERN}$`),
    'Lettres, chiffres, _ ou - uniquement (doit commencer par une lettre ou un chiffre)',
  );
