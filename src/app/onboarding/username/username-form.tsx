"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setUsername, type SetUsernameState } from "./actions";

const initialState: SetUsernameState = { error: null };

export function UsernameForm() {
  const [state, formAction, pending] = useActionState(setUsername, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Pseudo</Label>
        <Input
          id="username"
          name="username"
          required
          autoFocus
          autoComplete="off"
          minLength={3}
          maxLength={20}
          pattern="[a-zA-Z0-9][a-zA-Z0-9_-]*"
          placeholder="ton-pseudo"
          disabled={pending}
        />
        <p className="text-muted-foreground text-xs">
          3 à 20 caractères. Lettres, chiffres, tirets et underscores.
        </p>
      </div>
      {state.error ? (
        <p className="text-destructive text-sm" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Enregistrement..." : "Continuer"}
      </Button>
    </form>
  );
}
