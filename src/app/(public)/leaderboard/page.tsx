import { Section } from '@/components/section';
import { Separator } from '@/components/ui/separator';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';
import { AnimatedLeaderboard } from './animated-leaderboard';

export const metadata: Metadata = {
  title: 'Classement — Tribune',
  description: 'Classement général des pronostiqueurs de la Tribune.',
};

export default async function LeaderboardPage() {
  const [users, grouped] = await Promise.all([
    prisma.user.findMany({
      where: { role: 'USER' },
      select: { id: true, username: true },
    }),
    prisma.bet.groupBy({
      by: ['userId', 'points'],
      _count: { _all: true },
      where: { points: { not: null } },
    }),
  ]);

  type Stats = {
    points: number;
    bets: number;
    exact: number; // 5 pts — score exact
    gap: number; // 3 pts — bon écart
    winner: number; // 1 pt — bon vainqueur
  };

  const statsById = new Map<string, Stats>();
  for (const g of grouped) {
    const stats = statsById.get(g.userId) ?? {
      points: 0,
      bets: 0,
      exact: 0,
      gap: 0,
      winner: 0,
    };
    const count = g._count._all;
    stats.bets += count;
    stats.points += (g.points ?? 0) * count;
    if (g.points === 5) stats.exact += count;
    else if (g.points === 3) stats.gap += count;
    else if (g.points === 1) stats.winner += count;
    statsById.set(g.userId, stats);
  }

  const ranking = users
    .map((user) => {
      const stats = statsById.get(user.id);
      return {
        userId: user.id,
        user,
        points: stats?.points ?? 0,
        bets: stats?.bets ?? 0,
        exact: stats?.exact ?? 0,
        gap: stats?.gap ?? 0,
        winner: stats?.winner ?? 0,
      };
    })
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.exact - a.exact ||
        b.gap - a.gap ||
        b.winner - a.winner,
    );

  // Ordinal ranking: every player gets a unique rank.
  const rows = ranking.map((row, idx) => ({ ...row, rank: idx + 1 }));

  return (
    <>
      <Section
        aria-labelledby="leaderboard-title"
        className="pb-16 pt-20 md:pt-24"
      >
        <div className="mx-auto max-w-3xl text-left md:text-center">
          <h1 id="leaderboard-title" className="text-display font-serif">
            Classement
          </h1>
          <p className="text-lead mx-auto mt-6 max-w-3xl text-muted-foreground">
            Classement général de tous les pronostiqueurs.
            <br />
            Mis à jour à la fin de chaque match.
          </p>
        </div>
      </Section>

      <Separator />

      <Section className="pt-12 md:pt-16">
        {rows.length === 0 ? (
          <p className="text-muted-foreground">
            Le classement apparaîtra dès le premier match terminé.
          </p>
        ) : (
          <AnimatedLeaderboard>
            <p className="mb-2 text-xs text-muted-foreground">
              <span className="font-mono">E</span> score exact ·{' '}
              <span className="font-mono">É</span> bon écart ·{' '}
              <span className="font-mono">V</span> bon vainqueur ·{' '}
              <span className="font-mono">N</span> nombre de pronos ·{' '}
              <span className="font-mono">PTS</span> points
            </p>
            <ol className="overflow-hidden rounded-lg border">
              <li className="grid grid-cols-[2rem_1fr_2rem_2rem_2rem_2rem_2.5rem] gap-2 border-b bg-muted/50 px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:gap-4">
                <span>#</span>
                <span>Joueur</span>
                <span className="text-right" title="Score exact">
                  E
                </span>
                <span className="text-right" title="Bon écart">
                  É
                </span>
                <span className="text-right" title="Bon vainqueur">
                  V
                </span>
                <span className="text-right" title="Nombre de pronos">
                  N
                </span>
                <span className="text-right" title="Points">
                  Pts
                </span>
              </li>
              {rows.map((row) => (
                <li
                  key={row.userId}
                  className="grid grid-cols-[2rem_1fr_2rem_2rem_2rem_2rem_2.5rem] items-center gap-2 border-b px-4 py-3 text-sm last:border-b-0 sm:gap-4"
                >
                  <span className="font-mono tabular-nums text-muted-foreground">
                    {row.rank}
                  </span>
                  <span className="truncate font-medium">
                    @{row.user.username}
                  </span>
                  <span className="text-right font-mono tabular-nums text-muted-foreground">
                    {row.exact}
                  </span>
                  <span className="text-right font-mono tabular-nums text-muted-foreground">
                    {row.gap}
                  </span>
                  <span className="text-right font-mono tabular-nums text-muted-foreground">
                    {row.winner}
                  </span>
                  <span className="text-right font-mono tabular-nums text-muted-foreground">
                    {row.bets}
                  </span>
                  <span className="text-right font-mono tabular-nums font-medium">
                    {row.points}
                  </span>
                </li>
              ))}
            </ol>
          </AnimatedLeaderboard>
        )}
      </Section>
    </>
  );
}
