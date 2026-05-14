import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireGuest } from "@/lib/auth-guards";
import { SignInForm } from "./sign-in-form";

export default async function SignInPage() {
  await requireGuest();

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-3xl tracking-tight">
            Connexion
          </CardTitle>
          <CardDescription>
            Connecte-toi avec ton email et ton mot de passe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </main>
  );
}
