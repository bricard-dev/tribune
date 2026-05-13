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
    <section className={cn('py-12 md:py-16', className)} {...props}>
      {contained ? <Container>{children}</Container> : children}
    </section>
  );
}
