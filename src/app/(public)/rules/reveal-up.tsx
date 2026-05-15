'use client';

import { motion } from 'motion/react';
import { useState, type ReactNode } from 'react';

type RevealUpProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  mobileDelay?: number;
};

const MOBILE_QUERY = '(max-width: 767px)';

export function RevealUp({
  children,
  className,
  delay = 0.2,
  mobileDelay,
}: RevealUpProps) {
  const [isMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(MOBILE_QUERY).matches;
  });
  const resolvedDelay = isMobile && mobileDelay !== undefined ? mobileDelay : delay;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: resolvedDelay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
