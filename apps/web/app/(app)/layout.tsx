import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar placeholder */}
      <aside className="w-64 border-r border-border bg-card p-6">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-lg font-medium text-foreground"
          >
            ENGLISH
          </Link>
        </div>
        <nav className="space-y-1">
          {[
            { href: "/dashboard", label: "Bang dieu khien" },
            { href: "/courses", label: "Khoa hoc" },
            { href: "/flashcards", label: "Flashcard" },
            { href: "/ai-teacher", label: "AI Teacher" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-[4px] px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
