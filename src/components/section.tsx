import { Container } from '@/components/container';
import { cn } from '@/lib/utils';

type SectionProps = React.ComponentProps<'section'> & {
  /** Wrap children in a Container. Set to false for full-bleed backgrounds. */
  contained?: boolean;
};

export function Section({
  className,
  contained = true,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn('py-24 md:py-32', className)} {...props}>
      {contained ? <Container>{children}</Container> : children}
    </section>
  );
}
