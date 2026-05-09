"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

type Status = "idle" | "loading" | "sent" | "error";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    const { error } = await authClient.signIn.magicLink({
      email,
      callbackURL: "/profile",
    });

    if (error) {
      setStatus("error");
      setErrorMessage(
        error.message ?? "Impossible d'envoyer le lien. Réessaye dans un instant.",
      );
      return;
    }

    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="space-y-2 text-sm">
        <p className="font-medium">Lien envoyé.</p>
        <p className="text-muted-foreground">
          Vérifie ta boîte mail à l&apos;adresse{" "}
          <span className="font-medium text-foreground">{email}</span>. Le lien
          est valable 5 minutes.
        </p>
        <button
          type="button"
          className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          onClick={() => {
            setStatus("idle");
            setEmail("");
          }}
        >
          Utiliser une autre adresse
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Adresse email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="toi@exemple.fr"
          disabled={status === "loading"}
        />
      </div>
      {errorMessage ? (
        <p className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={status === "loading"}>
        {status === "loading" ? "Envoi..." : "Recevoir mon lien de connexion"}
      </Button>
    </form>
  );
}
