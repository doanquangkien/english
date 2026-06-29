import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Admin sidebar placeholder */}
      <aside className="w-64 border-r border-border bg-card p-6">
        <div className="mb-8">
          <Link href="/admin" className="text-lg font-medium text-foreground">
            ADMIN
          </Link>
        </div>
        <nav className="space-y-1">
          {[
            { href: "/admin", label: "Tong quan" },
            { href: "/admin/users", label: "Nguoi dung" },
            { href: "/admin/courses", label: "Khoa hoc" },
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
