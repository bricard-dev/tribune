'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { resendVerificationAction } from './actions';

const COOLDOWN_SECONDS = 60;

export function ResendVerificationButton({
  initialCooldown,
}: {
  initialCooldown: number;
}) {
  const [status, setStatus] = useState<'idle' | 'sending'>('idle');
  const [cooldown, setCooldown] = useState(initialCooldown);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCooldown((value) => {
        if (value <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
  };

  const restartCooldown = () => {
    setCooldown(COOLDOWN_SECONDS);
    startInterval();
  };

  useEffect(() => {
    if (initialCooldown > 0) startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [initialCooldown]);

  const handleClick = async () => {
    setStatus('sending');
    const result = await resendVerificationAction();
    setStatus('idle');
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast('Email renvoyé', {
      description: 'Pense à vérifier tes spams',
      position: 'top-right',
    });
    restartCooldown();
  };

  const disabled = status === 'sending' || cooldown > 0;
  const label =
    status === 'sending'
      ? 'Envoi...'
      : cooldown > 0
        ? `Renvoyer dans ${cooldown}s`
        : 'Renvoyer le lien';

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={handleClick}
      disabled={disabled}
    >
      {label}
    </Button>
  );
}
