export interface ToastProps {
  /** Toast variant */
  variant?: "default" | "success" | "error" | "warning";
  /** Toast title */
  title: string;
  /** Optional description */
  description?: string;
  /** Called when toast is dismissed */
  onDismiss?: () => void;
}

/**
 * Toast notification component.
 * Full implementation will use shadcn/ui sonner or custom portal-based toast.
 */
export function Toast({
  variant = "default",
  title,
  description,
  onDismiss,
}: ToastProps) {
  const variantStyles: Record<string, string> = {
    default: "border-border bg-card",
    success: "border-green-800 bg-green-950 text-green-100",
    error: "border-red-800 bg-red-950 text-red-100",
    warning: "border-yellow-800 bg-yellow-950 text-yellow-100",
  };

  return (
    <div
      className={`rounded-[4px] border p-4 ${variantStyles[variant]}`}
      role="alert"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">{title}</p>
        {onDismiss ? (
          <button
            onClick={onDismiss}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Dong
          </button>
        ) : null}
      </div>
      {description ? (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
