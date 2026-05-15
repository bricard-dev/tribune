'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type NavItem = { href: string; label: string };

export function MobileNav({
  items,
  isAuthenticated,
}: {
  items: NavItem[];
  isAuthenticated: boolean;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Ouvrir le menu"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72" aria-describedby={undefined}>
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl">Tribune</SheetTitle>
        </SheetHeader>
        <nav aria-label="Navigation mobile" className="px-4">
          <ul className="flex flex-col gap-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={close}
                  className="block rounded-md px-3 py-2 text-base text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto flex flex-col gap-2 border-t px-4 py-4">
          {isAuthenticated ? (
            <Button asChild variant="outline" onClick={close}>
              <Link href="/profile">Mon profil</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="outline" onClick={close}>
                <Link href="/sign-in">Se connecter</Link>
              </Button>
              <Button asChild onClick={close}>
                <Link href="/sign-up">S&apos;enregistrer</Link>
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
