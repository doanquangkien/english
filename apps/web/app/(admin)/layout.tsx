import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";
import { LogOut, Shield } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Role check — only admin and super_admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, display_name")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    redirect("/dashboard");
  }

  const displayName =
    profile.display_name ?? user.email?.split("@")[0] ?? "Admin";

  return (
    <div className="flex min-h-screen">
      {/* Admin Sidebar */}
      <aside className="flex w-64 flex-col border-r border-border bg-card">
        <div className="p-6">
          <Link href="/admin" className="text-lg font-medium text-foreground">
            ADMIN
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {[
            { href: "/admin", label: "Tổng quan" },
            { href: "/admin/users", label: "Người dùng" },
            { href: "/admin/courses", label: "Khoá học" },
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

        {/* User footer */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <Shield size={14} className="text-muted-foreground" />
            </div>
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-medium text-foreground">
                {displayName}
              </p>
              <p className="text-xs capitalize text-muted-foreground">
                {profile.role.replace("_", " ")}
              </p>
            </div>
          </div>
          <form action={signOut} className="mt-2">
            <button
              type="submit"
              className="flex w-full items-center gap-1 rounded-[4px] px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <LogOut size={12} />
              Đăng xuất
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
