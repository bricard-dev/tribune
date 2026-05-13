'use client';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { cn } from '@/lib/utils';
import { USERNAME_MIN, usernameSchema } from '@/lib/username';
import {
  checkEmailAvailability,
  checkUsernameAvailability,
  signUpAction,
} from './actions';
import { useForm } from '@tanstack/react-form';
import { Check, LoaderCircle, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

const signUpSchema = z
  .object({
    username: usernameSchema,
    email: z.email('Adresse email invalide'),
    password: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export function SignUpForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' },
    validators: { onSubmit: signUpSchema },
    onSubmit: async ({ value }) => {
      setSubmitError(null);
      const result = await signUpAction({
        username: value.username,
        email: value.email,
        password: value.password,
      });

      if (!result.ok) {
        if (result.fieldErrors) {
          for (const [name, message] of Object.entries(result.fieldErrors)) {
            if (!message) continue;
            form.setFieldMeta(name as keyof typeof value, (prev) => ({
              ...prev,
              isTouched: true,
              errors: [message],
              errorMap: { ...prev.errorMap, onServer: message },
            }));
          }
          return;
        }
        setSubmitError(result.error);
        return;
      }

      toast.success('Compte créé', {
        description: 'Vérifie ta boîte mail pour confirmer ton adresse.',
      });
      router.push('/verify-email');
    },
  });

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field
          name="username"
          asyncDebounceMs={400}
          validators={{
            onChangeAsync: async ({ value }) => {
              if (!value || value.length < USERNAME_MIN) return undefined;
              const result = await checkUsernameAvailability(value);
              if (result.status === 'available') return undefined;
              if (result.status === 'taken') return 'Ce pseudo est déjà pris';
              return result.message;
            },
          }}
        >
          {(field) => {
            const value = field.state.value;
            const isLongEnough = value.length >= USERNAME_MIN;
            const isValidating = field.state.meta.isValidating;
            const hasErrors = field.state.meta.errors.length > 0;
            const showAsInvalid = isLongEnough && hasErrors;
            const showAsAvailable =
              isLongEnough && !isValidating && !hasErrors;

            return (
              <Field data-invalid={showAsInvalid}>
                <FieldLabel htmlFor={field.name}>Pseudo</FieldLabel>
                <div className="relative">
                  <Input
                    id={field.name}
                    name={field.name}
                    autoComplete="username"
                    value={value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={showAsInvalid}
                    valid={showAsAvailable}
                    placeholder="ton-pseudo"
                    className={cn(isLongEnough && 'pr-8')}
                  />
                  {isLongEnough && (
                    <span
                      className="pointer-events-none absolute inset-y-0 right-2 flex items-center"
                      aria-hidden
                    >
                      {isValidating ? (
                        <LoaderCircle className="text-muted-foreground size-4 animate-spin" />
                      ) : showAsInvalid ? (
                        <X className="text-destructive size-4" />
                      ) : showAsAvailable ? (
                        <Check className="size-4 text-emerald-600" />
                      ) : null}
                    </span>
                  )}
                </div>
                <FieldDescription>
                  3 à 20 caractères. Lettres, chiffres, tirets et underscores.
                </FieldDescription>
                {showAsInvalid && (
                  <FieldError
                    errors={field.state.meta.errors.map((error) =>
                      typeof error === 'string' ? { message: error } : error,
                    )}
                  />
                )}
              </Field>
            );
          }}
        </form.Field>
        <form.Field
          name="email"
          asyncDebounceMs={400}
          validators={{
            onChangeAsync: async ({ value }) => {
              if (!value || !value.includes('@')) return undefined;
              const result = await checkEmailAvailability(value);
              if (result.status === 'available') return undefined;
              if (result.status === 'taken')
                return 'Cette adresse email est déjà utilisée';
              return result.message;
            },
          }}
        >
          {(field) => {
            const value = field.state.value;
            const looksLikeEmail = value.includes('@');
            const isValidating = field.state.meta.isValidating;
            const hasErrors = field.state.meta.errors.length > 0;
            const showAsInvalid = looksLikeEmail && hasErrors;
            const showAsAvailable =
              looksLikeEmail && !isValidating && !hasErrors;

            return (
              <Field data-invalid={showAsInvalid}>
                <FieldLabel htmlFor={field.name}>Adresse email</FieldLabel>
                <div className="relative">
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    autoComplete="email"
                    value={value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={showAsInvalid}
                    valid={showAsAvailable}
                    placeholder="toi@exemple.fr"
                    className={cn(looksLikeEmail && 'pr-8')}
                  />
                  {looksLikeEmail && (
                    <span
                      className="pointer-events-none absolute inset-y-0 right-2 flex items-center"
                      aria-hidden
                    >
                      {isValidating ? (
                        <LoaderCircle className="text-muted-foreground size-4 animate-spin" />
                      ) : showAsInvalid ? (
                        <X className="text-destructive size-4" />
                      ) : showAsAvailable ? (
                        <Check className="size-4 text-emerald-600" />
                      ) : null}
                    </span>
                  )}
                </div>
                {showAsInvalid && (
                  <FieldError
                    errors={field.state.meta.errors.map((error) =>
                      typeof error === 'string' ? { message: error } : error,
                    )}
                  />
                )}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="password">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Mot de passe</FieldLabel>
                <PasswordInput
                  id={field.name}
                  name={field.name}
                  autoComplete="new-password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                />
                <FieldDescription>8 caractères minimum.</FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="confirmPassword">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Confirmer le mot de passe
                </FieldLabel>
                <PasswordInput
                  id={field.name}
                  name={field.name}
                  autoComplete="new-password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        {submitError ? (
          <p className="text-destructive text-sm" role="alert">
            {submitError}
          </p>
        ) : null}
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Création...' : 'Créer mon compte'}
            </Button>
          )}
        </form.Subscribe>
        <FieldDescription className="text-center">
          Déjà un compte ?{' '}
          <Link
            href="/sign-in"
            className="text-foreground underline underline-offset-4"
          >
            Se connecter
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
