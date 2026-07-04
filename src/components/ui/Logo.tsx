import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <Image
      src="/icons/icon-96.png"
      alt="Social App"
      width={size}
      height={size}
      priority
      className={cn("rounded-lg", className)}
    />
  );
}
