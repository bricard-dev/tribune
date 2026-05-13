import Link from 'next/link';
import { Container } from '@/components/container';

const navItems = [
  { href: '/', label: 'Accueil' },
  { href: '/rules', label: 'Règles' },
  { href: '/matches', label: 'Matches' },
  { href: '/leaderboard', label: 'Classement' },
];

const legalItems = [
  { href: '/legal', label: 'Mentions légales' },
  { href: '/terms', label: 'CGU' },
  { href: '/privacy', label: 'Confidentialité' },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate mt-24 overflow-hidden bg-[oklch(0.28_0.08_142)] text-primary-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-[0.25em] select-none text-center font-serif text-[clamp(8rem,22vw,22rem)] leading-[0.8] tracking-tight text-primary-foreground/5"
      >
        Tribune
      </div>

      <Container className="relative py-20">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <Link
              href="/"
              className="font-serif text-4xl leading-none tracking-tight"
              aria-label="Tribune — accueil"
            >
              Tribune
            </Link>
            <p className="mt-4 max-w-xs text-base text-primary-foreground/70">
              Pronostiquez les matches, défiez vos amis, prenez la tribune.
            </p>
          </div>

          <div className="flex gap-12 sm:gap-16">
          <nav aria-label="Navigation du pied de page">
            <h2 className="text-xs font-medium uppercase tracking-wider text-primary-foreground/60">
              Navigation
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Liens légaux">
            <h2 className="text-xs font-medium uppercase tracking-wider text-primary-foreground/60">
              Légal
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {legalItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/60 sm:flex-row sm:items-center">
          <p>© {year} Tribune. Tous droits réservés.</p>
          <p>Fait avec passion pour le football.</p>
        </div>
      </Container>
    </footer>
  );
}
