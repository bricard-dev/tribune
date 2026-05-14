import type { Metadata } from 'next';
import { Section } from '@/components/section';
import { Separator } from '@/components/ui/separator';
import { prisma } from '@/lib/prisma';
import { AnimatedDay } from './animated-day';
import { PHASE_LABEL, STATUS_LABEL } from './content';

export const metadata: Metadata = {
  title: 'Matches — Tribune',
  description: 'Calendrier complet des matches de la compétition.',
};

const dayFormatter = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/Paris',
});

const timeFormatter = new Intl.DateTimeFormat('fr-FR', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Paris',
});

const dayKeyFormatter = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: 'Europe/Paris',
});

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default async function MatchesPage() {
  const matches = await prisma.match.findMany({
    orderBy: { kickoffAt: 'asc' },
    include: {
      homeTeam: true,
      awayTeam: true,
      group: true,
    },
  });

  // Group by local (Europe/Paris) calendar day.
  const byDay = new Map<string, typeof matches>();
  for (const match of matches) {
    const key = dayKeyFormatter.format(match.kickoffAt);
    const bucket = byDay.get(key);
    if (bucket) bucket.push(match);
    else byDay.set(key, [match]);
  }

  return (
    <>
      <Section aria-labelledby="matches-title" className="pb-16 pt-20 md:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1
            id="matches-title"
            className="font-serif text-5xl leading-[1.05] tracking-tight md:text-7xl"
          >
            Calendrier des matches
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground">
            Tous les matches de la compétition, de la phase de groupes à la
            finale.
            <br />
            Horaires affichés en heure de Paris.
          </p>
        </div>
      </Section>

      <Separator />

      <Section>
        {matches.length === 0 ? (
          <p className="text-muted-foreground">
            Aucun match programmé pour le moment.
          </p>
        ) : (
          <div className="space-y-16">
          {[...byDay.entries()].map(([dayKey, dayMatches]) => (
            <AnimatedDay key={dayKey} labelledBy={`day-${dayKey}`}>
              <h2
                id={`day-${dayKey}`}
                className="font-serif text-xl tracking-tight md:text-2xl"
              >
                {capitalize(dayFormatter.format(dayMatches[0].kickoffAt))}
              </h2>

              <ul className="mt-4 divide-y rounded-lg border">
                {dayMatches.map((match) => {
                  const home =
                    match.homeTeam?.name ?? match.homeSlot ?? 'À déterminer';
                  const away =
                    match.awayTeam?.name ?? match.awaySlot ?? 'À déterminer';
                  const phaseLabel =
                    match.phase === 'GROUP' && match.group
                      ? `Groupe ${match.group.name}`
                      : PHASE_LABEL[match.phase];
                  const isFinished = match.status === 'FINISHED';
                  const hasScore =
                    match.homeScore !== null && match.awayScore !== null;

                  return (
                    <li
                      key={match.id}
                      className="grid gap-3 px-4 py-4 sm:grid-cols-[7rem_1fr_14rem] sm:items-center sm:gap-6"
                    >
                      <div className="flex flex-col text-sm">
                        <span className="font-mono tabular-nums">
                          {timeFormatter.format(match.kickoffAt)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {phaseLabel}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-base">
                        <div className="flex flex-1 items-center justify-end gap-2">
                          <span className="font-medium">{home}</span>
                          {match.homeTeam?.flagUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={match.homeTeam.flagUrl}
                              alt=""
                              aria-hidden
                              className="h-4 w-6 shrink-0 rounded-[2px] object-cover ring-1 ring-border"
                            />
                          ) : (
                            <span
                              aria-hidden
                              className="h-4 w-6 shrink-0 rounded-[2px] bg-muted ring-1 ring-border"
                            />
                          )}
                        </div>
                        <span className="font-mono tabular-nums text-muted-foreground">
                          {hasScore ? (
                            <>
                              {match.homeScore}
                              <span className="px-1">–</span>
                              {match.awayScore}
                            </>
                          ) : (
                            'vs'
                          )}
                        </span>
                        <div className="flex flex-1 items-center gap-2">
                          {match.awayTeam?.flagUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={match.awayTeam.flagUrl}
                              alt=""
                              aria-hidden
                              className="h-4 w-6 shrink-0 rounded-[2px] object-cover ring-1 ring-border"
                            />
                          ) : (
                            <span
                              aria-hidden
                              className="h-4 w-6 shrink-0 rounded-[2px] bg-muted ring-1 ring-border"
                            />
                          )}
                          <span className="font-medium">{away}</span>
                        </div>
                      </div>

                      <div className="text-sm sm:text-right">
                        <div className="font-medium text-foreground">
                          {match.stadium}
                        </div>
                        <div className="text-xs uppercase tracking-wide text-muted-foreground">
                          {match.city}
                        </div>
                        {!isFinished && match.status !== 'SCHEDULED' && (
                          <div className="mt-1 text-xs font-medium text-foreground">
                            {STATUS_LABEL[match.status]}
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </AnimatedDay>
          ))}
          </div>
        )}
      </Section>
    </>
  );
}
