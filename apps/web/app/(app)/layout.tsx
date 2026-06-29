import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";
import { LogOut, User } from "lucide-react";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("display_name, cefr_level, avatar_url")
        .eq("id", user.id)
        .single()
    : { data: null };

  const displayName =
    profile?.display_name ?? user?.email?.split("@")[0] ?? "Học viên";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-border bg-card">
        <div className="p-6">
          <Link
            href="/dashboard"
            className="text-lg font-medium text-foreground"
          >
            ENGLISH
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {[
            { href: "/dashboard", label: "Bảng điều khiển" },
            { href: "/courses", label: "Khoá học" },
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

        {/* User footer */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              {profile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={displayName}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <User size={14} className="text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-medium text-foreground">
                {displayName}
              </p>
              {profile?.cefr_level ? (
                <p className="text-xs text-muted-foreground">
                  {profile.cefr_level}
                </p>
              ) : null}
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
