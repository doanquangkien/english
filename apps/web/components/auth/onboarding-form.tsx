"use client";

import { useState, useActionState } from "react";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { completeOnboarding } from "@/lib/actions/auth";

const CEFR_LEVELS = [
  {
    value: "A1",
    label: "Mới bắt đầu",
    description: "Bạn chưa biết gì hoặc mới biết vài từ cơ bản",
  },
  {
    value: "A2",
    label: "Cơ bản",
    description: "Bạn có thể giao tiếp trong các tình huống đơn giản",
  },
  {
    value: "B1",
    label: "Trung cấp",
    description: "Bạn có thể đọc hiểu và nói về các chủ đề quen thuộc",
  },
  {
    value: "B2",
    label: "Trung cấp trên",
    description: "Bạn có thể giao tiếp tương đối trôi chảy và tự nhiên",
  },
  {
    value: "C1",
    label: "Nâng cao",
    description:
      "Bạn có thể sử dụng tiếng Anh linh hoạt trong công việc và học thuật",
  },
  {
    value: "C2",
    label: "Thành thạo",
    description: "Bạn sử dụng tiếng Anh gần như người bản ngữ",
  },
] as const;

const DAILY_GOALS = [
  { value: 5, label: "5 phút/ngày", description: "Nhẹ nhàng" },
  { value: 15, label: "15 phút/ngày", description: "Đều đặn (khuyến nghị)" },
  { value: 30, label: "30 phút/ngày", description: "Nghiêm túc" },
  { value: 60, label: "60 phút/ngày", description: "Cấp tốc" },
] as const;

export function OnboardingForm() {
  const [step, setStep] = useState(1);
  const [cefrLevel, setCefrLevel] = useState<string>("");
  const [dailyGoal, setDailyGoal] = useState<number | null>(null);
  const [serverError, formAction, isPending] = useActionState(
    completeOnboarding,
    null,
  );

  if (step === 1) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-lg rounded-none border-border">
          <CardHeader className="text-center">
            <p className="text-sm text-muted-foreground">Bước 1/2</p>
            <h1 className="text-2xl font-medium text-foreground">
              Trình độ hiện tại của bạn?
            </h1>
          </CardHeader>
          <CardContent className="space-y-3">
            {CEFR_LEVELS.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => setCefrLevel(level.value)}
                className={`w-full rounded-[4px] border p-4 text-left transition-colors hover:border-primary ${
                  cefrLevel === level.value
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card"
                }`}
              >
                <div className="font-medium text-foreground">
                  {level.value} — {level.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {level.description}
                </div>
              </button>
            ))}
            <Button
              onClick={() => setStep(2)}
              disabled={!cefrLevel}
              className="w-full rounded-[4px]"
            >
              Tiếp tục
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 2
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-lg rounded-none border-border">
        <CardHeader className="text-center">
          <p className="text-sm text-muted-foreground">Bước 2/2</p>
          <h1 className="text-2xl font-medium text-foreground">
            Mục tiêu hằng ngày?
          </h1>
        </CardHeader>
        <CardContent className="space-y-3">
          {DAILY_GOALS.map((goal) => (
            <button
              key={goal.value}
              type="button"
              onClick={() => setDailyGoal(goal.value)}
              className={`w-full rounded-[4px] border p-4 text-left transition-colors hover:border-primary ${
                dailyGoal === goal.value
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
              }`}
            >
              <div className="font-medium text-foreground">{goal.label}</div>
              <div className="text-sm text-muted-foreground">
                {goal.description}
              </div>
            </button>
          ))}

          <form action={formAction}>
            <input type="hidden" name="cefrLevel" value={cefrLevel} />
            <input
              type="hidden"
              name="dailyGoalMinutes"
              value={dailyGoal ?? ""}
            />

            {serverError?.error ? (
              <p className="mb-3 text-sm text-destructive">
                {serverError.error}
              </p>
            ) : null}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                disabled={isPending}
                className="rounded-[4px]"
              >
                <ArrowLeft size={16} className="mr-2" />
                Quay lại
              </Button>
              <Button
                type="submit"
                disabled={!dailyGoal || isPending}
                className="flex-1 rounded-[4px]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  "Bắt đầu học!"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
