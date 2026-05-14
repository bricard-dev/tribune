import type { Metadata } from 'next';
import { Section } from '@/components/section';
import { Separator } from '@/components/ui/separator';
import { prisma } from '@/lib/prisma';
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
      by: ['userId'],
      _sum: { points: true },
      _count: { _all: true },
      where: { points: { not: null } },
    }),
  ]);

  const statsById = new Map(
    grouped.map((g) => [
      g.userId,
      { points: g._sum.points ?? 0, bets: g._count._all },
    ]),
  );

  const ranking = users
    .map((user) => {
      const stats = statsById.get(user.id);
      return {
        userId: user.id,
        user,
        points: stats?.points ?? 0,
        bets: stats?.bets ?? 0,
      };
    })
    .sort((a, b) => b.points - a.points || b.bets - a.bets);

  // Dense ranking: tied scores share the same rank.
  let lastPoints: number | null = null;
  let lastRank = 0;
  const rows = ranking.map((row, idx) => {
    const rank = row.points === lastPoints ? lastRank : idx + 1;
    lastPoints = row.points;
    lastRank = rank;
    return { ...row, rank };
  });

  return (
    <>
      <Section
        aria-labelledby="leaderboard-title"
        className="pb-16 pt-20 md:pt-24"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h1
            id="leaderboard-title"
            className="font-serif text-5xl leading-[1.05] tracking-tight md:text-7xl"
          >
            Classement
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground">
            Classement général de tous les pronostiqueurs.
            <br />
            Mis à jour à la fin de chaque match.
          </p>
        </div>
      </Section>

      <Separator />

      <Section>
        {rows.length === 0 ? (
          <p className="text-muted-foreground">
            Le classement apparaîtra dès le premier match terminé.
          </p>
        ) : (
          <AnimatedLeaderboard>
          <ol className="overflow-hidden rounded-lg border">
            <li className="grid grid-cols-[3rem_1fr_5rem_5rem] gap-4 border-b bg-muted/50 px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <span>Rang</span>
              <span>Joueur</span>
              <span className="text-right">Pronos</span>
              <span className="text-right">Points</span>
            </li>
            {rows.map((row) => (
              <li
                key={row.userId}
                className="grid grid-cols-[3rem_1fr_5rem_5rem] items-center gap-4 border-b px-4 py-3 text-sm last:border-b-0"
              >
                <span className="font-mono tabular-nums text-muted-foreground">
                  {row.rank}
                </span>
                <span className="font-medium">@{row.user.username}</span>
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
