"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

const usernameSchema = z
  .string()
  .trim()
  .min(3, "Au moins 3 caractères")
  .max(20, "20 caractères maximum")
  .regex(
    /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/,
    "Lettres, chiffres, _ ou - uniquement (doit commencer par une lettre ou un chiffre)",
  );

export type SetUsernameState = { error: string | null };

export async function setUsername(
  _prev: SetUsernameState,
  formData: FormData,
): Promise<SetUsernameState> {
  const user = await requireUser();

  if (user.onboarded) {
    redirect("/profile");
  }

  const parsed = usernameSchema.safeParse(formData.get("username"));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Pseudo invalide" };
  }

  const username = parsed.data;

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing && existing.id !== user.id) {
    return { error: "Ce pseudo est déjà pris" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { username, onboarded: true, name: username },
  });

  redirect("/profile");
}
