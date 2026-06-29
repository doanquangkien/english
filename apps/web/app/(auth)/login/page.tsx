"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { MagicLinkForm } from "@/components/auth/magic-link-form";

type AuthView = "login" | "register" | "magic-link";

export default function LoginPage() {
  const [view, setView] = useState<AuthView>("login");

  if (view === "magic-link") {
    return (
      <AuthCard
        title="Đăng nhập không cần mật khẩu"
        subtitle="Nhập email để nhận link đăng nhập"
      >
        <MagicLinkForm onBack={() => setView("login")} />
      </AuthCard>
    );
  }

  if (view === "register") {
    return (
      <AuthCard title="Đăng ký" subtitle="Tạo tài khoản miễn phí">
        <RegisterForm />

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <button
            type="button"
            onClick={() => setView("login")}
            className="font-medium text-primary hover:underline"
          >
            Đăng nhập
          </button>
        </div>
      </AuthCard>
    );
  }

  // Login view (default)
  return (
    <AuthCard title="Đăng nhập" subtitle="Đăng nhập để bắt đầu học">
      <LoginForm onSwitchToMagicLink={() => setView("magic-link")} />

      <div className="my-6 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">hoặc</span>
        <Separator className="flex-1" />
      </div>

      <OAuthButtons />

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Chưa có tài khoản?{" "}
        <button
          type="button"
          onClick={() => setView("register")}
          className="font-medium text-primary hover:underline"
        >
          Đăng ký ngay
        </button>
      </div>
    </AuthCard>
  );
}
