import * as React from "react";
import { DayPicker } from "react-day-picker";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

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
      className={cn(
        "rounded-xl border border-white/10 bg-white/[0.03] p-3",
        className
      )}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-4",
        month_caption: "relative flex items-center justify-center h-9",
        caption_label:
          "pointer-events-none text-xs font-medium capitalize text-white/80",
        dropdowns: "inline-flex items-center gap-1.5",
        dropdown_root: "inline-flex items-center",
        dropdown:
          "h-8 rounded-md border border-white/12 bg-white/[0.03] px-2 text-xs text-white/85 outline-none transition-[border-color,background] duration-200 focus-visible:border-[#7d71fb]/50 focus-visible:bg-[#7d71fb]/[0.04]",
        months_dropdown: "min-w-[108px]",
        years_dropdown: "min-w-[84px]",
        nav: "absolute inset-x-0 top-2 flex items-center justify-between px-2",
        button_previous:
          "inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-white/10 bg-white/[0.03] p-0 text-white/70 transition hover:bg-white/[0.08] hover:text-white disabled:pointer-events-none disabled:opacity-40",
        button_next:
          "inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-white/10 bg-white/[0.03] p-0 text-white/70 transition hover:bg-white/[0.08] hover:text-white disabled:pointer-events-none disabled:opacity-40",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "w-9 rounded-md text-center text-[0.8rem] font-normal text-white/35",
        week: "mt-2 flex w-full",

        // Les classes d'état doivent matcher exactement les sélecteurs CSS ci-dessus
        day: "rdp-day h-9 w-9 p-0 text-center text-sm",
        day_button:
          "rdp-day_button inline-flex h-9 w-9 items-center justify-center rounded-lg p-0 font-normal text-white/85 transition-[background,color,box-shadow] duration-150 hover:bg-white/[0.08] hover:text-white",
        selected: "rdp-selected",
        today: "rdp-today",
        outside: "rdp-outside",
        disabled: "rdp-disabled",
        range_middle: "rdp-range_middle",
        range_start: "rdp-range_start",
        range_end: "rdp-range_end",
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
