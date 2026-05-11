import { render } from '@react-email/render';
import { Resend } from 'resend';

import { ResetPasswordEmail, resetPasswordEmailText } from '@/emails/reset-password-email';
import { VerificationEmail, verificationEmailText } from '@/emails/verification-email';
import { env } from '@/env';

const resend = new Resend(env.RESEND_API_KEY);

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export async function sendEmail({ to, subject, html, text }: SendEmailInput) {
  if (env.NODE_ENV === 'development') {
    console.info(`[email:dev] to=${to} subject="${subject}"\n${text}`);
  }
  return resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to,
    subject,
    html,
    text,
  });
}

export async function renderVerificationEmail(url: string) {
  const html = await render(<VerificationEmail url={url} />);
  return { html, text: verificationEmailText(url) };
}

export async function renderResetPasswordEmail(url: string) {
  const html = await render(<ResetPasswordEmail url={url} />);
  return { html, text: resetPasswordEmailText(url) };
}
