import * as React from "react";
import { DayPicker } from "react-day-picker";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { buttonVariants } from "./button-variants";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-4",
        month_caption: "relative flex items-center justify-center h-9",
        caption_label:
          "pointer-events-none text-xs font-medium capitalize text-white/80",
        dropdowns: "relative inline-flex items-center gap-1.5",
        dropdown_root:
          "relative inline-flex h-8 items-center rounded-md border border-white/12 bg-white/5 px-2 text-xs",
        dropdown: "absolute inset-0 z-10 cursor-pointer opacity-0",
        months_dropdown: "pr-4",
        years_dropdown: "pr-4",
        nav: "absolute inset-x-0 top-2 flex items-center justify-between px-2",
        button_previous: cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "h-7 w-7 bg-transparent p-0 opacity-60 hover:opacity-100"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "h-7 w-7 bg-transparent p-0 opacity-60 hover:opacity-100"
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center",
        week: "mt-2 flex w-full",
        day: "h-9 w-9 p-0 text-center text-sm",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        selected:
          "bg-primary text-primary-foreground hover:opacity-90 focus:opacity-90",
        today: "bg-muted/30 text-foreground",
        outside: "text-muted-foreground opacity-50",
        disabled: "text-muted-foreground opacity-50",
        range_middle: "aria-selected:bg-muted/30 aria-selected:text-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ className: cnIn, orientation, ...p }) =>
          orientation === "left" ? (
            <ChevronLeft className={cn("h-4 w-4", cnIn)} {...p} />
          ) : orientation === "down" ? (
            <ChevronDown
              className={cn("h-3.5 w-3.5 opacity-70", cnIn)}
              {...p}
            />
          ) : (
            <ChevronRight className={cn("h-4 w-4", cnIn)} {...p} />
          ),
      }}
      {...props}
    />
  );
}
