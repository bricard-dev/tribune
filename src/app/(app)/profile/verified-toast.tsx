'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export function VerifiedToast() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    if (searchParams.get('verified') !== '1') return;
    fired.current = true;
    toast.success('Email vérifié', {
      description: 'Ton compte est activé. Bienvenue !',
    });
    const params = new URLSearchParams(searchParams);
    params.delete('verified');
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }, [pathname, router, searchParams]);

  return null;
}
