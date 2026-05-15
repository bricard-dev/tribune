'use client';

import { cn } from '@/lib/utils';
import { Lock, PencilLine, Trophy, type LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import type { Step, StepIcon } from './content';

const MOBILE_QUERY = '(max-width: 767px)';

function useIsMobileAtMount() {
  const [isMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(MOBILE_QUERY).matches;
  });
  return isMobile;
}

const ICONS: Record<StepIcon, LucideIcon> = {
  pencil: PencilLine,
  lock: Lock,
  trophy: Trophy,
};

export function RulesTimeline({ steps }: { steps: Step[] }) {
  const isMobile = useIsMobileAtMount();

  return (
    <ol className="relative mt-12 py-20">
      <span
        aria-hidden
        className="absolute bottom-0 left-5 top-0 w-1 -translate-x-1/2 bg-white md:left-1/2 mask-[linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]"
      />

      {steps.map((step, idx) => {
        const onLeft = idx % 2 === 0;
        const Icon = ICONS[step.icon];
        return (
          <li key={step.title} className="relative pb-20 last:pb-0">
            <span
              aria-hidden
              className="absolute left-5 top-6 inline-flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-primary font-mono text-sm font-semibold text-primary-foreground md:left-1/2"
            >
              {idx + 1}
            </span>

            <div
              className={cn(
                'pl-12 pr-px md:max-w-lg md:pl-0',
                onLeft
                  ? 'md:mr-auto md:w-[calc(50%-3.5rem)] md:pl-px md:pr-0'
                  : 'md:ml-auto md:w-[calc(50%-3.5rem)] md:pl-0 md:pr-px',
              )}
            >
              <motion.div
                suppressHydrationWarning
                initial={{ opacity: 0, x: isMobile ? 32 : onLeft ? -32 : 32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="rounded-xl bg-black/15 p-6 ring-1 ring-white/15"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
                    <Icon className="h-5 w-5 text-white" aria-hidden />
                  </span>
                  <h3 className="font-serif text-3xl tracking-tight text-white">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-4 text-white/85">{step.body}</p>
              </motion.div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
