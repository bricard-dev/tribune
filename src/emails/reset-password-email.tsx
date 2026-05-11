import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components';

type ResetPasswordEmailProps = {
  url: string;
};

export function ResetPasswordEmail({ url }: ResetPasswordEmailProps) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>Réinitialise ton mot de passe Tribune</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Réinitialise ton mot de passe</Heading>
          <Text>Tu as demandé à changer ton mot de passe. Clique sur le bouton ci-dessous :</Text>
          <Button href={url} style={button}>
            Choisir un nouveau mot de passe
          </Button>
          <Text style={hint}>
            Ce lien est valable 1 heure. Si tu n&apos;es pas à l&apos;origine de cette demande,
            ignore cet email — ton mot de passe actuel reste valide.
          </Text>
          <Text style={rawUrl}>{url}</Text>
        </Container>
      </Body>
    </Html>
  );
}

ResetPasswordEmail.PreviewProps = {
  url: 'https://tribune.example/reset-password?token=preview',
} satisfies ResetPasswordEmailProps;

export default ResetPasswordEmail;

export function resetPasswordEmailText(url: string) {
  return `Réinitialisation de ton mot de passe Tribune

Clique sur ce lien (valable 1h) pour choisir un nouveau mot de passe :
${url}

Si tu n'es pas à l'origine de cette demande, ignore cet email — ton mot de passe actuel reste valide.`;
}

const body = {
  fontFamily: 'system-ui, -apple-system, sans-serif',
  color: '#111',
  margin: 0,
};

const container = {
  maxWidth: '560px',
  margin: '0 auto',
  padding: '24px',
};

const heading = {
  fontSize: '20px',
  margin: '0 0 16px',
};

const button = {
  display: 'inline-block',
  background: '#111',
  color: '#fff',
  padding: '12px 20px',
  borderRadius: '6px',
  textDecoration: 'none',
  margin: '24px 0',
};

const hint = {
  fontSize: '13px',
  color: '#555',
};

const rawUrl = {
  fontSize: '12px',
  color: '#888',
  wordBreak: 'break-all' as const,
};
