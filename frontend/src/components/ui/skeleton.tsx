import * as React from "react";
import { cn } from "../../lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md border border-white/8 bg-white/6 before:absolute before:inset-0 before:animate-[pulse_1.6s_ease-in-out_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/14 before:to-transparent",
        className,
      )}
      {...props}
    />
  );
}
