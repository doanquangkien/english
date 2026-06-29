export interface LoadingSkeletonProps {
  /** Number of skeleton rows */
  rows?: number;
  /** Custom class name */
  className?: string;
}

/**
 * Placeholder loading skeleton with pulse animation.
 * Full implementation will be done when needed by specific features.
 */
export function LoadingSkeleton({
  rows = 3,
  className = "",
}: LoadingSkeletonProps) {
  return (
    <div
      className={`space-y-4 ${className}`}
      role="status"
      aria-label="Loading..."
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-4 animate-pulse rounded-[4px] bg-muted"
          style={{ width: `${100 - (i % 3) * 15}%` }}
        />
      ))}
    </div>
  );
}
