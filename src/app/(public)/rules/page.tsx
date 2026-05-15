import { Section } from '@/components/section';
import { Ticket } from '@/components/ticket';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  rankingExample,
  scoringExamples,
  scoringRows,
  stats,
  steps,
} from './content';
import { CountUp } from './count-up';
import { RevealUp } from './reveal-up';
import { RulesTimeline } from './timeline';

export const metadata: Metadata = {
  title: 'Règles — Tribune',
  description:
    'Comment fonctionnent les pronostics, le barème de points et le classement de la Tribune.',
};

export default function RulesPage() {
  return (
    <>
      <Section aria-labelledby="rules-title" className="pb-16 pt-20 md:pt-24">
        <div className="max-w-3xl text-left md:mx-auto md:text-center">
          <h1 id="rules-title" className="text-display font-serif">
            Les règles, en une page
          </h1>
          <p className="text-lead mt-6 max-w-3xl text-muted-foreground md:mx-auto">
            Un pool de pronostics pour les 104 matches de la compétition.
            <br /> 48 équipes, 12 groupes, puis tableau à élimination directe.
          </p>
        </div>
        <div className="text-center">
          <dl className="mx-auto mt-10 grid max-w-xl grid-cols-3 gap-6 border-t pt-6">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="font-mono text-4xl tabular-nums tracking-tight md:text-5xl">
                  <CountUp value={Number(stat.value)} />
                </dt>
                <dd className="mt-1 font-mono text-xs text-muted-foreground">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section
        aria-labelledby="how-title"
        className="overflow-x-clip bg-primary text-primary-foreground"
      >
        <h2 id="how-title" className="text-section text-center font-serif">
          Comment pronostiquer ?
        </h2>
        <p className="text-lead mx-auto mt-4 max-w-xl text-center opacity-80">
          Trois étapes, du choix du score au décompte des points.
        </p>
        <RulesTimeline steps={steps} />
      </Section>

      <Section
        aria-labelledby="scoring-title"
        style={{
          background:
            'color-mix(in oklab, var(--muted) 40%, var(--background))',
        }}
      >
        <h2 id="scoring-title" className="text-section text-center font-serif">
          Barème de points
        </h2>
        <p className="text-lead mx-auto mt-4 max-w-xl text-center text-muted-foreground">
          Quatre niveaux de précision, de zéro à cinq points.
        </p>
        <div className="mt-12 grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <RevealUp className="overflow-hidden rounded-lg border bg-background">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="border-b text-left">
                  <th className="px-4 py-2.5 font-medium">Pronostic</th>
                  <th className="px-4 py-2.5 font-medium">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {scoringRows.map((row) => (
                  <tr key={row.label}>
                    <td className="px-4 py-2.5">{row.label}</td>
                    <td className="px-4 py-2.5 font-mono">{row.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </RevealUp>
          <RevealUp
            delay={0.4}
            mobileDelay={0.2}
            className="mx-auto w-full max-w-sm"
          >
            <Ticket
              homeCode="MEX"
              awayCode="RSA"
              date="Jeu. 11 juin · 15:00"
              number="0001"
              name="tribune"
              pronoDate="10 juin · 22:14"
              prono={scoringExamples[0].prono}
              result={scoringExamples[0].result}
              points={scoringExamples[0].points}
              circleScore
            />
          </RevealUp>
        </div>
      </Section>

      <Section aria-labelledby="ranking-title">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <h2 id="ranking-title" className="text-section font-serif">
              Classement
            </h2>
            <p className="text-lead mt-4 max-w-xl text-muted-foreground">
              Mis à jour dès la fin de chaque match. En cas d&apos;égalité, on
              départage au nombre de scores exacts, puis au nombre de bons
              vainqueurs.
            </p>
            <Button asChild className="mt-8">
              <Link href="/leaderboard">Voir le classement</Link>
            </Button>
          </div>
          <RevealUp className="overflow-hidden rounded-lg border bg-background">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="border-b text-left">
                  <th className="px-4 py-2.5 font-medium">#</th>
                  <th className="px-4 py-2.5 font-medium">Joueur</th>
                  <th className="px-4 py-2.5 text-right font-medium">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rankingExample.map((row) => (
                  <tr
                    key={row.rank}
                    className={row.highlight ? 'bg-muted/40' : undefined}
                  >
                    <td className="px-4 py-2.5 font-mono tabular-nums text-muted-foreground">
                      {row.rank}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={row.highlight ? 'font-medium' : undefined}
                      >
                        {row.name}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono tabular-nums">
                      {row.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </RevealUp>
        </div>
      </Section>
    </>
  );
}
