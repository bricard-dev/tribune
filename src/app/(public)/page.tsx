import { Section } from '@/components/section';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/auth-helpers';
import Link from 'next/link';
import { HeroSlideshow } from './hero-slideshow';

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <Section aria-labelledby="hero-title" className="py-20 md:py-28">
      <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <h1
            id="hero-title"
            className="font-serif leading-[1.05] tracking-tight text-5xl md:text-[72px]"
          >
            Prédis. Marque. Domine la Tribune.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Pronostique les matches, grimpe au classement, et défie tes amis sur
            chaque rencontre de la compétition.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {user ? (
              <Button asChild size="lg">
                <Link href="/matches">Voir les matches</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg">
                  <Link href="/sign-up">Créer un compte</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/rules">Lire les règles</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        <HeroSlideshow images={['/tribune-1.jpg', '/tribune-2.jpg']} />
      </div>
    </Section>
  );
}
