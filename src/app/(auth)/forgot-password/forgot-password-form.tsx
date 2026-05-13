'use client';

import { useForm } from '@tanstack/react-form';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { forgotPasswordAction } from './actions';

const forgotPasswordSchema = z.object({
  email: z.email('Adresse email invalide'),
});

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);

  const form = useForm({
    defaultValues: { email: '' },
    validators: { onSubmit: forgotPasswordSchema },
    onSubmit: async ({ value }) => {
      const result = await forgotPasswordAction({ email: value.email });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setSent(true);
      toast.success('Si un compte existe, un email vient de partir.');
    },
  });

  if (sent) {
    return (
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>
          Si un compte est associé à cet email, un lien de réinitialisation
          vient d&apos;y être envoyé. Pense à vérifier tes spams.
        </p>
        <p className="text-center">
          <Link
            href="/sign-in"
            className="text-foreground underline underline-offset-4"
          >
            Retour à la connexion
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field name="email">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Adresse email</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  autoComplete="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="example@mail.com"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Envoi...' : 'Envoyer le lien'}
            </Button>
          )}
        </form.Subscribe>
        <FieldDescription className="text-center">
          <Link
            href="/sign-in"
            className="text-foreground underline underline-offset-4"
          >
            Retour à la connexion
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
