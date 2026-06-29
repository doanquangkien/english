export interface EmptyStateProps {
  /** Main title */
  title: string;
  /** Optional description */
  description?: string;
  /** Optional action label */
  actionLabel?: string;
  /** Called when action is clicked */
  onAction?: () => void;
  /** Custom class name */
  className?: string;
}

/**
 * Empty state component shown when a list or search has no results.
 */
export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 text-center ${className}`}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[4px] border border-border bg-muted">
        <svg
          className="h-6 w-6 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description ? (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      ) : null}
      {actionLabel && onAction ? (
        <button
          onClick={onAction}
          className="mt-4 rounded-[4px] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
