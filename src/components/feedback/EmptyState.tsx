import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-neutral-200 px-6 py-16 text-center">
      {icon && <div className="text-neutral-300">{icon}</div>}
      <p className="text-h2 font-semibold text-ink">{title}</p>
      {description && (
        <p className="max-w-xs text-body text-neutral-500">{description}</p>
      )}
      {action}
    </div>
  );
}
