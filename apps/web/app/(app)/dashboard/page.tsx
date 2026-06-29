import { getTranslations } from "next-intl/server";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium text-foreground">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("welcome")}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "Streak", value: "--" },
          { title: "XP", value: "--" },
          { title: "Bai hoc hoan thanh", value: "--" },
        ].map((stat) => (
          <div
            key={stat.title}
            className="rounded-[4px] border border-border bg-card p-6"
          >
            <p className="text-xs text-muted-foreground">{stat.title}</p>
            <p className="mt-1 text-2xl font-medium text-foreground">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-[4px] border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Dashboard day du se hoat dong o Phase 11
        </p>
      </div>
    </div>
  );
}
