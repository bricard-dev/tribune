import { Resend } from "resend";
import { env } from "@/env";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendMagicLinkEmail({
  to,
  url,
}: {
  to: string;
  url: string;
}) {
  return resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to,
    subject: "Votre lien de connexion à Tribune",
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto;">
        <h1 style="font-size: 20px;">Connexion à Tribune</h1>
        <p>Cliquez sur le lien ci-dessous pour vous connecter. Ce lien est valable 5 minutes.</p>
        <p>
          <a href="${url}" style="display: inline-block; padding: 12px 20px; background: #111827; color: #fff; text-decoration: none; border-radius: 6px;">
            Se connecter
          </a>
        </p>
        <p style="color: #6b7280; font-size: 13px;">
          Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.
        </p>
      </div>
    `,
  });
}
