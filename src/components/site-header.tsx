import { Container } from '@/components/container';
import { MobileNav } from '@/components/mobile-nav';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/auth-helpers';
import Link from 'next/link';

const navItems = [
  { href: '/', label: 'Accueil' },
  { href: '/rules', label: 'Règles' },
  { href: '/matches', label: 'Matches' },
  { href: '/leaderboard', label: 'Classement' },
];

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="font-serif text-2xl leading-none tracking-tight"
          aria-label="Tribune — accueil"
        >
          Tribune
        </Link>

        <div className="flex items-center gap-6">
          <nav aria-label="Navigation principale" className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-foreground/70 transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <span aria-hidden className="hidden h-6 w-px bg-border md:block" />

          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <Button asChild variant="ghost" size="sm">
                <Link href="/profile">Mon profil</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link href="/sign-in">Se connecter</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/sign-up">S&apos;enregistrer</Link>
                </Button>
              </>
            )}
          </div>

          <MobileNav items={navItems} isAuthenticated={!!user} />
        </div>
      </Container>
    </header>
  );
}
