import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { MotionProvider } from './motion-provider';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MotionProvider>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </MotionProvider>
  );
}
