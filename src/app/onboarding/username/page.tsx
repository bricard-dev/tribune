import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireUser } from "@/lib/auth-helpers";
import { UsernameForm } from "./username-form";

export default async function OnboardingUsernamePage() {
  const user = await requireUser();
  if (user.onboarded) redirect("/profile");

  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Choisis ton pseudo</CardTitle>
          <CardDescription>
            C&apos;est sous ce nom que tu apparaîtras dans le classement.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsernameForm />
        </CardContent>
      </Card>
    </main>
  );
}
