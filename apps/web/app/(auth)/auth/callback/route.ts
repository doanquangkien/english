import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        new URL(`/login?error=auth_callback_failed`, request.url),
      );
    }
  }

  // After successful exchange, determine redirect
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check if user needs onboarding
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed_at")
    .eq("id", user.id)
    .single();

  if (!profile?.onboarding_completed_at) {
    const onboardingUrl = new URL("/onboarding", request.url);
    if (next) onboardingUrl.searchParams.set("next", next);
    return NextResponse.redirect(onboardingUrl);
  }

  // User fully onboarded — redirect to next or dashboard
  const fallback = next ?? "/dashboard";
  return NextResponse.redirect(new URL(fallback, request.url));
}
