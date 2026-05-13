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
        <div className="mx-auto max-w-3xl text-center">
          <h1
            id="rules-title"
            className="font-serif text-5xl leading-[1.05] tracking-tight md:text-7xl"
          >
            Les règles, en une page.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground">
            Un pool de pronostics pour les 104 matches de la compétition.
            <br />
            48 équipes, 12 groupes, puis tableau à élimination directe.
            {/* <br /> */}
            {/* Tout fonctionne avec un seul barème, un seul classement. */}
          </p>
          <dl className="mx-auto mt-10 grid max-w-xl grid-cols-3 gap-6 border-t pt-6">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="font-mono text-4xl tabular-nums tracking-tight md:text-5xl">
                  <CountUp value={Number(stat.value)} />
                </dt>
                <dd className="mt-1 text-xs text-muted-foreground">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section
        aria-labelledby="how-title"
        className="-mt-10 pb-48 pt-64 md:-mt-16 md:pb-72 md:pt-80"
        style={{
          background:
            'linear-gradient(to bottom, var(--background) 0, #5a9a42 32rem, #5a9a42 calc(100% - 28rem), color-mix(in oklab, var(--muted) 40%, var(--background)) 100%)',
        }}
      >
        <h2
          id="how-title"
          className="text-center font-serif text-6xl leading-tight tracking-tight text-white"
        >
          Comment pronostiquer ?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-lg text-white/80">
          Trois étapes, du choix du score au décompte des points
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
        <h2
          id="scoring-title"
          className="text-center font-serif text-6xl leading-tight tracking-tight"
        >
          Barème de points
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
          Quatre niveaux de précision, de zéro à cinq points.
        </p>
        <div className="mx-auto mt-12 max-w-2xl overflow-hidden rounded-lg border bg-background">
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
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {scoringExamples.map((example) => (
            <div key={example.label} className="flex flex-col items-stretch">
              <h3 className="mb-3 text-center font-serif text-2xl tracking-tight">
                {example.label}
              </h3>
              <Ticket
                homeCode="MEX"
                awayCode="RSA"
                date="Jeu. 11 juin · 15:00"
                number="0001"
                name="tribune"
                pronoDate="10 juin · 22:14"
                prono={example.prono}
                result={example.result}
                points={example.points}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section aria-labelledby="ranking-title">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <h2
              id="ranking-title"
              className="font-serif text-6xl leading-tight tracking-tight"
            >
              Classement
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Mis à jour dès la fin de chaque match. En cas d&apos;égalité, on
              départage au nombre de scores exacts, puis au nombre de bons
              vainqueurs.
            </p>
            <Button asChild className="mt-8">
              <Link href="/leaderboard">Voir le classement</Link>
            </Button>
          </div>
          <div className="overflow-hidden rounded-lg border bg-background">
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
          </div>
        </div>
      </Section>
    </>
  );
}
