import { createClient } from "@/lib/supabase/server";
import { Flame, Star, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select(
          "display_name, cefr_level, current_streak, total_xp, daily_goal_minutes",
        )
        .eq("id", user.id)
        .single()
    : { data: null };

  const displayName =
    profile?.display_name ?? user?.email?.split("@")[0] ?? "Học viên";

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-medium text-foreground">
          Chào mừng, {displayName}!
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {profile?.cefr_level
            ? `Trình độ ${profile.cefr_level} • Mục tiêu ${profile.daily_goal_minutes} phút/ngày`
            : "Hãy hoàn thành onboarding để bắt đầu học"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-[4px] border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Flame size={16} />
            Streak
          </div>
          <p className="mt-2 text-2xl font-medium text-foreground">
            {profile?.current_streak ?? 0}
            <span className="text-sm font-normal text-muted-foreground">
              {" "}
              ngày
            </span>
          </p>
        </div>

        <div className="rounded-[4px] border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star size={16} />
            Tổng XP
          </div>
          <p className="mt-2 text-2xl font-medium text-foreground">
            {profile?.total_xp ?? 0}
            <span className="text-sm font-normal text-muted-foreground">
              {" "}
              XP
            </span>
          </p>
        </div>

        <div className="rounded-[4px] border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp size={16} />
            Trình độ
          </div>
          <p className="mt-2 text-2xl font-medium text-foreground">
            {profile?.cefr_level ?? "—"}
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="rounded-[4px] border border-border bg-card p-6">
        <h2 className="text-lg font-medium text-foreground">Bắt đầu học</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Chọn một hoạt động bên dưới để bắt đầu phiên học hôm nay.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            {
              label: "Flashcard",
              desc: "Ôn tập thẻ ghi nhớ",
              href: "/flashcards",
            },
            { label: "Khoá học", desc: "Tiếp tục khoá học", href: "/courses" },
            {
              label: "AI Teacher",
              desc: "Luyện nói với AI",
              href: "/ai-teacher",
            },
            { label: "Từ điển", desc: "Tra cứu từ vựng", href: "/dictionary" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-[4px] border border-border p-4 hover:bg-muted transition-colors"
            >
              <div className="font-medium text-sm text-foreground">
                {item.label}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {item.desc}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
