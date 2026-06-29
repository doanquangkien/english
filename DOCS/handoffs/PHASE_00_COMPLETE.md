# PHASE_00: Infrastructure

> **Ngay hoan thanh:** 2026-06-29
> **Nguoi thuc hien:** AI Agent (Claude Code)
> **Branch:** `master`
> **Commit cuoi:** (xem git log)
> **Handoff nay danh cho:** Nguoi thuc hien Phase 01 (Auth & Core Database)

> **Luu y cap nhat:** Next.js 16 da bo `next lint` → dung ESLint truc tiep. TypeScript 6 da deprecated `baseUrl`. Xem ADR neu co quyet dinh moi.

---

## 1. Muc tieu thuc te da dat duoc

Phase 00 da hoan thanh viec khoi tao monorepo pnpm voi Next.js 16.2.9, TypeScript 6, Tailwind CSS 4.3.1. Da tao xong 4 route group skeleton (`/`, `/login`, `/dashboard`, `/admin`) voi theme dark-first, font Be Vietnam Pro (400/500), sharp corners. Middleware skeleton da chan duoc `/dashboard` va `/admin` (redirect ve `/login` khi chua co session cookie). CI/CD GitHub Actions da san sang. `pnpm lint`, `pnpm typecheck`, `pnpm build` deu pass.

**CHUA deploy** — can Founder cau hinh Vercel + DNS + dien Supabase API keys.

## 2. Nhung gi DA lam — File Manifest

### Root config

| File | Muc dich | Ghi chu |
|---|---|---|
| `pnpm-workspace.yaml` | Monorepo pnpm: `apps/*`, `packages/*`, `packages/config/*` | Added |
| `.npmrc` | `shamefully-hoist=false`, `strict-peer-dependencies=true` | Added |
| `turbo.json` | Pipeline: build, lint, typecheck, test, dev | Added |
| `package.json` | Root scripts + husky + lint-staged + pnpm.onlyBuiltDependencies | Added |
| `.github/workflows/ci.yml` | CI: lint → typecheck → build tren push/PR main+staging | Added |
| `.gitignore` | Da bo sung `.claude/` | Modified |

### packages/config/tsconfig

| File | Muc dich | Ghi chu |
|---|---|---|
| `package.json` | `@edu-platform/tsconfig` | Added |
| `base.json` | ES2024, strict, bundler, noUnusedLocals | Added |
| `nextjs.json` | Extends base, jsx preserve, next plugin | Added |
| `node.json` | Extends base, NodeNext | Added |

### packages/config/eslint

| File | Muc dich | Ghi chu |
|---|---|---|
| `package.json` | `@edu-platform/eslint-config`, type=module | Added |
| `base.js` | typescript-eslint + prettier | Added |
| `next.js` | next + react + react-hooks plugins | Added |
| `node.js` | base + no-console off | Added |

### packages/config/prettier

| File | Muc dich | Ghi chu |
|---|---|---|
| `package.json` | `@edu-platform/prettier-config` | Added |
| `.prettierrc.json` | semi, singleQuote=false, trailingComma=all | Added |

### apps/web

| File | Muc dich | Ghi chu |
|---|---|---|
| `package.json` | Next.js 16.2.9 + React 19.2.7 + Supabase + Tailwind v4 | Added |
| `tsconfig.json` | Extends `@edu-platform/tsconfig/nextjs.json`, `@/*` → `./*` | Added |
| `next.config.ts` | CSP headers, image domains, next-intl plugin, i18n | Added |
| `postcss.config.mjs` | `@tailwindcss/postcss` plugin | Added |
| `eslint.config.mjs` | Flat config: js + tseslint + next + react + react-hooks | Added |
| `.env.local` | Local env template (API keys can dien) | Added |
| `.env.staging` | Staging env (placeholder) | Added |
| `.env.production` | Production env (placeholder) | Added |
| `src/i18n/request.ts` | next-intl request config | Added |
| `src/i18n/routing.ts` | Locale: vi, default: vi | Added |
| `src/i18n/navigation.ts` | createNavigation helper | Added |
| `messages/vi.json` | Vietnamese translation strings | Added |
| `src/middleware.ts` | Auth guard (check Supabase cookie) + i18n | Added |
| `app/globals.css` | Tailwind v4 + dark-first theme + oklch variables | Added |
| `app/layout.tsx` | Root layout: Be Vietnam Pro + JetBrains Mono, dark class | Added |
| `app/page.tsx` | Redirect `/` → `/` (root) | Added |
| `app/(marketing)/layout.tsx` | Public layout: header + footer | Added |
| `app/(marketing)/page.tsx` | Landing "Coming Soon" + 6 skill cards | Added |
| `app/(auth)/layout.tsx` | Centered auth layout | Added |
| `app/(auth)/login/page.tsx` | Login placeholder (disabled form) | Added |
| `app/(app)/layout.tsx` | App shell: sidebar + main content | Added |
| `app/(app)/dashboard/page.tsx` | Dashboard placeholder: stat cards | Added |
| `app/(admin)/layout.tsx` | Admin shell: sidebar + main content | Added |
| `app/(admin)/admin/page.tsx` | Admin dashboard placeholder: 4 stat cards | Added |
| `lib/supabase/client.ts` | Browser client (createBrowserClient) | Added |
| `lib/supabase/server.ts` | Server client + service client (createServerClient) | Added |
| `components/ui/shared/loading-skeleton.tsx` | LoadingSkeleton component (rows, animate-pulse) | Added |
| `components/ui/shared/toast.tsx` | Toast component (4 variants) | Added |
| `components/ui/shared/confirm-dialog.tsx` | ConfirmDialog component (default/destructive) | Added |
| `components/ui/shared/empty-state.tsx` | EmptyState component (icon + title + action) | Added |
| `components/ui/shared/error-state.tsx` | ErrorState component (icon + message + retry) | Added |

### Hooks

| File | Muc dich | Ghi chu |
|---|---|---|
| `.husky/_/pre-commit` | lint-staged + emoji check (grep UTF-8 byte sequences) | Modified |

## 3. Quyet dinh da THAY DOI so voi SPEC

| Spec noi | Thuc te lam | Ly do |
|---|---|---|
| Dung `next lint` | Dung `eslint . --ext .ts,.tsx,.js,.jsx` | Next.js 16 da bo `next lint` command hoan toan |
| `tsconfig.baseUrl: "."` | Bo `baseUrl`, chi dung `paths` | TypeScript 6.0 deprecated `baseUrl` |
| Tao app bang `create-next-app` | Tao thu cong `apps/web` | De kiem soat chinh xac version Next.js 16.2.9, React 19.2.7 |
| Admin route group `(admin)/page.tsx` | Dat `(admin)/admin/page.tsx` | Tranh conflict route `/` voi `(marketing)/page.tsx` |
| `tailwind.config.ts` | Khong co (Tailwind v4 CSS-based) | Tailwind v4.3.1 cau hinh qua CSS `@theme`, khong dung file config JS |
| Font weight restrictions qua ESLint `no-restricted-syntax` | Qua code review + lint-staged | ESLint AST selectors khong match duoc className strings |
| `@eslint/js@^9.33.0`, `typescript-eslint@^8.44.0` | `@eslint/js@^9.39.4`, `typescript-eslint@^8.40.0` | Version trong SPEC chua duoc publish tai thoi diem cai dat |
| shadcn/ui init qua `npx shadcn@latest init` | Chua chay, CSS variables da san sang | Can interactive terminal — CSS theme da duoc cau hinh thu cong |
| Dung shared ESLint configs tu `packages/config/eslint/` | Web app dung `eslint.config.mjs` doc lap | Flat config imports tu package co san don gian hon |

## 4. Technical Debt & Known Issues

| Van de | Muc do nghiem trong | Du kien sua o phase nao |
|---|---|---|
| shadcn/ui init chua chay — component imports se loi neu dung shadcn components | Thap | Phase 01 (can terminal interactive) |
| Emoji check chi bat duoc mot so range UTF-8 pho bien | Thap | Khong can — code review la chinh |
| `pnpm lint` o root chi chay `turbo lint` → chi lint `apps/web` (cac packages config khong co file .ts) | Thap | Khong can — config packages la JSON va JS thuan |
| Middleware su dung hardcoded Supabase project reference (`sb-rmtmrkgqrjodzcbwlhom-auth-token`) | Trung binh | Phase 01 — can env variable hoac Supabase client |

## 5. Nhung gi CHUA lam (du plan noi se lam)

| Hang muc | Ly do doi lai | Phase du kien |
|---|---|---|
| Deploy len `edu.doanquangkien.com` | Can Founder cau hinh Vercel + DNS | Phase 00 (Founder) |
| Dien Supabase API keys vao `.env.local` | Can Founder cung cap keys | Phase 00 (Founder) |
| `npx shadcn@latest init` | Can interactive terminal | Phase 01 |
| Verify middleware tren production | Chua deploy | Sau khi deploy |
| CI pass lan dau tren GitHub | Chua push | Sau khi push |

## 6. Huong dan cho Phase 01

Neu ban dang code Phase 01 (Auth & Core Database), hay bat dau bang cach:

1. **Doc truoc:** `DOCS/SPECIFICATION.md` Chuong 5 (Authentication & Authorization) + Chuong 4 (Database schema — bang `profiles`, `organizations`, `permissions`)
2. **Kiem tra env:** Dam bao `.env.local` da co day du Supabase keys (`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) — hien tai dang trong
3. **Chay thu:** `pnpm dev` → mo `http://localhost:3000` → xac nhan landing page hien thi
4. **Middleware that:** Thay logic check cookie cung (`sb-rmtmrkgqrjodzcbwlhom-auth-token`) bang `createServerClient` tu `@supabase/ssr` + `getUser()` — xem [Next.js Supabase Auth docs](https://supabase.com/docs/guides/auth/server-side/nextjs)
5. **Luu y:** Theme da la dark-first, font Be Vietnam Pro (400/500), `rounded-[4px]` cho buttons/inputs, `rounded-none` cho cards/modals. Khong dung emoji, khong `font-bold`, khong `italic`.
6. **Supabase client:** Da co san `lib/supabase/server.ts` (2 loai: regular + service_role) va `lib/supabase/client.ts` (browser) — co the dung ngay.
7. **shadcn/ui:** Chay `npx shadcn@latest init` truoc khi code UI — chon neutral theme, radius=0, CSS variables da san sang trong `globals.css`.
8. **File gioi han:** Nho SPEC Chuong 32: file ≤300 dong, component ≤200 dong, ham ≤50 dong.

## 7. Moi truong & Bien moi truong

| Bien | Gia tri (dev) | Muc dich |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://rmtmrkgqrjodzcbwlhom.supabase.co` | Supabase cloud project (ap-southeast-1) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (trong — can Founder) | Supabase anon key (safe for client) |
| `SUPABASE_SERVICE_ROLE_KEY` | (trong — can Founder) | Supabase service_role (server-only, bypass RLS) |
| `OPENROUTER_API_KEY` | (trong — can Founder) | Open Router API key cho AI Service Layer |
| `CRON_SECRET` | (trong — can Founder) | Secret cho Vercel Cron jobs |
| `AI_FAILBACK_1_MODEL` | (trong — can Founder) | Model failback 1 (Open Router format) |
| `AI_FAILBACK_2_MODEL` | (trong — can Founder) | Model failback 2 (Open Router format) |
