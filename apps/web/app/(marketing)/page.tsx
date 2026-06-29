import { getTranslations } from "next-intl/server";

export default async function MarketingPage() {
  const t = await getTranslations("landing");

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="max-w-2xl space-y-8">
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            ENGLISH
          </p>
          <h1 className="text-4xl font-medium leading-tight text-foreground">
            {t("title")}
          </h1>
          <p className="text-base text-muted-foreground">{t("description")}</p>
        </div>

        <div className="rounded-[4px] border border-border bg-card px-8 py-6">
          <p className="text-lg font-medium text-foreground">Coming Soon</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Chung toi dang xay dung nen tang hoc tieng Anh the he moi. Hay quay
            lai som!
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 text-left sm:grid-cols-3">
          {[
            { label: "Doc", en: "Reading" },
            { label: "Nghe", en: "Listening" },
            { label: "Noi", en: "Speaking" },
            { label: "Viet", en: "Writing" },
            { label: "Ngu phap", en: "Grammar" },
            { label: "Tu vung", en: "Vocabulary" },
          ].map((skill) => (
            <div
              key={skill.en}
              className="rounded-[4px] border border-border p-4 text-center"
            >
              <p className="text-sm font-medium text-foreground">
                {skill.label}
              </p>
              <p className="text-xs text-muted-foreground">{skill.en}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
