# PLAN_IMPLEMENTATION.md

> **Nguyên tắc:** Mỗi phase có 1 dòng Output (cho PM/Founder đọc nhanh) + khối `<details>` chứa checklist task (cho AI Agent).
>
> Đánh dấu `[x]` khi task hoàn thành. Cập nhật `**Status:**` của phase: `⬜ Chưa bắt đầu` → `🟡 Đang làm` → `✅ Hoàn thành`.

**CURRENT PHASE: Phase 02 — LMS Core** (tìm phase có status 🟡 hoặc phase ⬜ đầu tiên)

> ⚠️ **Lưu ý cho Agent:** Checklist tổng hợp (trước code, trước PR, go-live) nằm ở [`CHECKLIST.md`](CHECKLIST.md) — đọc trước khi bắt đầu phase đầu tiên. File này chỉ chứa task chi tiết từng phase.

---

## PHẠM VI TRIỂN KHAI (SCOPE)

### MVP — Mục tiêu: ra mắt nhanh nhất, validate giả thuyết sản phẩm

| Phạm vi | Có trong MVP? |
|---|---|
| Auth (Email, Google, Magic Link) | ✅ |
| LMS cơ bản (1-2 khoá học mẫu do team tự tạo) | ✅ |
| Flashcard + SRS | ✅ |
| Reading + click-to-lookup | ✅ |
| Dictionary (cache + freedictionaryapi.com) | ✅ |
| Quiz Engine (multiple_choice, fill_blank, typing — 3 loại cơ bản) | ✅ |
| Grammar (5-10 bài lý thuyết quan trọng nhất + quiz) | ✅ |
| AI Teacher (free_chat mode duy nhất) | ✅ |
| Gamification (XP, Streak, 5 badge cơ bản) | ✅ |
| Dashboard | ✅ |
| Payment | ❌ (mọi thứ free để tối đa hoá người dùng thử) |
| Listening, Speaking, Writing | ❌ → V1 |
| Admin CMS đầy đủ | 🔶 Chỉ phần tối thiểu để team tự quản trị nội dung |
| Blog | ❌ → V1 |

### V1 — Sau MVP có tín hiệu tích cực, hoàn thiện 6 trụ cột

- Listening, Speaking (Azure Pronunciation Assessment), Writing (AI grading) đầy đủ
- Quiz Engine đủ 10 `question_type`
- Payment (Stripe + VNPay), Plans Free/Premium
- Blog + SEO content engine
- Admin CMS đầy đủ + Analytics cơ bản
- AI Teacher đủ 5 mode (free_chat, roleplay, grammar_correction, exercise_generator, translate)
- Mission/Badge/Leaderboard đầy đủ
- Import/Export Anki

### V2 — Mở rộng quy mô & chiều sâu

- Multi-tenancy thật (nhiều Organization, white-label B2B)
- Mobile App native (React Native, tái sử dụng `packages/ai-core`, `packages/srs-engine`)
- Video call với giáo viên người thật (LiveKit/Daily.co), marketplace giáo viên
- Passkey, Phone OTP
- Multi-language (schema đã có `language_code`)
- Public API cho đối tác (`/api/v1/...`)
- Social features (kết bạn, học nhóm, thi đua bạn bè)

### V3 — Tầm nhìn dài hạn

- Personalized Learning Path bằng AI (tự động sinh lộ trình theo điểm yếu thực tế)
- Voice-first AI Teacher (hội thoại giọng nói 2 chiều realtime)
- Chứng chỉ được công nhận rộng rãi (hợp tác tổ chức giáo dục/doanh nghiệp)
- Marketplace nội dung cho bên thứ ba (giáo viên bán khoá học, revenue-sharing)

---

## Phase 00 — Infrastructure

**Output:** App "Hello World" deploy được lên production URL `edu.doanquangkien.com` — theme đúng, 4 route group skeleton hoạt động, CI/CD pass.

**Status:** ✅ Hoàn thành (code core) — chờ Vercel + DNS + API keys từ Founder

<details>
<summary>📋 Chi tiết task (cho AI Agent)</summary>

### 00.1 — Monorepo & Tooling
- [x] Khởi tạo monorepo pnpm: `pnpm-workspace.yaml`, `.npmrc` (`shamefully-hoist=false`, `strict-peer-dependencies=true`)
- [x] Turborepo config (`turbo.json`): pipeline `build`, `lint`, `typecheck`, `test`, `dev`
- [x] TypeScript config dùng chung: `packages/config/tsconfig/base.json`, `nextjs.json`, `node.json`
- [x] ESLint config dùng chung: `packages/config/eslint/base.js`, `next.js`, `node.js`
- [x] Prettier config gốc: `packages/config/prettier/.prettierrc.json`
- [x] Husky pre-commit: `lint-staged` (chạy ESLint + Prettier trên file staged) + emoji check
- [x] `.gitignore` + `.gitattributes` hoàn chỉnh

### 00.2 — Next.js App Skeleton
- [x] Tạo `apps/web` thủ công (Next.js 16.2.9, App Router, TypeScript, pnpm)
- [x] `next.config.ts`: Be Vietnam Pro (`next/font/google`), CSP headers, image domains (supabase.co, r2.dev)
- [x] Cài `@supabase/ssr` + `@supabase/supabase-js` trong `apps/web` (dời từ 00.4)
- [x] Tách `.env` → `.env.local` / `.env.staging` / `.env.production` (dời từ 00.4)
- [x] Route group skeletons — mỗi group có `layout.tsx` + `page.tsx` tối thiểu:
  - `(marketing)/` — "Coming Soon" placeholder
  - `(auth)/` — "Login/Register" placeholder
  - `(app)/` — "Dashboard" placeholder (bảo vệ bởi middleware)
  - `(admin)/` — "Admin" placeholder (bảo vệ bởi middleware)
- [x] `middleware.ts` skeleton: nhận diện route group, redirect `/login` nếu thiếu session (logic thật ở Phase 01)

### 00.3 — Theme & Design System
- [ ] Cài đặt shadcn/ui (`npx shadcn@latest init`): theme `neutral`, `--radius=0` (cần interactive terminal — CSS đã sẵn sàng)
- [x] Font Be Vietnam Pro qua `next/font/google`, weights: **chỉ 400 và 500**
- [x] CSS variables: dark-first (`.dark` class mặc định), light mode toggle placeholder ở V2
- [x] Typography scale: chỉ cho phép `text-xs` → `text-4xl`, cấm arbitrary size (Tailwind v4 — CSS-based, không có tailwind.config.ts)
- [x] Cấm font weight > 500, cấm italic, cấm font size < 12px — enforced qua code review + lint-staged
- [x] Cấm emoji — enforced qua lint-staged (check Unicode emoji range)
- [x] Component shared skeletons: `LoadingSkeleton`, `Toast`, `ConfirmDialog`, `EmptyState`, `ErrorState` (chỉ tạo file + interface, chưa code đầy đủ)

### 00.4 — Supabase

**Status:** ✅ Skipped — lý do: Cloud project `rmtmrkgqrjodzcbwlhom` (ap-southeast-1) đã được tạo sẵn, API keys đầy đủ trong `.env`. Local dev kết nối trực tiếp cloud, không cần Docker local. 2 task còn lại (cài packages + tách env) đã dời lên 00.2.

- [x] ~~Tạo 3 Supabase project~~ — 1 cloud project dùng chung mọi môi trường, tách project riêng khi cần staging/production thật
- [x] ~~`supabase init`~~ + ~~`supabase start`~~ — không cần Docker local, cloud project có sẵn
- [x] ~~Ghi env~~ — `.env` đã có đủ `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`; tách file env dời lên 00.2
- [x] ~~Cài packages~~ — dời lên 00.2

### 00.5 — Deploy & CI/CD
- [ ] Kết nối GitHub repo với Vercel → deploy lần đầu lên `edu.doanquangkien.com` (**BLOCKER: cần Founder**)
- [ ] Cấu hình Vercel: domain `edu.doanquangkien.com` + `staging.edu.doanquangkien.com` (**BLOCKER: cần Founder**)
- [ ] Cấu hình env vars trên Vercel dashboard (**BLOCKER: cần Founder**)
- [x] CI/CD GitHub Actions: workflow `.github/workflows/ci.yml` — lint → typecheck → build
- [ ] Xác nhận: push lên `main` → deploy production, push lên `staging` → deploy staging, PR mới → preview deploy (**BLOCKER: cần Vercel**)

### 00.6 — Verify
- [ ] Mở `edu.doanquangkien.com` — thấy landing "Coming Soon" theme dark, font Be Vietnam Pro (**cần deploy**)
- [ ] Mở `edu.doanquangkien.com/login` — thấy placeholder Login (**cần deploy**)
- [ ] Mở `edu.doanquangkien.com/dashboard` — redirect về `/login` (middleware hoạt động) (**cần deploy**)
- [x] `pnpm lint` + `pnpm typecheck` + `pnpm build` pass locally

</details>

---

## Phase 01 — Auth & Core Database

**Output:** Đăng nhập/đăng ký hoạt động (email, Google, Magic Link), schema core + RLS, mỗi role thấy đúng layout

**Status:** ✅ Hoàn thành (code) — chờ Founder cấp Supabase keys + chạy migration

**Phụ thuộc:** Phase 00 hoàn thành + Supabase API keys trong `.env.local`

> 📖 **Trước khi code, đọc:** [`PHASE_01_QUEST.md`](PHASE_01_QUEST.md) — 31 quyết định đã chốt (next-intl strategy, shadcn config, form library, onboarding flow, RLS pattern, middleware matcher, state machine...)

<details>
<summary>📋 Chi tiết task (cho AI Agent)</summary>

### 01.0 — Tiền điều kiện
- [ ] Kiểm tra `.env.local` có đủ `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `npx shadcn@latest init` — style: default, baseColor: neutral, cssVariables: true, rsc: true, tsx: true, aliases: `@/components` + `@/lib/utils`
- [ ] Cài shadcn components: `button`, `input`, `label`, `form`, `card`, `separator`, `sonner`
- [ ] Cài `react-hook-form` + `zod` + `@hookform/resolvers`

### 01.1 — Database: Migration 001
- [ ] Tạo enum `user_role` (`student`, `teacher`, `admin`, `super_admin`)
- [ ] Tạo enum `cefr_level` (`A1`, `A2`, `B1`, `B2`, `C1`, `C2`)
- [ ] Tạo bảng `organizations` (id, name, slug UNIQUE, owner_id FK→profiles, plan, created_at)
- [ ] Tạo bảng `profiles` (id PK FK→auth.users, org_id nullable FK→organizations, display_name, username UNIQUE nullable, avatar_url, role, cefr_level, native_language, timezone, daily_goal_minutes, current_streak, longest_streak, total_xp, onboarding_completed_at, created_at, updated_at)
- [ ] Tạo bảng `permissions` (role, resource, action, allowed) — PK kép (role, resource, action)
- [ ] Trigger `handle_new_user()`: AFTER INSERT ON auth.users → INSERT INTO profiles (id, role='student')
- [ ] Function `current_user_role()`: returns user_role from profiles where id = auth.uid()
- [ ] Enable RLS trên cả 3 bảng
- [ ] GRANT SELECT, INSERT, UPDATE, DELETE ON profiles, organizations, permissions TO authenticated
- [ ] GRANT SELECT ON profiles, organizations TO anon
- [ ] RLS policies cho `profiles`: SELECT (của mình hoặc admin), INSERT (authenticated), UPDATE (của mình hoặc admin)
- [ ] RLS policies cho `organizations`: SELECT (thành viên org hoặc admin), INSERT (authenticated), UPDATE (owner hoặc admin)
- [ ] RLS policies cho `permissions`: SELECT (authenticated), INSERT/UPDATE/DELETE (super_admin only)
- [ ] Seed `permissions`: 4 role × resources hiện tại (profiles, organizations) × actions (create, read, update, delete) theo matrix SPEC 5.4
- [ ] Chạy `npx supabase db push` lên cloud

### 01.2 — Supabase Types & Clients
- [ ] Generate types: `npx supabase gen types typescript --linked > apps/web/lib/supabase/database.types.ts`
- [ ] Verify `lib/supabase/server.ts` — `createServerClient` dùng cookies từ `next/headers`
- [ ] Verify `lib/supabase/client.ts` — `createBrowserClient` cho Client Components
- [ ] Thêm `createServiceClient` trong `lib/supabase/server.ts` — dùng `SUPABASE_SERVICE_ROLE_KEY` (server-only, bypass RLS)

### 01.3 — next-intl tái tích hợp
- [ ] Cập nhật `src/i18n/routing.ts`: locale `vi` default, `as-needed` prefix
- [ ] Cập nhật `src/i18n/request.ts`: `setRequestLocale` pattern — gọi trong từng layout/page, KHÔNG gọi trong root layout
- [ ] Bổ sung `messages/vi.json`: namespace `auth` (login, register, oauth, magicLink, errors) + `onboarding` (title, steps, submit)
- [ ] Root layout: thêm `NextIntlClientProvider` (messages loaded từ page-level, không phải root)
- [ ] Middleware: KHÔNG dùng `intlMiddleware` (tránh Dynamic route)

### 01.4 — Auth UI: Login/Register
- [ ] Tạo `components/auth/auth-card.tsx` — wrapper centered card (rounded-none, border, nền card)
- [ ] Tạo `components/auth/login-form.tsx` — email + password + submit button + "Quên mật khẩu?" link
- [ ] Tạo `components/auth/register-form.tsx` — display_name + email + password + confirm_password + submit
- [ ] Tạo `components/auth/oauth-buttons.tsx` — Google OAuth button + Magic Link button
- [ ] Tạo `components/auth/magic-link-form.tsx` — email input + "Gửi link đăng nhập" + trạng thái "Check email"
- [ ] Tạo `lib/validations/auth.ts` — Zod schemas: `loginSchema`, `registerSchema`, `magicLinkSchema`
- [ ] Form validation: Email required+format+max255, Password min8+max128, Display Name min2+max100, Confirm Password match
- [ ] Toggle show/hide password (icon eye/eye-off)
- [ ] State machine: idle → submitting → success → redirecting; submitting → error → idle
- [ ] Dùng `useActionState` (React 19) cho form submission
- [ ] Toast notification qua `sonner` (success: "Đăng nhập thành công", error: hiển thị lỗi cụ thể)
- [ ] Tab Login | Register trên cùng 1 page `/login`
- [ ] Cập nhật `app/(auth)/login/page.tsx` — thay placeholder bằng form thật
- [ ] Cập nhật `app/(auth)/layout.tsx` — centered layout, không header/footer

### 01.5 — Auth Logic: Server Actions
- [ ] Tạo `lib/actions/auth.ts`:
  - `signInWithPassword(formData)` — supabase.auth.signInWithPassword → set cookie → return redirect URL
  - `signUp(formData)` — supabase.auth.signUp → return success/error (email verification off)
  - `signInWithGoogle()` — supabase.auth.signInWithOAuth('google') → return redirect URL
  - `signInWithMagicLink(formData)` — supabase.auth.signInWithOtp → return success/error
  - `signOut()` — supabase.auth.signOut → redirect /login
- [ ] Error mapping: Supabase error code → tiếng Việt message (invalid_credentials → "Email hoặc mật khẩu không đúng", email_taken → "Email đã được sử dụng", ...)

### 01.6 — Auth Callback
- [ ] Tạo `app/(auth)/auth/callback/route.ts`:
  - GET handler: `exchangeCodeForSession(code)` → lấy user → check `onboarding_completed_at`
  - Redirect: IS NULL → `/onboarding?next=<...>`, NOT NULL → `/<next_param>` hoặc `/dashboard`
- [ ] Whitelist redirect URLs trong Supabase dashboard: production, localhost, staging

### 01.7 — Middleware nâng cấp
- [ ] Thay hardcode cookie check → `createServerClient` + `getUser()`
- [ ] Matcher config: `/dashboard/:path*`, `/admin/:path*`, `/login`, `/onboarding`, `/auth/callback`
- [ ] Logic:
  - `/dashboard/*` hoặc `/admin/*` không user → redirect `/login?next=<original_url>`
  - `/login` có user → redirect `/dashboard`
  - `/onboarding` có user + `onboarding_completed_at` NOT NULL → redirect `/dashboard`
  - `/auth/callback` → để route handler xử lý
- [ ] KHÔNG check role trong middleware — để layout `(admin)/layout.tsx` check

### 01.8 — Onboarding Flow
- [ ] Tạo `components/auth/onboarding-form.tsx` — 2 bước (step 1: chọn CEFR, step 2: chọn daily goal)
- [ ] Mỗi option hiển thị label tiếng Việt + mô tả ngắn
- [ ] Tạo route `app/(app)/onboarding/page.tsx` — full-page, không sidebar
- [ ] Server Action `completeOnboarding(cefr_level, daily_goal_minutes)`:
  - UPDATE profiles SET cefr_level, daily_goal_minutes, onboarding_completed_at = now()
  - Redirect `/dashboard`
- [ ] Middleware: bảo vệ `/onboarding` — chỉ user đã login mới vào được

### 01.9 — Role-based Layouts
- [ ] `(admin)/layout.tsx`: check `current_user_role()` — nếu NOT IN ('admin', 'super_admin') → redirect `/dashboard`
- [ ] `(app)/layout.tsx`: hiển thị sidebar + user info (display_name, avatar placeholder)
- [ ] `(admin)/admin/page.tsx`: thay placeholder — hiển thị "Admin Dashboard" + stats thật (total users, total courses)
- [ ] `(app)/dashboard/page.tsx`: thay placeholder — hiển thị welcome message + CEFR level + daily goal

### 01.10 — Verify
- [ ] `pnpm lint` + `pnpm typecheck` + `pnpm build` pass
- [ ] Migration 001 chạy trên Supabase cloud không lỗi
- [ ] Đăng ký email/password → `handle_new_user()` trigger tạo profile
- [ ] Đăng nhập email/password → redirect `/dashboard`
- [ ] Google OAuth → callback → redirect đúng
- [ ] Magic Link → gửi email → click → đăng nhập
- [ ] User mới → `/onboarding` → chọn level + goal → redirect `/dashboard`
- [ ] `/dashboard` không session → redirect `/login?next=/dashboard`
- [ ] `/admin` không session → redirect `/login`
- [ ] `/admin` role=student → redirect `/dashboard`
- [ ] Middleware dùng `getUser()` — không còn hardcode cookie
- [ ] next-intl: text tiếng Việt hiển thị đúng từ `vi.json`
- [ ] RLS: user A không đọc được profile user B (test manual qua Supabase dashboard)

</details>

---

## Phase 02 — LMS Core

**Output:** CRUD khóa học, chapter, lesson, enrollment hoạt động. Học viên enroll được và học lesson đầu tiên.

**Status:** ⬜ Chưa bắt đầu

**Phụ thuộc:** Phase 01 hoàn thành

<details>
<summary>📋 Chi tiết task (cho AI Agent)</summary>

- [ ] Migration: `courses`, `course_chapters`, `lessons`, `lesson_videos`, `enrollments`, `user_lesson_progress`, `certificates`
- [ ] RLS policies + GRANT cho nhóm bảng LMS
- [ ] Trang `/courses` (danh sách, filter CEFR/category/giá)
- [ ] Trang `/courses/[slug]` (chi tiết khoá học, public, SEO)
- [ ] Trang `/courses/[slug]/learn` (trình học — Client Component, render content_blocks)
- [ ] Server Actions: `enrollCourse`, `markLessonComplete`
- [ ] Queries: `getCourseDetail`, `getUserEnrollments`, `getLessonContent`
- [ ] Cập nhật `enrollments.progress_percent` khi hoàn thành lesson
- [ ] Seed 1-2 khoá học mẫu để test

</details>

---

## Phase 03 — Flashcard (SRS)

**Output:** Học viên tạo deck, thêm thẻ, review hằng ngày theo thuật toán SM-2 cải tiến

**Status:** ⬜ Chưa bắt đầu

**Phụ thuộc:** Phase 01 hoàn thành (không phụ thuộc Phase 02)

<details>
<summary>📋 Chi tiết task (cho AI Agent)</summary>

- [ ] Package `packages/srs-engine`: thuật toán SM-2 (4 mức grade) + unit test
- [ ] Migration: `flashcard_decks`, `flashcards`, `flashcard_reviews`, `flashcard_review_logs`
- [ ] RLS policies + GRANT
- [ ] Server Actions: `createDeck`, `addCard`, `reviewCard`
- [ ] Queries: `getDueCards`, `getDeckStats`
- [ ] Trang `/flashcards` (danh sách deck)
- [ ] Trang `/flashcards/review` (Review Session — flip animation, 4 nút grade)
- [ ] Import Anki `.apkg` (dùng `sql.js` WASM)
- [ ] Export `.apkg`

</details>

---

## Phase 04 — Dictionary

**Output:** Tra từ hoạt động (cache cứng + fallback API), trang chi tiết từ SEO-friendly

**Status:** ⬜ Chưa bắt đầu

**Phụ thuộc:** Phase 01 hoàn thành

<details>
<summary>📋 Chi tiết task (cho AI Agent)</summary>

- [ ] Migration: `dictionary_entries`
- [ ] Seed: Oxford 3000 từ phổ biến (từ WordNet/freedictionaryapi.com)
- [ ] Service `getDictionaryEntry(word)`: cache → freedictionaryapi.com → AI fallback
- [ ] Trang `/dictionary/[word]` (ISR + generateStaticParams cho 3000 từ)
- [ ] Component `<DictionaryPopover>` (hiện khi click từ trong Reading)
- [ ] Attribution Wiktionary (CC BY-SA 4.0) hiển thị đúng vị trí
- [ ] Job cron đồng bộ entry cũ >6 tháng

</details>

---

## Các phase tiếp theo (dự kiến)

| Phase | Module | Mô tả ngắn | Phụ thuộc |
|---|---|---|---|
| 05 | Reading & Listening | Bài đọc có click-to-lookup, Dictation, Fill-blank | 01, 04 |
| 06 | Quiz Engine | Engine đa định dạng (multiple_choice, fill_blank, drag_drop...) | 01 |
| 07 | Speaking | Azure Pronunciation Assessment, ghi âm, chấm điểm | 01 |
| 08 | Writing | AI chấm writing, grammar errors, rewrite suggestion | 01, 06 |
| 09 | Grammar & Vocabulary | Bài lý thuyết + quiz (tái sử dụng Quiz Engine) | 02, 06 |
| 10 | AI Teacher | Chat đa mode (free_chat, roleplay, grammar_correction...) | 01 |
| 11 | Dashboard | Heatmap, streak widget, progress tracking | 01, 02, 03 |
| 12 | Gamification | XP, badges, missions, leaderboard | 02, 03, 06 |
| 13 | Payment | Stripe + VNPay subscription, webhook | 01 |
| 14 | Blog & CMS | Blog SEO + Admin dashboard | 01, 02 |
| 15 | Landing & SEO | Landing page, pricing, sitemap, robots.txt | 01, 02, 14 |
| 16 | E2E Testing & Go-Live | Playwright E2E, load test, Sentry, go-live checklist | Tất cả phase trên |

> **Ghi chú:** Thứ tự và danh sách phase có thể điều chỉnh dựa trên thực tế triển khai. Các phase độc lập (03, 04, 06, 10, 13) có thể chạy song song nếu có nhiều người.
