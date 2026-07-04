import { cn, initials } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-8 w-8 text-micro",
  md: "h-10 w-10 text-body-sm",
  lg: "h-14 w-14 text-h2",
};

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        className={cn("rounded-full object-cover", sizeMap[size], className)}
      />
    );
  }
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700",
        sizeMap[size],
        className,
      )}
    >
      {initials(name)}
    </div>
  );
}
