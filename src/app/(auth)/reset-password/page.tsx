import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getSession } from '@/lib/auth-helpers';
import { ResetPasswordForm } from './reset-password-form';

type SearchParams = Promise<{ token?: string; error?: string }>;

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await getSession();
  if (session) redirect('/');

  const { token, error } = await searchParams;

  if (error || !token) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-muted px-4 py-12">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="font-serif text-3xl tracking-tight">
              Lien invalide
            </CardTitle>
            <CardDescription>
              Ce lien de réinitialisation est expiré ou invalide.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-sm text-muted-foreground">
              <Link
                href="/forgot-password"
                className="text-foreground underline underline-offset-4"
              >
                Demander un nouveau lien
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-3xl tracking-tight">
            Nouveau mot de passe
          </CardTitle>
          <CardDescription>
            Choisis un nouveau mot de passe pour ton compte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm token={token} />
        </CardContent>
      </Card>
    </main>
  );
}
