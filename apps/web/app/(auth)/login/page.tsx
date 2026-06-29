export default function LoginPage() {
  return (
    <div className="rounded-[4px] border border-border bg-card p-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-medium text-foreground">Dang nhap</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Dang nhap de bat dau hoc
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="name@example.com"
            disabled
            className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-foreground"
          >
            Mat khau
          </label>
          <input
            id="password"
            type="password"
            placeholder="********"
            disabled
            className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <button
          type="button"
          disabled
          className="w-full rounded-[4px] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          Dang nhap
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Chuc nang dang nhap se hoat dong o Phase 01
      </p>
    </div>
  );
}
