import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";
import { requireUser } from "@/lib/auth-guards";
import { SignOutButton } from "./sign-out-button";
import { VerifiedToast } from "./verified-toast";

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-12">
      <Suspense>
        <VerifiedToast />
      </Suspense>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>Connecté en tant que :</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <p className="text-base font-medium">{user.username}</p>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>
          <SignOutButton />
        </CardContent>
      </Card>
    </main>
  );
}
