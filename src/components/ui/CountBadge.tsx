import { cn } from "@/lib/utils";

export function CountBadge({ count, className }: { count: number; className?: string }) {
  if (count <= 0) return null;
  return (
    <span
      className={cn(
        "flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold leading-none text-white",
        className,
      )}
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}
