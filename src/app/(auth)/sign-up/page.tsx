import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireGuest } from "@/lib/auth-guards";
import { SignUpForm } from "./sign-up-form";

export default async function SignUpPage() {
  await requireGuest();

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-3xl tracking-tight">
            Créer un compte
          </CardTitle>
          <CardDescription>
            Choisis un pseudo, il t&apos;identifiera dans le classement.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </main>
  );
}
