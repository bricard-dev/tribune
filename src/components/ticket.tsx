'use client';

import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

type TicketProps = {
  homeCode: string;
  awayCode: string;
  date: string;
  number: string;
  name: string;
  pronoDate: string;
  prono: string;
  result: string;
  points: number;
  rotate?: number;
  className?: string;
  circleScore?: boolean;
};

function EyebrowRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <span className="text-sm tabular-nums">{value}</span>
    </div>
  );
}

export function Ticket({
  homeCode,
  awayCode,
  date,
  number,
  name,
  pronoDate,
  prono,
  result,
  points,
  rotate = 0,
  className,
  circleScore = false,
}: TicketProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      style={{
        filter:
          'drop-shadow(0 1px 1px rgba(0,0,0,0.04)) drop-shadow(0 4px 8px rgba(0,0,0,0.06))',
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
      }}
      className={cn('relative', className)}
    >
      <div
        className="relative overflow-hidden rounded-xl bg-background text-foreground ring-1 ring-foreground/15 dark:bg-[oklch(0.24_0.006_90)] dark:ring-foreground/20"
        style={{
          WebkitMaskImage:
            'radial-gradient(circle 8px at 0% calc(100% - 5.5rem), transparent 8px, black 8.5px), radial-gradient(circle 8px at 100% calc(100% - 5.5rem), transparent 8px, black 8.5px)',
          WebkitMaskComposite: 'source-in',
          maskImage:
            'radial-gradient(circle 8px at 0% calc(100% - 5.5rem), transparent 8px, black 8.5px), radial-gradient(circle 8px at 100% calc(100% - 5.5rem), transparent 8px, black 8.5px)',
          maskComposite: 'intersect',
        }}
      >
        <div className="bg-primary px-5 py-5 font-mono text-primary-foreground">
          <div className="flex items-end justify-center gap-3 text-4xl leading-none tracking-tight tabular-nums">
            <div className="flex flex-col items-end gap-2">
              <span className="text-[10px] uppercase tracking-[0.18em] text-white/70">
                Domicile
              </span>
              <span>{homeCode}</span>
            </div>
            <span className="opacity-70">–</span>
            <div className="flex flex-col items-start gap-2">
              <span className="text-[10px] uppercase tracking-[0.18em] text-white/70">
                Extérieur
              </span>
              <span>{awayCode}</span>
            </div>
          </div>
          <p className="mt-2 text-center text-[11px] uppercase tracking-[0.18em] text-white/80">
            {date}
          </p>
        </div>
        <div className="flex flex-col gap-3 px-5 pt-6 pb-8 font-mono">
          <EyebrowRow label="N°" value={number} />
          <EyebrowRow label="Name" value={name} />
          <EyebrowRow label="Pronostiqué le" value={pronoDate} />
          <EyebrowRow label="Pronostic" value={prono} />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute left-4 right-4 bottom-22 translate-y-1/2 border-t border-dashed border-border"
        />
        <div className="flex h-22 items-stretch justify-between gap-4 px-5 py-3 font-mono">
          <div className="flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Résultat
            </span>
            <span className="mt-1 text-2xl tabular-nums">{result}</span>
          </div>
          <div className="relative flex flex-col items-end justify-center">
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Score
            </span>
            <span className="relative mt-1 text-2xl tabular-nums">
              {points}
              <span className="ml-1 text-xs text-muted-foreground">pts</span>
            </span>
          </div>
        </div>
      </div>
      {circleScore && (
        <motion.svg
          aria-hidden
          viewBox="0 0 200 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute -right-3 -bottom-1 h-24 w-28 -rotate-6 text-primary"
        >
          <motion.path
            d="M 100,10 C 150,10 190,40 188,60 C 184,90 130,96 80,92 C 30,86 10,60 14,40 C 22,16 70,6 130,12 C 170,18 188,32 190,48"
            fill="none"
            stroke="currentColor"
            strokeWidth={6}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{
              pathLength: {
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.6,
              },
              opacity: { duration: 0, delay: 0.6 },
            }}
          />
        </motion.svg>
      )}
    </motion.div>
  );
}
