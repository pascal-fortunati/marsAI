import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type ComboboxOption = {
    value: string;
    label: string;
};

export function Combobox({
    value,
    onChange,
    options,
    placeholder,
    className,
    contentClassName,
    searchPlaceholder = "Rechercher...",
    emptyText = "Aucun résultat",
    renderOption,
    renderValue,
    searchable = true,
    disabled = false,
    triggerStyle,
}: {
    value: string;
    onChange: (value: string) => void;
    options: ComboboxOption[];
    placeholder: string;
    className?: string;
    contentClassName?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    renderOption?: (option: ComboboxOption) => React.ReactNode;
    renderValue?: (option: ComboboxOption) => React.ReactNode;
    searchable?: boolean;
    disabled?: boolean;
    triggerStyle?: React.CSSProperties;
}) {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const selected = options.find((opt) => opt.value === value) ?? null;
    const filteredOptions = React.useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return options;
        return options.filter((opt) =>
            `${opt.label} ${opt.value}`.toLowerCase().includes(q)
        );
    }, [options, query]);

    React.useEffect(() => {
        if (!open) setQuery("");
    }, [open]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    style={triggerStyle}
                    className={cn(
                        "w-full rounded-xl border border-white/10 bg-white/[0.03] px-[14px] py-[11px] text-xs text-white/85 outline-none transition-[border-color,background,box-shadow] duration-200 focus-visible:border-[#7d71fb]/50 focus-visible:bg-[#7d71fb]/[0.04] focus-visible:shadow-[0_0_0_3px_rgba(125,113,251,0.08)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                        "flex items-center justify-between",
                        className
                    )}
                >
                    <div className="min-w-0 flex-1 truncate text-left">
                        {selected
                            ? renderValue
                                ? renderValue(selected)
                                : selected.label
                            : placeholder}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className={cn(
                    "w-[var(--radix-popover-trigger-width)] rounded-xl border border-white/10 bg-white/[0.03] p-0 text-white shadow-[0_16px_42px_rgba(5,3,13,0.55)] backdrop-blur-xl",
                    contentClassName
                )}
            >
                {searchable ? (
                    <div className="border-b border-white/10 bg-white/[0.02] p-2">
                        <input
                            placeholder={searchPlaceholder}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-[14px] py-[11px] text-xs text-white/85 outline-none transition-[border-color,background,box-shadow] duration-200 placeholder:text-white/20 focus-visible:border-[#7d71fb]/50 focus-visible:bg-[#7d71fb]/[0.04] focus-visible:shadow-[0_0_0_3px_rgba(125,113,251,0.08)] focus-visible:outline-none"
                        />
                    </div>
                ) : null}
                <div className="max-h-[300px] overflow-y-auto bg-transparent p-1">
                    {filteredOptions.length === 0 ? (
                        <div className="py-6 text-center text-sm text-white/45">
                            {emptyText}
                        </div>
                    ) : (
                        filteredOptions.map((option) => (
                            <button
                                type="button"
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setOpen(false);
                                }}
                                className="flex w-full items-center rounded-sm px-2 py-1.5 text-left text-xs text-white/90 outline-none transition hover:bg-white/10"
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === option.value ? "opacity-100" : "opacity-0"
                                    )}
                                ></Check>
                                <div className="min-w-0 flex-1 truncate">
                                    {renderOption ? renderOption(option) : option.label}
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
