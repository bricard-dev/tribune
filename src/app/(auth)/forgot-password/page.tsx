import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { requireGuest } from '@/lib/auth-guards';
import { ForgotPasswordForm } from './forgot-password-form';

export default async function ForgotPasswordPage() {
  await requireGuest();

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-3xl tracking-tight">
            Mot de passe oublié
          </CardTitle>
          <CardDescription>
            Renseigne ton email pour recevoir un lien de réinitialisation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </main>
  );
}
