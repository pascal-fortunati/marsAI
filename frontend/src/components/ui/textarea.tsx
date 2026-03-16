import * as React from 'react'
import { cn } from '../../lib/utils'

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "w-full rounded-xl border border-white/10 bg-white/[0.03] px-[14px] py-[11px] text-xs text-white/85 outline-none transition-[border-color,background,box-shadow] duration-200 placeholder:text-white/20 focus-visible:border-[#7d71fb]/50 focus-visible:bg-[#7d71fb]/[0.04] focus-visible:shadow-[0_0_0_3px_rgba(125,113,251,0.08)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'
