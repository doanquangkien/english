export interface ConfirmDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Dialog title */
  title: string;
  /** Dialog description */
  description: string;
  /** Confirm button label */
  confirmLabel?: string;
  /** Cancel button label */
  cancelLabel?: string;
  /** Called when user confirms */
  onConfirm: () => void;
  /** Called when user cancels */
  onCancel: () => void;
  /** Whether this is a destructive action */
  variant?: "default" | "destructive";
}

/**
 * Confirmation dialog component.
 * Full implementation will use shadcn/ui AlertDialog.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Xac nhan",
  cancelLabel = "Huy",
  onConfirm,
  onCancel,
  variant = "default",
}: ConfirmDialogProps) {
  if (!open) return null;

  const confirmStyles =
    variant === "destructive"
      ? "bg-destructive text-destructive-foreground hover:opacity-90"
      : "bg-primary text-primary-foreground hover:opacity-90";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-[4px] border border-border bg-card p-6">
        <h3 className="text-lg font-medium text-foreground">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-[4px] border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-[4px] px-4 py-2 text-sm font-medium ${confirmStyles}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
