import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Vui lòng nhập email")
    .max(255, "Email không được vượt quá 255 ký tự")
    .email("Email không đúng định dạng"),
  password: z
    .string()
    .min(1, "Vui lòng nhập mật khẩu")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .max(128, "Mật khẩu không được vượt quá 128 ký tự"),
});

export const registerSchema = z
  .object({
    displayName: z
      .string()
      .min(1, "Vui lòng nhập họ tên")
      .min(2, "Họ tên phải có ít nhất 2 ký tự")
      .max(100, "Họ tên không được vượt quá 100 ký tự"),
    email: z
      .string()
      .min(1, "Vui lòng nhập email")
      .max(255, "Email không được vượt quá 255 ký tự")
      .email("Email không đúng định dạng"),
    password: z
      .string()
      .min(1, "Vui lòng nhập mật khẩu")
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .max(128, "Mật khẩu không được vượt quá 128 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const magicLinkSchema = z.object({
  email: z
    .string()
    .min(1, "Vui lòng nhập email")
    .max(255, "Email không được vượt quá 255 ký tự")
    .email("Email không đúng định dạng"),
});

export const onboardingSchema = z.object({
  cefrLevel: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"], {
    message: "Vui lòng chọn trình độ",
  }),
  dailyGoalMinutes: z.coerce
    .number()
    .refine((v) => [5, 15, 30, 60].includes(v), {
      message: "Vui lòng chọn mục tiêu hằng ngày",
    }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type MagicLinkInput = z.infer<typeof magicLinkSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;
