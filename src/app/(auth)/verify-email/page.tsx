import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { requirePendingVerification } from '@/lib/auth-guards';
import { getResendCooldownRemaining } from '@/lib/pending-verification';
import { ResendVerificationButton } from './resend-verification-button';

export default async function VerifyEmailPage() {
  const email = await requirePendingVerification();
  const initialCooldown = await getResendCooldownRemaining();

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-3xl tracking-tight">
            Vérifie ton email
          </CardTitle>
          <CardDescription>
            On a envoyé un lien de confirmation à{' '}
            <span className="text-foreground font-medium">{email}</span>. Clique
            dessus pour activer ton compte.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ResendVerificationButton initialCooldown={initialCooldown} />
          <p className="text-center text-sm text-muted-foreground">
            <Link
              href="/sign-in"
              className="text-foreground underline underline-offset-4"
            >
              Retour à la connexion
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
