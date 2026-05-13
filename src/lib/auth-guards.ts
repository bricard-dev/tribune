import { redirect } from 'next/navigation';
import { getCurrentUser, getSession } from '@/lib/auth-helpers';
import { getPendingVerificationEmail } from '@/lib/pending-verification';

/**
 * Pages réservées aux visiteurs (sign-in, sign-up, forgot-password).
 * Une vérification en cours n'est PAS bloquante : l'utilisateur peut
 * vouloir se connecter avec un autre compte ou réinitialiser son mdp.
 */
export async function requireGuest() {
  const session = await getSession();
  if (session) redirect('/');
}

/**
 * Page /verify-email : il faut un cookie de vérification en cours
 * ET ne pas avoir déjà vérifié l'email.
 */
export async function requirePendingVerification(): Promise<string> {
  const session = await getSession();
  if (session?.user?.emailVerified) redirect('/profile');
  const email = await getPendingVerificationEmail();
  if (!email) redirect('/sign-in');
  return email;
}

/**
 * Pages applicatives : il faut une session vérifiée.
 * - vérification en cours → /verify-email
 * - sinon → /sign-in
 */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    const pending = await getPendingVerificationEmail();
    redirect(pending ? '/verify-email' : '/sign-in');
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== 'ADMIN') redirect('/');
  return user;
}
