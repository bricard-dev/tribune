'use client';

import { cn } from '@/lib/utils';
import { Lock, PencilLine, Trophy, type LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import type { Step, StepIcon } from './content';

const ICONS: Record<StepIcon, LucideIcon> = {
  pencil: PencilLine,
  lock: Lock,
  trophy: Trophy,
};

const STICKY_OFFSET = 96; // matches `top-24` (6rem)
const BADGE_HALF = 24; // half of h-12 badge

export function RulesTimeline({ steps }: { steps: Step[] }) {
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const updateActive = () => {
      const triggerY = STICKY_OFFSET + BADGE_HALF;
      let current = 0;
      for (let i = 0; i < itemRefs.current.length; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;
        const { top } = el.getBoundingClientRect();
        if (top <= triggerY) current = i;
        else break;
      }
      setActive(current);
    };
    updateActive();
    window.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('resize', updateActive);
    return () => {
      window.removeEventListener('scroll', updateActive);
      window.removeEventListener('resize', updateActive);
    };
  }, []);

  return (
    <ol className="relative mt-12 py-20">
      <span
        aria-hidden
        className="absolute bottom-0 left-4 top-0 w-1 bg-white md:left-1/2 md:-translate-x-1/2 mask-[linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute bottom-20 left-4 top-20 -translate-x-1/2 md:left-1/2 md:translate-x-0"
      >
        <span className="sticky top-24 inline-flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-[#5a9a42] font-mono text-xl font-semibold text-white md:-translate-x-1/2">
          {active + 1}
        </span>
      </div>

      {steps.map((step, idx) => {
        const onLeft = idx % 2 === 0;
        const Icon = ICONS[step.icon];
        return (
          <li
            key={step.title}
            ref={(el) => {
              itemRefs.current[idx] = el;
            }}
            className="relative pb-28 last:pb-0 md:min-h-[80vh] md:pb-0"
          >
            <div
              className={cn(
                'pl-12 md:pl-0 md:sticky md:top-24 md:max-w-lg',
                onLeft
                  ? 'md:mr-auto md:w-[calc(50%-3.5rem)] md:pr-0'
                  : 'md:ml-auto md:w-[calc(50%-3.5rem)] md:pl-0',
              )}
            >
              <motion.div
                initial={{ opacity: 0, x: onLeft ? -32 : 32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-xl bg-black/15 p-6 backdrop-blur-sm ring-1 ring-white/15"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
                    <Icon className="h-5 w-5 text-white" aria-hidden />
                  </span>
                  <h3 className="font-serif text-3xl tracking-tight text-white">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-4 text-white/85">{step.body}</p>
                <p className="mt-3 text-sm text-white/70">{step.detail}</p>
                <p className="mt-4 border-t border-white/15 pt-3 text-xs uppercase tracking-wider text-white/60">
                  {step.hint}
                </p>
              </motion.div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
