'use client';

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from 'motion/react';
import { useEffect, useRef } from 'react';

type CountUpProps = {
  value: number;
  duration?: number;
};

export function CountUp({ value, duration = 2 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, value, {
      duration,
      ease: [0.65, 0, 0.35, 1],
    });
    return () => controls.stop();
  }, [inView, value, duration, count]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}
