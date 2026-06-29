import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-lg font-medium text-foreground">
            ENGLISH
          </Link>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/login" className="hover:text-foreground">
              Dang nhap
            </Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-border px-6 py-8 text-center text-xs text-muted-foreground">
        ENGLISH Platform. All rights reserved.
      </footer>
    </div>
  );
}
