# PLAN_IMPLEMENTATION.md

> **Nguyên tắc:** Mỗi phase có 1 dòng Output (cho PM/Founder đọc nhanh) + khối `<details>` chứa checklist task (cho AI Agent).
>
> Đánh dấu `[x]` khi task hoàn thành. Cập nhật `**Status:**` của phase: `⬜ Chưa bắt đầu` → `🟡 Đang làm` → `✅ Hoàn thành`.

**CURRENT PHASE: Phase 00 — Infrastructure** (tìm phase có status 🟡 hoặc phase ⬜ đầu tiên)

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

**Status:** ✅ Hoan thanh (code core) — cho Vercel + DNS + API keys tu Founder

<details>
<summary>📋 Chi tiet task (cho AI Agent)</summary>

### 00.1 — Monorepo & Tooling
- [x] Khoi tao monorepo pnpm: `pnpm-workspace.yaml`, `.npmrc` (`shamefully-hoist=false`, `strict-peer-dependencies=true`)
- [x] Turborepo config (`turbo.json`): pipeline `build`, `lint`, `typecheck`, `test`, `dev`
- [x] TypeScript config dung chung: `packages/config/tsconfig/base.json`, `nextjs.json`, `node.json`
- [x] ESLint config dung chung: `packages/config/eslint/base.js`, `next.js`, `node.js`
- [x] Prettier config goc: `packages/config/prettier/.prettierrc.json`
- [x] Husky pre-commit: `lint-staged` (chay ESLint + Prettier tren file staged) + emoji check
- [x] `.gitignore` + `.gitattributes` hoan chinh

### 00.2 — Next.js App Skeleton
- [x] Tao `apps/web` thu cong (Next.js 16.2.9, App Router, TypeScript, pnpm)
- [x] `next.config.ts`: Be Vietnam Pro (`next/font/google`), CSP headers, image domains (supabase.co, r2.dev)
- [x] Cai `@supabase/ssr` + `@supabase/supabase-js` trong `apps/web` (doi tu 00.4)
- [x] Tach `.env` → `.env.local` / `.env.staging` / `.env.production` (doi tu 00.4)
- [x] Route group skeletons — moi group co `layout.tsx` + `page.tsx` toi thieu:
  - `(marketing)/` — "Coming Soon" placeholder
  - `(auth)/` — "Login/Register" placeholder
  - `(app)/` — "Dashboard" placeholder (bao ve boi middleware)
  - `(admin)/` — "Admin" placeholder (bao ve boi middleware)
- [x] `middleware.ts` skeleton: nhan dien route group, redirect `/login` neu thieu session (logic that o Phase 01)

### 00.3 — Theme & Design System
- [ ] Cai dat shadcn/ui (`npx shadcn@latest init`): theme `neutral`, `--radius=0` (can interactive terminal — CSS da san sang)
- [x] Font Be Vietnam Pro qua `next/font/google`, weights: **chi 400 va 500**
- [x] CSS variables: dark-first (`.dark` class mac dinh), light mode toggle placeholder o V2
- [x] Typography scale: chi cho phep `text-xs` → `text-4xl`, cam arbitrary size (Tailwind v4 — CSS-based, khong co tailwind.config.ts)
- [x] Cam font weight > 500, cam italic, cam font size < 12px — enforced qua code review + lint-staged
- [x] Cam emoji — enforced qua lint-staged (check Unicode emoji range)
- [x] Component shared skeletons: `LoadingSkeleton`, `Toast`, `ConfirmDialog`, `EmptyState`, `ErrorState` (chi tao file + interface, chua code day du)

### 00.4 — Supabase

**Status:** ✅ Skipped — ly do: Cloud project `rmtmrkgqrjodzcbwlhom` (ap-southeast-1) da duoc tao san, API keys day du trong `.env`. Local dev ket noi truc tiep cloud, khong can Docker local. 2 task con lai (cai packages + tach env) da doi len 00.2.

- [x] ~~Tao 3 Supabase project~~ — 1 cloud project dung chung moi moi truong, tach project rieng khi can staging/production that
- [x] ~~`supabase init`~~ + ~~`supabase start`~~ — khong can Docker local, cloud project co san
- [x] ~~Ghi env~~ — `.env` da co du `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`; tach file env doi len 00.2
- [x] ~~Cai packages~~ — doi len 00.2

### 00.5 — Deploy & CI/CD
- [ ] Ket noi GitHub repo voi Vercel → deploy lan dau len `edu.doanquangkien.com` (**BLOCKER: can Founder**)
- [ ] Cau hinh Vercel: domain `edu.doanquangkien.com` + `staging.edu.doanquangkien.com` (**BLOCKER: can Founder**)
- [ ] Cau hinh env vars tren Vercel dashboard (**BLOCKER: can Founder**)
- [x] CI/CD GitHub Actions: workflow `.github/workflows/ci.yml` — lint → typecheck → build
- [ ] Xac nhan: push len `main` → deploy production, push len `staging` → deploy staging, PR moi → preview deploy (**BLOCKER: can Vercel**)

### 00.6 — Verify
- [ ] Mo `edu.doanquangkien.com` — thay landing "Coming Soon" theme dark, font Be Vietnam Pro (**can deploy**)
- [ ] Mo `edu.doanquangkien.com/login` — thay placeholder Login (**can deploy**)
- [ ] Mo `edu.doanquangkien.com/dashboard` — redirect ve `/login` (middleware hoat dong) (**can deploy**)
- [x] `pnpm lint` + `pnpm typecheck` + `pnpm build` pass locally

</details>

---

## Phase 01 — Auth & Core Database

**Output:** Đăng nhập/đăng ký hoạt động (email, Google, Magic Link), schema core + RLS, mỗi role thấy đúng layout

**Status:** ⬜ Chưa bắt đầu

**Phụ thuộc:** Phase 00 hoàn thành

<details>
<summary>📋 Chi tiết task (cho AI Agent)</summary>

- [ ] Supabase Auth: Email/Password + Google OAuth + Magic Link
- [ ] Migration: `profiles`, `organizations`, `permissions`
- [ ] Postgres trigger `handle_new_user()` tự tạo profile
- [ ] Hàm helper `current_user_role()` cho RLS policy
- [ ] RLS policies + GRANT cho toàn bộ bảng core
- [ ] Middleware auth guard: redirect /login nếu không có session
- [ ] Route group layouts: `(marketing)`, `(auth)`, `(app)`, `(admin)`
- [ ] Trang Onboarding sau đăng ký lần đầu (chọn CEFR level, daily goal)
- [ ] Trang Login/Register UI

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
