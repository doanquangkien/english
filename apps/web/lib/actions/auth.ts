"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import {
  loginSchema,
  registerSchema,
  magicLinkSchema,
  onboardingSchema,
} from "@/lib/validations/auth";

export interface AuthState {
  error: string | null;
  success?: string;
}

// ============================================================
// Error message mapping: Supabase error → Vietnamese
// ============================================================
function mapAuthError(error: { code?: string; message?: string }): string {
  const code = error.code ?? error.message ?? "";
  if (
    code.includes("invalid_credentials") ||
    code.includes("Invalid login credentials")
  )
    return "Email hoặc mật khẩu không đúng";
  if (code.includes("email_taken") || code.includes("already been registered"))
    return "Email đã được sử dụng";
  if (code.includes("too_many_requests") || code.includes("rate_limit"))
    return "Quá nhiều lần thử. Vui lòng đợi một lát.";
  if (code.includes("otp") || code.includes("token"))
    return "Mã xác thực không hợp lệ hoặc đã hết hạn";
  if (code.includes("user_not_found"))
    return "Không tìm thấy tài khoản với email này";
  return "Đã có lỗi xảy ra. Vui lòng thử lại.";
}

// ============================================================
// Email / Password
// ============================================================

export async function signInWithPassword(
  _prevState: AuthState | null,
  formData: FormData,
): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: mapAuthError(error) };
  }

  revalidatePath("/", "layout");
  return { error: null };
}

export async function signUp(
  _prevState: AuthState | null,
  formData: FormData,
): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        display_name: parsed.data.displayName,
      },
    },
  });

  if (error) {
    return { error: mapAuthError(error) };
  }

  return {
    error: null,
    success: "Đăng ký thành công! Vui lòng kiểm tra email để xác thực.",
  };
}

// ============================================================
// Google OAuth
// ============================================================

export async function signInWithGoogle(): Promise<AuthState> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) {
    return { error: mapAuthError(error) };
  }

  if (data.url) {
    redirect(data.url);
  }

  return { error: "Không thể kết nối với Google. Vui lòng thử lại." };
}

// ============================================================
// Magic Link
// ============================================================

export async function signInWithMagicLink(
  _prevState: AuthState | null,
  formData: FormData,
): Promise<AuthState> {
  const parsed = magicLinkSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) {
    return { error: mapAuthError(error) };
  }

  return { error: null, success: "Đã gửi link đăng nhập đến email của bạn." };
}

// ============================================================
// Sign Out
// ============================================================

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

// ============================================================
// Onboarding
// ============================================================

export async function completeOnboarding(
  _prevState: AuthState | null,
  formData: FormData,
): Promise<AuthState> {
  const parsed = onboardingSchema.safeParse({
    cefrLevel: formData.get("cefrLevel"),
    dailyGoalMinutes: formData.get("dailyGoalMinutes"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };
  }

  const supabase = await createServiceClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Bạn cần đăng nhập để tiếp tục." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      cefr_level: parsed.data.cefrLevel,
      daily_goal_minutes: parsed.data.dailyGoalMinutes,
      onboarding_completed_at: new Date().toISOString(),
      display_name: user.user_metadata?.display_name ?? null,
    })
    .eq("id", user.id);

  if (error) {
    return { error: "Không thể lưu cài đặt. Vui lòng thử lại." };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
