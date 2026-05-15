export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted px-6 py-12">
      {children}
    </main>
  );
}
