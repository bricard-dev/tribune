import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { waitUntil } from "@vercel/functions";
import { env } from "@/env";
import { redisSecondaryStorage } from "@/lib/auth-secondary-storage";
import {
  renderResetPasswordEmail,
  renderVerificationEmail,
  sendEmail,
} from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { usernameSchema } from "@/lib/username";

const baseURL =
  env.VERCEL_ENV === "preview" && env.VERCEL_URL
    ? `https://${env.VERCEL_URL}`
    : env.BETTER_AUTH_URL;

const trustedOrigins = [env.BETTER_AUTH_URL];
if (env.VERCEL_URL) trustedOrigins.push(`https://${env.VERCEL_URL}`);

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL,
  trustedOrigins,
  advanced: {
    backgroundTasks: {
      handler: (promise) => waitUntil(promise),
    },
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  ...(redisSecondaryStorage
    ? { secondaryStorage: redisSecondaryStorage }
    : {}),
  rateLimit: {
    enabled: true,
    storage: redisSecondaryStorage ? "secondary-storage" : "memory",
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
      "/sign-up/email": { window: 60, max: 3 },
      "/request-password-reset": { window: 900, max: 3 },
      "/send-verification-email": { window: 300, max: 3 },
      "/reset-password": { window: 600, max: 5 },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: false,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    resetPasswordTokenExpiresIn: 60 * 60,
    sendResetPassword: async ({ user, url }) => {
      const { html, text } = await renderResetPasswordEmail(url);
      await sendEmail({
        to: user.email,
        subject: "Réinitialise ton mot de passe — Tribune",
        html,
        text,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60,
    sendVerificationEmail: async ({ user, url }) => {
      const { html, text } = await renderVerificationEmail(url);
      await sendEmail({
        to: user.email,
        subject: "Confirme ton email — Tribune",
        html,
        text,
      });
    },
  },
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: true,
        input: true,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const parsed = usernameSchema.safeParse(
            (user as { username?: unknown }).username,
          );
          if (!parsed.success) {
            throw new APIError("BAD_REQUEST", {
              message: parsed.error.issues[0]?.message ?? "Pseudo invalide",
            });
          }
          const username = parsed.data;
          const taken = await prisma.user.findUnique({ where: { username } });
          if (taken) {
            throw new APIError("UNPROCESSABLE_ENTITY", {
              message: "Ce pseudo est déjà pris",
            });
          }
          return {
            data: {
              ...user,
              username,
              name: username,
            },
          };
        },
      },
    },
  },
  plugins: [nextCookies()],
});
