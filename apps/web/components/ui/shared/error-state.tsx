export interface ErrorStateProps {
  /** Error title */
  title?: string;
  /** Error message */
  message?: string;
  /** Retry button label */
  retryLabel?: string;
  /** Called when retry is clicked */
  onRetry?: () => void;
  /** Custom class name */
  className?: string;
}

/**
 * Error state component shown when a component fails to load or an action fails.
 */
export function ErrorState({
  title = "Da xay ra loi",
  message,
  retryLabel = "Thu lai",
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 text-center ${className}`}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[4px] border border-destructive/30 bg-destructive/10">
        <svg
          className="h-6 w-6 text-destructive"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      {message ? (
        <p className="mt-1 text-xs text-muted-foreground">{message}</p>
      ) : null}
      {onRetry ? (
        <button
          onClick={onRetry}
          className="mt-4 rounded-[4px] border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          {retryLabel}
        </button>
      ) : null}
    </div>
  );
}
