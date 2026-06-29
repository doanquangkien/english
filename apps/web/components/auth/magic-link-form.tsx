"use client";

import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { magicLinkSchema, type MagicLinkInput } from "@/lib/validations/auth";
import { signInWithMagicLink } from "@/lib/actions/auth";

interface MagicLinkFormProps {
  onBack: () => void;
}

export function MagicLinkForm({ onBack }: MagicLinkFormProps) {
  const [serverState, formAction, isPending] = useActionState(
    signInWithMagicLink,
    null,
  );

  const form = useForm<MagicLinkInput>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: { email: "" },
  });

  // If magic link was sent successfully, show confirmation
  if (serverState?.success) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Mail size={24} className="text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Kiểm tra email của bạn</h2>
          <p className="text-sm text-muted-foreground">
            Chúng tôi đã gửi link đăng nhập đến{" "}
            <span className="font-medium text-foreground">
              {form.getValues("email")}
            </span>
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="rounded-[4px]"
        >
          <ArrowLeft size={16} className="mr-2" />
          Quay lại đăng nhập
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  disabled={isPending}
                  className="rounded-[4px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {serverState?.error ? (
          <p className="text-sm text-destructive">{serverState.error}</p>
        ) : null}

        <Button
          type="submit"
          disabled={isPending}
          className="w-full rounded-[4px]"
        >
          {isPending ? "Đang gửi..." : "Gửi link đăng nhập"}
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="w-full rounded-[4px]"
        >
          <ArrowLeft size={16} className="mr-2" />
          Quay lại đăng nhập
        </Button>
      </form>
    </Form>
  );
}
