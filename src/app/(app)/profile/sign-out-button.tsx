"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    await authClient.signOut();
    toast.success("Déconnecté");
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <Button onClick={onClick} disabled={loading} variant="outline">
      {loading ? "Déconnexion..." : "Se déconnecter"}
    </Button>
  );
}
