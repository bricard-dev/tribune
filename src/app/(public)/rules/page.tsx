import type { Metadata } from 'next';
import { Section } from '@/components/section';

export const metadata: Metadata = {
  title: 'Règles — Tribune',
  description:
    'Comment fonctionnent les pronostics, le barème de points et le classement de la Tribune.',
};

export default function RulesPage() {
  return (
    <>
      <Section
        aria-labelledby="rules-title"
        className="bg-primary/10 pb-12 pt-16 md:pt-20"
      >
        <h1
          id="rules-title"
          className="font-serif text-4xl leading-tight tracking-tight md:text-5xl"
        >
          Règles du jeu
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Tribune est un pool de pronostics pour la Coupe du Monde 2026 — 48
          équipes, 12 groupes, puis tableau à élimination directe. Voici
          comment ça marche.
        </p>
      </Section>

      <Section aria-labelledby="how-title">
        <h2
          id="how-title"
          className="font-serif text-2xl tracking-tight md:text-3xl"
        >
          Comment pronostiquer
        </h2>
        <ul className="mt-6 space-y-3 text-muted-foreground">
          <li>
            Avant chaque match, indique le score que tu prévois (équipe domicile
            vs extérieur).
          </li>
          <li>
            Tu peux modifier ton pronostic à volonté jusqu&apos;au coup
            d&apos;envoi. Après, le pronostic est verrouillé.
          </li>
          <li>
            Pour la phase à élimination, tu pronostiques le score au temps
            réglementaire ; le vainqueur sert au calcul des points si les deux
            équipes sont à égalité.
          </li>
        </ul>
      </Section>

      <Section aria-labelledby="scoring-title" className="bg-muted/40">
        <h2
          id="scoring-title"
          className="font-serif text-2xl tracking-tight md:text-3xl"
        >
          Barème de points
        </h2>
        <div className="mt-6 overflow-hidden rounded-lg border bg-background">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="border-b text-left">
                <th className="px-4 py-3 font-medium">Pronostic</th>
                <th className="px-4 py-3 font-medium">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-4 py-3">Score exact</td>
                <td className="px-4 py-3 font-mono">5</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Bon vainqueur + bon écart de buts</td>
                <td className="px-4 py-3 font-mono">3</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Bon vainqueur (ou match nul)</td>
                <td className="px-4 py-3 font-mono">1</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Mauvais pronostic</td>
                <td className="px-4 py-3 font-mono">0</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Les matches de la phase à élimination directe valent le double de
          points.
        </p>
      </Section>

      <Section aria-labelledby="ranking-title">
        <h2
          id="ranking-title"
          className="font-serif text-2xl tracking-tight md:text-3xl"
        >
          Classement
        </h2>
        <ul className="mt-6 space-y-3 text-muted-foreground">
          <li>
            Le classement est mis à jour dès la fin de chaque match, sur la
            page Classement.
          </li>
          <li>
            En cas d&apos;égalité, on départage au nombre de scores exacts,
            puis au nombre de bons vainqueurs.
          </li>
        </ul>
      </Section>
    </>
  );
}
