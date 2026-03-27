import * as React from "react";
import { cn } from "../../lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "w-full rounded-xl border border-border bg-input px-[14px] py-[11px] text-xs text-foreground/90 outline-none transition-[border-color,background,box-shadow] duration-200 placeholder:text-muted-foreground/70 focus-visible:border-[#7d71fb]/50 focus-visible:bg-[#7d71fb]/[0.04] focus-visible:shadow-[0_0_0_3px_rgba(125,113,251,0.08)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";
