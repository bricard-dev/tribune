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
          <h1 id="hero-title" className="text-display font-serif">
            Prédis. Marque. Domine la Tribune.
          </h1>
          <p className="text-lead mt-6 text-muted-foreground">
            Pronostique les matches, grimpe au classement, et défie tes amis sur
            chaque rencontre de la compétition.
          </p>
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {user ? (
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/matches">Voir les matches</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/sign-up">Créer un compte</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <Link href="/rules">Lire les règles</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        <HeroSlideshow
          images={[
            '/tribune-1.jpg',
            '/tribune-2.jpg',
            '/tribune-3.jpg',
            '/tribune-4.jpg',
          ]}
        />
      </div>
    </Section>
  );
}
