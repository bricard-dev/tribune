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

type VerificationEmailProps = {
  url: string;
};

export function VerificationEmail({ url }: VerificationEmailProps) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>Confirme ton adresse email pour activer ton compte Tribune</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Bienvenue sur Tribune</Heading>
          <Text>Pour activer ton compte, confirme ton adresse email :</Text>
          <Button href={url} style={button}>
            Confirmer mon email
          </Button>
          <Text style={hint}>
            Ce lien est valable 1 heure. Si tu n&apos;es pas à l&apos;origine de cette
            inscription, ignore cet email.
          </Text>
          <Text style={rawUrl}>{url}</Text>
        </Container>
      </Body>
    </Html>
  );
}

VerificationEmail.PreviewProps = {
  url: 'https://tribune.example/verify?token=preview',
} satisfies VerificationEmailProps;

export default VerificationEmail;

export function verificationEmailText(url: string) {
  return `Bienvenue sur Tribune !

Confirme ton adresse email en cliquant sur ce lien (valable 1h) :
${url}

Si tu n'es pas à l'origine de cette inscription, ignore cet email.`;
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
